"""
    This tool recursively map sequenced files to any number of index files in given order.
    usage: dophin_wrapper.py [options]
"""
# imports
import logging
import warnings
import MySQLdb
import os, re, string, sys, commands
from sys import argv, exit, stderr
from optparse import OptionParser
from os.path import dirname, exists, join
from os import system
import subprocess
from subprocess import Popen, PIPE
import json
import ConfigParser
import time

warnings.filterwarnings('ignore', '.*the sets module is deprecated.*',
         DeprecationWarning, 'MySQLdb')

from workflowdefs import *

class Dolphin:
    bin_dir = dirname(argv[0])
    cmd = 'python %(dolphin_tools_dir)s/runWorkflow.py -f %(params_section)s -i %(input_fn)s -w %(workflow)s -p %(dolphin_default_params)s -u %(username)s -o %(outdir)s %(wkeystr)s'
    config = ConfigParser.ConfigParser()
    params_section = ''
    
    def __init__(self, params_section):
        self.params_section = params_section
        
    def runSQL(self, sql):
        db = MySQLdb.connect(
          host = self.config.get(self.params_section, "db_host"),
          user = self.config.get(self.params_section, "db_user"),
          passwd = self.config.get(self.params_section, "db_password"),
          db = self.config.get(self.params_section, "db_name"),
          port = int(self.config.get(self.params_section, "db_port")))
        try:
          cursor = db.cursor()
          cursor.execute(sql)
          #print sql
          results = cursor.fetchall()
          cursor.close()
          del cursor
    
        except Exception, err:
          print "ERROR DB:for help use --help"
          db.rollback()
          sys.stderr.write('ERROR: %s\n' % str(err))
          sys.exit(2)
        finally:
          db.commit()
          db.close()
        return results

    def updatePID(self, rpid, pid):
        sql = "UPDATE ngs_runparams SET wrapper_pid='%s',runworkflow_pid='%s' WHERE id='%s'"%(os.getpid(), pid, rpid)
        return self.runSQL(sql)
    def getRunParamsID(self, rpid):
         rpstr="";
         if (rpid > 0):
           rpstr=" AND nrp.id=%s"%str(rpid)
         sql = "SELECT DISTINCT nrl.run_id, u.username, nrp.barcode from ngs_runlist nrl, ngs_runparams nrp, users u where nrp.id=nrl.run_id and u.id=nrl.owner_id and nrp.run_status=0 %s;"%rpstr
         return self.trySQL(sql, "getRunParamsID")

    def trySQL(self, sql, func):
        trials=0
        while trials<5:
           print trials
           ret = self.runSQL(sql)
           print "LEN:"+str(len(ret))

           if (len(ret)>0):
              return ret

           time.sleep(15)
           trials=trials+1 

        return ret 
 
    def getRunParams(self, runparamsid):
        sql = "SELECT json_parameters from ngs_runparams where run_status=0 and id='%d'"%runparamsid
        result = self.runSQL(sql)
        for row in result:
            #print row[0]
            return json.loads(row[0])
    
    def getAmazonCredentials(self, username):
        sql = 'SELECT DISTINCT ac.* FROM amazon_credentials ac, group_amazon ga, users u where ac.id=ga.amazon_id and ga.group_id=u.group_id and u.username="'+username+'";'
        results = self.runSQL(sql)
    
        return results
    
    def getDirs(self, runparamsid, isbarcode):
    
        tablename="ngs_fastq_files"
        fields="d.backup_dir fastq_dir, d.backup_dir, d.amazon_bucket, rp.outdir"
        idmatch="s.id=tl.sample_id"
        sql = "SELECT DISTINCT %(fields)s FROM ngs_runlist nr, ngs_samples s, %(tablename)s tl, ngs_dirs d, ngs_runparams rp where nr.sample_id=s.id and rp.run_status=0 and %(idmatch)s and d.id=tl.dir_id and rp.id=nr.run_id and nr.run_id='"+str(runparamsid)+"';"
    
        results=self.runSQL(sql%locals())
        if (not results):
           fields="d.fastq_dir, d.backup_dir, d.amazon_bucket, rp.outdir"
           if (isbarcode):
               idmatch="s.lane_id=tl.lane_id"
               tablename="ngs_temp_lane_files"
           else:
               tablename="ngs_temp_sample_files"
           results=self.runSQL(sql%locals())
        return results[0]
    
    def getSampleList(self, runparamsid):
        tablename="ngs_fastq_files"
        sql = "SELECT s.samplename, ts.file_name FROM ngs_runparams nrp, ngs_runlist nr, ngs_samples s, %(tablename)s ts, ngs_dirs d where nr.run_id=nrp.id and nr.sample_id=s.id and nrp.run_status=0 and s.id=ts.sample_id and d.id=ts.dir_id and nr.run_id='"+str(runparamsid)+"';"
        samplelist=self.runSQL(sql%locals())
        if (not samplelist):
            tablename="ngs_temp_sample_files"
            samplelist=self.runSQL(sql%locals())
        return self.getInputParams(samplelist)
    
    def getInputParams(self, samplelist):
        inputparams=""
        for row in samplelist:
            if (inputparams):
               inputparams=inputparams+":"
            inputparams=inputparams+row[0]+","+row[1]
        spaired=None
        if (',' in row[1]):
            spaired="paired"
        return (spaired, inputparams)
    
    def getLaneList(self, runparamsid):
        tablename="ngs_fastq_files"
        sql = "SELECT DISTINCT %(fields)s FROM ngs_runlist nrl, ngs_runparams nrp, ngs_samples s, %(tablename)s tl where nrl.run_id=nrp.id and nrp.run_status=0 and s.lane_id = tl.lane_id and s.id=nrl.sample_id and nrp.id='"+str(runparamsid)+"';"
        fields='tl.file_name'
    
        result=self.runSQL(sql%locals())
        if (not result):
            tablename="ngs_temp_lane_files"
            result=self.runSQL(sql%locals())
    
        inputparams=""
        for row in result:
            if (inputparams):
                inputparams=inputparams+":"
            inputparams=inputparams+row[0]
        spaired=None
        if (',' in row[0]):
            spaired="paired"
    
        fields='s.samplename, s.barcode'
        result=self.runSQL(sql%locals())
        if (not result):
            tablename="ngs_fastq_files"
            result=self.runSQL(sql%locals())
    
        barcode="Distance,1:Format,5"
        for row in result:
            barcode=barcode+":"+row[0]+","+row[1]
        return (spaired, inputparams, barcode)

    def write_input(self,  input_fn, data_dir, content,genomebuild,spaired,barcodes,adapter, quality, trim,trimpaired, split, commonind, advparams, customind, pipeline) :
       if ('DIR' in content):
           content = content.replace( 'DIR', data_dir )
       else:
           if (str(barcodes) != "None"):
               content = data_dir+"/"+content
               content = content.replace( ':', ":"+data_dir+"/" )
           content = content.replace( ',', ","+data_dir+"/" )
       content = re.sub(r'/+','/',content)
    
       gb=genomebuild.split(',')
       previous="NONE"
       fp = open( input_fn, 'w' )
       print >>fp, '@CONFIG=%s'%self.params_section
       print >>fp, '@GENOME=%s'%gb[0]
       gb[1] = re.sub('test', '', gb[1])
       genomeindex=gb[1]
    
       print >>fp, '@VERSION=%s'%gb[1]
       print >>fp, '@INPUT=%s'%content
       print >>fp, '@DATADIR=%s'%data_dir
       print >>fp, '@OUTFILE=%s'%input_fn
       print >>fp, '@GENOMEBUILD=%s,%s'%(gb[0],gb[1])
       print >>fp, '@SPAIRED=%s'%spaired
       barcodeflag=0
    
       if (barcodes and barcodes.lower() != 'none'):
         print >>fp, '@BARCODES=%s'%self.parse_content(barcodes)
         barcodeflag=1
         previous="BARCODE"
       else:
         print >>fp, '@BARCODES=NONE'
    
       if (adapter and adapter.lower() != 'none'):
         print >>fp, '@ADAPTER=%s'%self.parse_content(adapter)
         print >>fp, '@PREVIOUSADAPTER=%s'%previous
         previous="ADAPTER"
       else:
         print >>fp, '@ADAPTER=NONE'
    
       if (quality and quality.lower() != 'none'):
         print >>fp, '@QUALITY=%s'%self.parse_content(quality)
         print >>fp, '@PREVIOUSQUALITY=%s'%previous
         previous="QUALITY"
       else:
         print >>fp, '@QUALITY=NONE'
    
       if (trim and trim.lower() != 'none'):
         print >>fp, '@TRIM=%s'%trim
         print >>fp, '@TRIMPAIRED=%s'%trimpaired
         print >>fp, '@PREVIOUSTRIM=%s'%previous
         previous="TRIM"
       else:
         print >>fp, '@TRIM=NONE'
    
       if(split and split.lower() != 'none'):
         print >>fp, '@PREVIOUSSPLIT=%s'%previous
         previous="SPLIT"
       else:
         print >>fp, '@PREVIOUSSPLIT=NONE'

       if (commonind and commonind.lower() != 'none'):
         arr=re.split(r'[,:]+', self.parse_content(commonind))
    
         for i in arr:
           if(len(i)>1):
              default_bowtie_params="@DEFBOWTIE2PARAM"
              default_description="@DEFDESCRIPTION"
           print >>fp, '@PARAM%s=@GCOMMONDB/%s/%s,%s,%s,%s,1,%s'%(i,i,i,i,default_bowtie_params,default_description,previous)
           if (i != "ucsc" and i != gb[1]):
              previous=i
    
         if (advparams):
            print >>fp, '@ADVPARAMS=%s'%(self.parse_content(advparams))
         else:
            print >>fp, '@ADVPARAMS=NONE'
    
       mapnames=commonind
       if (not mapnames or mapnames.lower() == 'none'):
          mapnames="";
       if (customind):
          for i in customind:
            arr=re.split(r'[,:]+', self.parse_content(customind))
            index=self.parse_content(arr[0])
            name=self.parse_content(self.replace_space(arr[1]))
            mapnames=str(mapnames)+name+":"+index+","
            bowtie_params=self.parse_content(self.replace_space(arr[2]))
            description=self.parse_content(self.replace_space(arr[3]))
            filter_out=arr[4]
    
            print >>fp, '@PARAM%s=%s,%s,%s,%s,%s,%s'%(name,index,name,bowtie_params,description,filter_out,previous)
            if (str(filter_out)=="1"):
               previous=name
    
       if (pipeline):
           deseq_count=1
           for i in pipeline:
             arr=i.split(':')
             pipename=arr[0]
             if (pipename=="RNASeqRSEM"):
               paramsrsem=arr[1];
               if (not paramsrsem):
                  paramsrsem="NONE"
               print >>fp, '@PARAMSRSEM=%s'%(self.parse_content(paramsrsem))
               print >>fp, '@TSIZE=50';
               print >>fp, '@PREVIOUSPIPE=%s'%(previous)
    
             if (pipename=="Tophat"):
               paramstophat=arr[1];
               if (not paramstophat):
                  paramstophat="NONE"
               print >>fp, '@PARAMSTOPHAT=%s'%(self.parse_content(paramstophat))
             if (pipename=="DESeq"):
               print >>fp, '@COLS%s=%s'%(str(deseq_count), self.remove_space(arr[1]));
               print >>fp, '@CONDS%s=%s'%(str(deseq_count), self.remove_space(arr[2]));
               print >>fp, '@FITTYPE%s=%s'%(str(deseq_count), arr[3]);
               print >>fp, '@HEATMAP%s=%s'%(str(deseq_count), arr[4]);
               print >>fp, '@PADJ%s=%s'%(str(deseq_count), arr[5]);
               print >>fp, '@FOLDCHANGE%s=%s'%(str(deseq_count), arr[6]);
               print >>fp, '@DATASET%s=%s'%(str(deseq_count), arr[7]);
               deseq_count+=1
    
             if (pipename=="ChipSeq"):
               chipinput=self.parse_content(str(arr[1]))
               bowtie_params=self.remove_space("-k_%s"%(str(arr[2])))
               description="Chip_Mapping"
               filter_out="0"
               print >>fp, '@ADVPARAMS=NONE'
               print >>fp, '@CHIPINPUT=%s'%(chipinput)
               print >>fp, '@PARAMChip=@GCOMMONDB/%s/%s,Chip,%s,%s,%s,%s'%(gb[1],gb[1],bowtie_params,description,filter_out,previous)
    
               print >>fp, '@GENOMEINDEX=%s'%(genomeindex);
               print >>fp, '@TSIZE=%s'%(self.remove_space(str(arr[3])));
               print >>fp, '@BWIDTH=%s'%(self.remove_space(str(arr[4])));
               print >>fp, '@GSIZE=%s'%(self.remove_space(str(arr[5])));
    
    
       print >>fp, '@MAPNAMES=%s'%(mapnames)
       print >>fp, '@PREVIOUSPIPE=%s'%(previous)
    
       fp.close()
    
    def write_workflow(self,  resume, gettotalreads, amazonupload, backupS3, runparamsid, customind, commonind, pipeline, barcodes, fastqc, adapter, quality, trim, split, file, clean ):
        fp = open ( file, 'w')
        sep='\t'
     
        stepline=stepCheck % locals()
        print >>fp, '%s'%stepline
        if (barcodes and barcodes.lower() != 'none'):
            stepline=stepBarcode % locals()
            print >>fp, '%s'%stepline
     
        if (gettotalreads and gettotalreads.lower() != 'none'):
            stepline=stepGetTotalReads % locals()
            print >> fp, '%s'%stepline
     
        if (backupS3 and backupS3.lower() != 'none'):
            stepline=stepBackupS3 % locals()
            print >> fp, '%s'%stepline
     
        if (fastqc and fastqc.lower() == 'yes'):
           stepline=stepFastQC % locals()
           print >>fp, '%s'%stepline
           stepline=stepMergeFastQC % locals()
           print >>fp, '%s'%stepline
     
        if (adapter and adapter.lower() != 'none'):
           stepline=stepAdapter % locals()
           print >>fp, '%s'%stepline
     
        if (quality and quality.lower() != 'none'):
           stepline=stepQuality % locals()
           print >>fp, '%s'%stepline
     
        if (trim and trim.lower() != 'none'):
           stepline=stepTrim % locals()
           print >>fp, '%s'%stepline
     
        countstep = False
        if (commonind and commonind.lower() != 'none'):
     
           arr=re.split(r'[,:]+', self.parse_content(commonind))
     
           for i in arr:
              countstep = True
              if(len(i)>1):
                indexname=i
              stepline=stepSeqMapping % locals()
              print >>fp, '%s'%stepline
     
     
        if (customind):
           for i in customind:
              countstep = True
              arr=i.split(',')
              indexname=arr[1]
              stepline=stepSeqMapping % locals()
              print >>fp, '%s'%stepline
     
        if (countstep):
           stepline=stepCounts % locals()
           print >>fp, '%s'%stepline
     
        if (split and split.lower() != 'none'):
           thenumberofreads=str(split)
           stepline=stepSplit % locals()
           print >>fp, '%s'%stepline
     
        if (pipeline):
           deseq_count=1
           for i in pipeline:
              arr=i.split(':')
              pipename=arr[0]
              if (pipename == "RNASeqRSEM"):
                 stepline=stepRSEM % locals()
                 print >>fp, '%s'%stepline
                 g_i = "genes"
                 t_e = "tpm"
                 stepline=stepRSEMCount % locals()
                 print >>fp, '%s'%stepline
                 g_i = "genes"
                 t_e = "expected_count"
                 stepline=stepRSEMCount % locals()
                 print >>fp, '%s'%stepline
                 g_i = "isoforms"
                 t_e = "tpm"
                 stepline=stepRSEMCount % locals()
                 print >>fp, '%s'%stepline
                 g_i = "isoforms"
                 t_e = "expected_count"
                 stepline=stepRSEMCount % locals()
                 print >>fp, '%s'%stepline
                 type="RSEM"
                 igv=arr[2]
                 if (igv.lower()=="yes"):
                    stepline=stepIGVTDF % locals()
                    print >>fp, '%s'%stepline
                 bam2bw=arr[3]
                 if (bam2bw.lower()=="yes"):
                    stepline=stepBam2BW % locals()
                    print >>fp, '%s'%stepline
                 #stepline=stepPicard % locals()
                 #print >>fp, '%s'%stepline
     
              if (pipename == "Tophat"):
                 stepline=stepTophat % locals()
                 print >>fp, '%s'%stepline
                 igv=arr[2]
                 type="Tophat"
                 if (igv.lower()=="yes"):
                    stepline=stepIGVTDF % locals()
                    print >>fp, '%s'%stepline
                 bam2bw=arr[3]
                 if (bam2bw.lower()=="yes"):
                    stepline=stepBam2BW % locals()
                    print >>fp, '%s'%stepline
                 metric="CollectRnaSeqMetrics"
                 stepline=stepPicard % locals()
                 print >>fp, '%s'%stepline
                 metric="CollectMultipleMetrics"
                 stepline=stepPicard % locals()
                 print >>fp, '%s'%stepline
                 metric="MarkDuplicates"
                 stepline=stepPicard % locals()
                 print >>fp, '%s'%stepline
                 stepline=stepMergePicard % locals()
                 print >>fp, '%s'%stepline
     
              if (pipename == "DESeq"):
                 stepline=stepDESeq2 % locals()
                 print >>fp, '%s'%stepline
                 deseq_count += 1
     
              if (pipename == "ChipSeq"):
                 #Arrange ChipSeq mapping step
                 indexname='Chip'
                 stepline=stepSeqMapping % locals()
                 print >>fp, '%s'%stepline
                 if (split and split.lower() != 'none'):
                     stepline=stepMergeChip % locals()
                     print >>fp, '%s'%stepline
                 #Set running macs step
                 stepline=stepMACS % locals()
                 print >>fp, '%s'%stepline
                 stepline=stepAggregation % locals()
                 print >>fp, '%s'%stepline
     
                 type="chip"
                 if (split and split.lower() != 'none'):
                     type="mergechip"
                 igv=str(arr[6])
                 if (igv.lower()=="yes"):
                     stepline=stepIGVTDF % locals()
                     print >>fp, '%s'%stepline
     
                 bam2bw=str(arr[7])
                 if (bam2bw.lower()=="yes"):
                     stepline=stepBam2BW % locals()
                     print >>fp, '%s'%stepline
                 metric="CollectRnaSeqMetrics"
                 stepline=stepPicard % locals()
                 print >>fp, '%s'%stepline
                 metric="CollectMultipleMetrics"
                 stepline=stepPicard % locals()
                 print >>fp, '%s'%stepline
                 metric="MarkDuplicates"
                 stepline=stepPicard % locals()
                 print >>fp, '%s'%stepline
                 stepline=stepMergePicard % locals()
                 print >>fp, '%s'%stepline
        
        level=0
        if (clean):
           level=1
        stepline=stepClean % locals()
        print >>fp, '%s'%stepline
     
        fp.close()

    def replace_space(self, content) :
        content = re.sub('[\s\t,]+', '_', content)
        return content
        
    def remove_space(self, content) :
        content = content.replace( '__cr____cn__', '' )
        content = re.sub('[\s\t\n]+', '', content)
        return content
        
    def parse_content(self, content, ncols=8, base64=False, verbose=0 ) :
        '''
        This is a function that parse the inputparam content and
        returns the base64 encoded string if base64 is True otherwise
        returns the concatenated string with by the conversion to make
        ('\t' -> ',', ' ' -> ',', '\n'->':').
        '''
        
        content = content.replace( '__tc__', ',' )
        content = content.replace( '__at__', '@' )
        content = content.replace( '__pd__', '' )
        content = content.replace( '__cr____cn__', ':' )
        content = re.sub('[\s\t,]+', ',', content)
        content = re.sub('[\n\r:]+', ':', content)
        content = re.sub(':+', ':', content)
        content = re.sub(':$', '', content)
        #content = re.sub('[-]+', '_', content)
        return content

    # error
    def stop_err(self, msg ):
        sys.stderr.write( "%s\n" % msg )
        sys.exit(2)

