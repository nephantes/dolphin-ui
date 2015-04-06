"""
    This tool recursively map sequenced files to any number of index files in given order.
    usage: dophin_wrapper.py [options]
"""
# imports
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

warnings.filterwarnings('ignore', '.*the sets module is deprecated.*',
			DeprecationWarning, 'MySQLdb')

from workflowdefs import *

bin_dir = dirname(argv[0])
cmd = 'python /project/umw_biocore/bin/runWorkflow.py -i %(input_fn)s -d %(galaxyhost)s -w %(workflow)s -p /project/umw_biocore/bin/workflow/scripts/tools/workflows/Dolphin_v1.3_default.txt -u %(username)s -o %(outdir)s'


gbuild = {
 "human"	 : "hg19",
 "mouse"	 : "mm10",
 "mousetest"	 : "mm10",
 "rat"		     : "rn5",
 "c.elegans"	 : "ce10",
 "drosophila"	 : "dm3",
 "zebrafish"	 : "danRer7",
 "s.cerevisiae"  : "sacCer3",
 "cow"		 : "bosTau7"
}

def runSQL(sql):
    port=3306
    db = MySQLdb.connect(
      host = 'localhost',
      user = 'biocore',
      passwd = 'biocore2013',
      db = 'biocore',
      port = port)
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

def getRunGroups():
    sql = "SELECT DISTINCT nrl.run_group_id, u.username, nrp.barcode from biocore.ngs_runlist nrl, biocore.ngs_runparams nrp, biocore.users u where nrp.run_group_id=nrl.run_group_id and u.id=nrl.owner_id and nrp.run_status=0;"
    return runSQL(sql)

def getRunParams(run_group_id):
 
    sql = "SELECT json_parameters from biocore.ngs_runparams where run_status=0 and run_group_id='%d'"%run_group_id
    result = runSQL(sql)
    for row in result:
        print row[0]
        return json.loads(row[0])

def getAmazonCredentials(username):
    sql = 'SELECT DISTINCT ac.* FROM biocore.amazon_credentials ac, biocore.group_amazon ga, biocore.users u where ac.id=ga.amazon_id and ga.group_id=u.group_id and u.username="'+username+'";'
    results = runSQL(sql)

    return results

def getDirs(run_group_id, isbarcode):
 
    tablename="ngs_fastq_files"
    fields="d.backup_dir fastq_dir, d.backup_dir, d.amazon_bucket, rp.outdir, s.organism, s.library_type"
    sql = "SELECT DISTINCT %(fields)s FROM biocore.ngs_runlist nr, biocore.ngs_samples s, biocore.%(tablename)s tl, biocore.ngs_dirs d, biocore.ngs_runparams rp where nr.sample_id=s.id and rp.run_status=0 and s.id=tl.sample_id and d.id=tl.dir_id and  rp.run_group_id=nr.run_group_id and nr.run_group_id='"+str(run_group_id)+"';"
    
    results=runSQL(sql%locals())
    
    if (not results):
       fields="d.fastq_dir, d.backup_dir, d.amazon_bucket, rp.outdir, s.organism, s.library_type"
       if (isbarcode):
           tablename="ngs_temp_lane_files"
       else:
           tablename="ngs_temp_sample_files"
       results=runSQL(sql%locals())
     
    return results[0]

def getSampleList(run_group_id):
    tablename="ngs_temp_sample_files"
    sql = "SELECT s.name, s.adapter, s.genotype, s.name, ts.file_name FROM biocore.ngs_runparams nrp, biocore.ngs_runlist nr, biocore.ngs_samples s, biocore.%(tablename)s ts, biocore.ngs_dirs d where nr.run_group_id=nrp.run_group_id and nr.sample_id=s.id and nrp.run_status=0 and s.id=ts.sample_id and d.id=ts.dir_id and nr.run_group_id='"+str(run_group_id)+"';"
    samplelist=runSQL(sql%locals())
    if (not samplelist):
        tablename="ngs_fastq_files"
        samplelist=runSQL(sql%locals())
    return getInputParams(samplelist)

def getInputParams(samplelist):
    inputparams=""
    for row in samplelist:
        if (inputparams):
           inputparams=inputparams+":"
        inputparams=inputparams+row[3]+","+row[4]
    spaired=None
    if (',' in row[4]):
        spaired="paired"
    return (spaired, inputparams)