# main
def main():
    
   params_section = ""
   
   try:
        tmpdir = '../tmp/files'
        logdir = '../tmp/logs'

        if not os.path.exists(tmpdir):
           os.makedirs(tmpdir)
        if not os.path.exists(logdir):
           os.makedirs(logdir)
         #define options
        parser = OptionParser()
        parser.add_option("-r", "--rungroupid", dest="rpid")
        parser.add_option("-b", "--backup", dest="backup")
        parser.add_option("-w", "--wkey", dest="wkey")
        parser.add_option("-c", "--config", dest="config")
        # parse
        options, args = parser.parse_args()
        # retrieve options
        rpid    = options.rpid
        BACKUP  = options.backup
        WKEY    = options.wkey
        params_section = options.config        

        dolphin=Dolphin(params_section)

        logging.basicConfig(filename=logdir+'/run'+str(rpid)+'/run.'+str(rpid)+'.'+str(os.getpid())+'.log', filemode='w',format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.DEBUG)

        if (not rpid):
           rpid=-1

        dolphin.config.read("../config/config.ini")

                
        print dolphin.params_section
        logging.info(dolphin.params_section)
        runparamsids=dolphin.getRunParamsID(rpid)
        
        for runparams_arr in runparamsids:
           runparamsid=runparams_arr[0]
           username=runparams_arr[1]
           isbarcode=runparams_arr[2]
           print runparams_arr
           logging.info(runparams_arr)

           amazon = dolphin.getAmazonCredentials(username)
           backupS3="Yes"
           amazonupload="No"
           if (amazon != () and BACKUP):
              amazonupload     = "Yes"

           (inputdir, backup_dir, amazon_bucket, outdir) = dolphin.getDirs(runparamsid, isbarcode)
           if(inputdir == backup_dir):
              backupS3 = None
              gettotalreads = None
           else:
              gettotalreads = "Yes"

           print "%s %s %s %s"%(inputdir, backup_dir, amazon_bucket, outdir)
           logging.info("%s %s %s %s"%(inputdir, backup_dir, amazon_bucket, outdir))

           if (isbarcode):
               spaired, inputparams, barcodes=dolphin.getLaneList(runparamsid)
           else:
               spaired, inputparams=dolphin.getSampleList(runparamsid)
               barcodes    = None

           runparams = dolphin.getRunParams(runparamsid)
           logging.info(runparams)

           input_fn      = "../tmp/files/input.txt"

           fastqc      = runparams.get('fastqc')
           adapter     = runparams.get('adapter')
           quality     = runparams.get('quality')
           trim        = runparams.get('trim')
           clean       = runparams.get('clean')
           trimpaired  = runparams.get('trimpaired')
           split       = runparams.get('split')
           commonind   = runparams.get('commonind')
           advparams   = runparams.get('advparams')
           resume      = runparams.get('resume')
           customind   = runparams.get('customind')
           pipeline    = runparams.get('pipeline')
           genomebuild = runparams.get('genomebuild')

           logging.info("######## INPUTS #########")
           logging.info("inputparams:"+inputparams)
           logging.info("barcodes:%s"%barcodes)
           logging.info("paired:%s"%spaired)
           logging.info("adapter:%s"%adapter)
           logging.info("quality:%s"%quality)
           logging.info("trim:%s"%trim)
           logging.info("resume:%s"%resume)
           logging.info("pipeline:%s"%pipeline)
           logging.info("customind:%s"%customind)
           logging.info("genomebuild:%s"%genomebuild)
           logging.info("######## INPUTS END #########")

           if customind:
              customind    = [i for i in customind]

           if pipeline:
              pipeline     = [i for i in pipeline]
           #print pipeline

           if not outdir :
              print >>stderr, 'Error: Output dir is NULL.'
              exit( 128 )

           content = dolphin.parse_content( inputparams )
           if commonind:
              commonind = re.sub('test', '', commonind)

           dolphin.write_input(input_fn, inputdir, content, genomebuild, spaired, barcodes, adapter, quality, trim, trimpaired, split, commonind, advparams, customind, pipeline )

           workflow = join( dolphin.bin_dir, '../tmp/files/seqmapping_workflow.txt' )

           dolphin.write_workflow(resume, gettotalreads, amazonupload, backupS3, runparamsid, customind, commonind, pipeline, barcodes, fastqc, adapter, quality, trim, split, workflow, clean)

           dolphin_tools_dir=dolphin.config.get(dolphin.params_section, "dolphin_tools_src_path") 
           dolphin_default_params=dolphin.config.get(dolphin.params_section, "dolphin_default_params_path")
           wkeystr=''
           if (WKEY):
               wkeystr=' -k '+str(WKEY)
           logging.info("CMD:%s"%(dolphin.cmd % locals()))
           print dolphin.cmd % locals()
           print "\n\n\n"
           p = subprocess.Popen(dolphin.cmd % locals(), shell=True, stdout=subprocess.PIPE)
           dolphin.updatePID(runparamsid, p.pid)

           for line in p.stdout:
              print(str(line.rstrip()))
              logging.info(str(line.rstrip()))
              p.stdout.flush()
              if (re.search('failed\n', line) or re.search('Err\n', line) ):
                 logging.info("failed")
                 dolphin.stop_err("failed")
   except Exception, ex:
        dolphin.stop_err('Error running dolphin_wrapper.py\n' + str(ex))

   sys.exit(0)



if __name__ == "__main__":
    main()