def getLaneList(run_group_id):

    sql = "SELECT DISTINCT %(fields)s FROM biocore.ngs_runlist nrl, biocore.ngs_runparams nrp, biocore.ngs_samples s, biocore.%(tablename)s tl where nrl.run_group_id=nrp.run_group_id and nrp.run_status=0 and s.lane_id = tl.lane_id and s.id=nrl.sample_id and nrp.run_group_id='"+str(run_group_id)+"';"
    fields='tl.file_name'
    tablename="ngs_temp_lane_files"

    result=runSQL(sql%locals())
    if (not result):
        tablename="ngs_fastq_files"
        result=runSQL(sql%locals())
    
    inputparams=""
    for row in result:
        if (inputparams):
            inputparams=inputparams+":"
        inputparams=inputparams+row[0]
    spaired=None
    if (',' in row[0]):
        spaired="paired"

    fields='s.name, s.barcode'
    result=runSQL(sql%locals())
    if (not result):
        tablename="ngs_fastq_files"
        result=runSQL(sql%locals())
        
    barcode="Distance,1:Format,5"
    for row in result:
        barcode=barcode+":"+row[0]+","+row[1]
    return (spaired, inputparams, barcode)


# error
def stop_err( msg ):
    sys.stderr.write( "%s\n" % msg )
    sys.exit()

# main
def main():
    try:
        rungroups=getRunGroups()

        for rungroup_arr in rungroups:
           rungroup=rungroup_arr[0]
           username=rungroup_arr[1]
           isbarcode=rungroup_arr[2]
           print rungroup_arr
    
           amazon = getAmazonCredentials(username)
           backupS3=None
           if (amazon != ()):
              backupS3	  = "Yes"
            
           (inputdir, backup_dir, amazon_bucket, outdir, organism, library_type) = getDirs(rungroup, isbarcode)
           if(inputdir == backup_dir):
              backupS3 = None
              gettotalreads = None
           else:
              gettotalreads = "Yes"
              
           print "%s %s %s %s %s %s"%(inputdir, backup_dir, amazon_bucket, outdir, organism, library_type )
    
           genomebuild=organism+","+gbuild[organism]
    
           if (isbarcode):
               spaired, inputparams, barcodes=getLaneList(rungroup)
           else:
               spaired, inputparams=getSampleList(rungroup)
               barcodes    = None
           runparams = getRunParams(rungroup)
           
           output      = "../tmp/files/input.txt"
    
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

           #print inputparams
           #print barcodes
           #print spaired
           
           if customind :
              customind     = [i for i in customind]
    
          
           if pipeline:
              pipeline	  = [i for i in pipeline]
           print pipeline

           if not outdir :
              print >>stderr, 'Error: Output dir is NULL.'
              exit( 128 )
    
           input_fn = output
           content = parse_content( inputparams )
           if (commonind):
              commonind = re.sub('test', '', commonind)
           write_input( input_fn, inputdir, content, genomebuild, spaired, barcodes, adapter, quality, trim, trimpaired, split, commonind, advparams, customind, pipeline )
           workflow = join( bin_dir, 'seqmapping_workflow.txt' )
           write_workflow(resume, gettotalreads, backupS3, rungroup, customind, commonind, pipeline, barcodes, fastqc, adapter, quality, trim, split, workflow, clean)
           os.system("chmod 777 "+str(output))
           galaxyhost=commands.getstatusoutput('cat /etc/galaxyhost')[1]
    
           print cmd % locals()
           print "\n\n\n"
           p = subprocess.Popen(cmd % locals(), shell=True, stdout=subprocess.PIPE)
    
           for line in p.stdout:
           #   print(str(line.rstrip()))
              p.stdout.flush()
              if (re.search('failed\n', line) or re.search('Err\n', line) ):
                stop_err("failed")
    
           os.system("chmod 755 "+str(output))

    except Exception, ex:
        stop_err('Error running dolphin_wrapper.py\n' + str(ex))

    sys.exit(0)

def write_input( input_fn, data_dir, content,genomebuild,spaired,barcodes,adapter, quality, trim,trimpaired, split, commonind, advparams, customind, pipeline) :
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
	if (barcodes):
	  print >>fp, '@BARCODES=%s'%parse_content(barcodes)
	  barcodeflag=1
	  previous="BARCODE"
	else:
	  print >>fp, '@BARCODES=NONE'

	if (adapter):
	  print >>fp, '@ADAPTER=%s'%parse_content(adapter)
	  print >>fp, '@PREVIOUSADAPTER=%s'%previous
	  previous="ADAPTER"
	else:
	  print >>fp, '@ADAPTER=NONE'

	if (quality):
	  print >>fp, '@QUALITY=%s'%parse_content(quality)
	  print >>fp, '@PREVIOUSQUALITY=%s'%previous
	  previous="QUALITY"
	else:
	  print >>fp, '@QUALITY=NONE'

	if (trim):
	  print >>fp, '@TRIM=%s'%trim
	  print >>fp, '@TRIMPAIRED=%s'%trimpaired
	  print >>fp, '@PREVIOUSTRIM=%s'%previous
	  previous="TRIM"
	else:
	  print >>fp, '@TRIM=NONE'

	if(split):
	  print >>fp, '@PREVIOUSSPLIT=%s'%previous
	  previous="SPLIT"
	else:
	  print >>fp, '@PREVIOUSSPLIT=NONE'


	if (commonind):
	  arr=parse_content(commonind).split(',')

	  for i in arr:
	     if(len(i)>1):
		default_bowtie_params="@DEFBOWTIE2PARAM"
		default_description="@DEFDESCRIPTION"
		print >>fp, '@PARAM%s=@GCOMMONDB/%s/%s,%s,%s,%s,1,%s'%(i,i,i,i,default_bowtie_params,default_description,previous)
		if (i != "ucsc" and i != gb[1]):
		  previous=i

	  if (advparams):
	     print >>fp, '@ADVPARAMS=%s'%(parse_content(advparams))
	  else:
	     print >>fp, '@ADVPARAMS=NONE'

	mapnames=commonind
	if (not mapnames):
	   mapnames="";
	if (customind):
	   for i in customind:
	     arr=i.split(',')
	     index=parse_content(arr[0])
	     name=parse_content(replace_space(arr[1]))
	     mapnames=str(mapnames)+name+":"+index+","
	     bowtie_params=parse_content(replace_space(arr[2]))
	     description=parse_content(replace_space(arr[3]))
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
		 print >>fp, '@PARAMSRSEM=%s'%(parse_content(paramsrsem))
		 print >>fp, '@TSIZE=50';
	      if (pipename=="Tophat"):
		 paramstophat=arr[1];
		 if (not paramstophat):
		    paramstophat="NONE"
		 print >>fp, '@PARAMSTOPHAT=%s'%(parse_content(paramstophat))
	      if (pipename=="DESeq"):
		 print >>fp, '@COLS%s=%s'%(str(deseq_count), remove_space(arr[1]));
		 print >>fp, '@CONDS%s=%s'%(str(deseq_count), remove_space(arr[2]));
		 print >>fp, '@FITTYPE%s=%s'%(str(deseq_count), arr[3]);
		 print >>fp, '@HEATMAP%s=%s'%(str(deseq_count), arr[4]);
		 print >>fp, '@PADJ%s=%s'%(str(deseq_count), arr[5]);
		 print >>fp, '@FOLDCHANGE%s=%s'%(str(deseq_count), arr[6]);
		 deseq_count+=1

	      if (pipename=="ChipSeq"):
		 chipinput=parse_content(str(arr[1]))
		 bowtie_params=remove_space("-k_%s"%(str(arr[2])))
		 description="Chip_Mapping"
		 filter_out="0"
		 print >>fp, '@ADVPARAMS=NONE'
		 print >>fp, '@CHIPINPUT=%s'%(chipinput)
		 print >>fp, '@PARAMChip=@GCOMMONDB/%s/%s,Chip,%s,%s,%s,%s'%(gb[1],gb[1],bowtie_params,description,filter_out,previous)

		 print >>fp, '@GENOMEINDEX=%s'%(genomeindex);
		 print >>fp, '@TSIZE=%s'%(remove_space(str(arr[3])));
		 print >>fp, '@BWIDTH=%s'%(remove_space(str(arr[4])));
		 print >>fp, '@GSIZE=%s'%(remove_space(str(arr[5])));


	print >>fp, '@MAPNAMES=%s'%(mapnames)
	print >>fp, '@PREVIOUSPIPE=%s'%(previous)

	fp.close()

def write_workflow( resume, gettotalreads, backupS3, rungroup, customind, commonind, pipeline, barcodes, fastqc, adapter, quality, trim, split, file, clean ):
	fp = open ( file, 'w')
	sep='\t'

	stepline=stepCheck % locals()
	print >>fp, '%s'%stepline

	if (barcodes):
	   stepline=stepBarcode % locals()
	   print >>fp, '%s'%stepline
	if (gettotalreads):
	    stepline=stepGetTotalReads % locals()
	    print >> fp, '%s'%stepline

	if (backupS3):
	    stepline=stepBackupS3 % locals()
	    print >> fp, '%s'%stepline

	if (fastqc):
	   stepline=stepFastQC % locals()
	   print >>fp, '%s'%stepline
	   stepline=stepMergeFastQC % locals()
	   print >>fp, '%s'%stepline

	if (adapter):
	   stepline=stepAdapter % locals()
	   print >>fp, '%s'%stepline

	if (quality):
	   stepline=stepQuality % locals()
	   print >>fp, '%s'%stepline

	if (trim):
	   stepline=stepTrim % locals()
	   print >>fp, '%s'%stepline

	if (commonind):

	   arr=parse_content(commonind).split(',')
	   for i in arr:
	      if(len(i)>1):
		 indexname=i
		 stepline=stepSeqMapping % locals()
		 print >>fp, '%s'%stepline


	if (customind):
	   for i in customind:
	      arr=i.split(',')
	      indexname=arr[1]
	      stepline=stepSeqMapping % locals()
	      print >>fp, '%s'%stepline

	if (split):
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
		igv=arr[2]
		if (igv=="Yes"):
		   type="RSEM"
		   stepline=stepIGVTDF % locals()
		   print >>fp, '%s'%stepline
		bam2bw=arr[3]
		if (bam2bw=="Yes"):
		   type="RSEM"
		   stepline=stepBam2BW % locals()
		   print >>fp, '%s'%stepline

	      if (pipename == "Tophat"):
		stepline=stepTophat % locals()
		print >>fp, '%s'%stepline
		igv=arr[2]
		if (igv=="Yes"):
		   type="Tophat"
		   stepline=stepIGVTDF % locals()
		   print >>fp, '%s'%stepline
		bam2bw=arr[3]
		if (bam2bw=="Yes"):
		   type="Tophat"
		   stepline=stepBam2BW % locals()
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
		if (split):
		  stepline=stepMergeChip % locals()
		  print >>fp, '%s'%stepline
		#Set running macs step
		stepline=stepMACS % locals()
		print >>fp, '%s'%stepline
		stepline=stepAggregation % locals()
		print >>fp, '%s'%stepline

		igv=str(arr[6])
		if (igv=="Yes"):
		   type="chip"
		   if (split):
		     type="mergechip"
		   stepline=stepIGVTDF % locals()
		   print >>fp, '%s'%stepline
		bam2bw=str(arr[7])
		if (bam2bw=="Yes"):
		   type="chip"
		   if (split):
		     type="mergechip"
		   stepline=stepBam2BW % locals()
		   print >>fp, '%s'%stepline

	if (commonind or customind):
	   stepline=stepCounts % locals()
	   print >>fp, '%s'%stepline
	   stepline=stepMakeReport % locals()
	   print >>fp, '%s'%stepline
	if (clean):
	   stepline=stepClean % locals()
	   print >>fp, '%s'%stepline

	fp.close()

class NoContentParsedError( Exception ) :

	pass
class ContentFormatError( Exception ) :
	pass

def replace_space(content) :
	content = re.sub('[\s\t,]+', '_', content)
	return content

def remove_space(content) :
	content = content.replace( '__cr____cn__', '' )
	content = re.sub('[\s\t\n]+', '', content)
	return content

def parse_content( content, ncols=8, base64=False, verbose=0 ) :
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
	content = re.sub('[\n:]+', ':', content)
	content = re.sub(':+', ':', content)
	content = re.sub(':$', '', content)
	#content = re.sub('[-]+', '_', content)
	return content

if __name__ == "__main__":
    main()
