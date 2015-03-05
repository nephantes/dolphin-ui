"""
    This tool recursively map sequenced files to any number of index files in given order. 
 
    usage: seqmapping.py [options]
    --inputdir: The directory in the cluster that has the library files
    --inputparams: All the files with the names
    --outdir: output directory
    --output: output file
    --user_email: user email address 
    --customind: step definitions and customind
    
    usage: seqmapping.py input output 
"""
# imports
import os, re, string, sys, commands
from sys import argv, exit, stderr
from optparse import OptionParser
from os.path import dirname, exists, join
from os import system
import subprocess
from subprocess import Popen, PIPE
from workflowdefs import *

bin_dir = dirname(argv[0])
cmd = 'python /project/umw_biocore/bin/runWorkflow.py -i %(input_fn)s -d %(galaxyhost)s -w %(workflow)s -p /project/umw_biocore/bin/workflow/scripts/tools/workflows/SeqMapping_v1.2_default.txt -u %(username)s -o %(outdir)s'



# error
def stop_err( msg ):
    sys.stderr.write( "%s\n" % msg )
    sys.exit()

# main
def main():
    # define options
    parser = OptionParser()
    parser.add_option("-d", "--inputdir", dest="inputdir")
    parser.add_option("-p", "--inputparams",dest="inputparams")
    parser.add_option("-o", "--outdir", dest="outdir")
    parser.add_option("-f", "--output", dest="output")
    parser.add_option("", "--resume", dest="resume")
    parser.add_option("-u", "--user_email", dest="useremail")
    parser.add_option("-g", "--genomebuild", dest="genomebuild")
    parser.add_option("-s", "--spaired", dest="spaired")
    parser.add_option("-b", "--barcodes", dest="barcodes")
    parser.add_option("-a", "--adapter", dest="adapter")
    parser.add_option("-t", "--trim", dest="trim")
    parser.add_option("",   "--quality", dest="quality")
    parser.add_option("-c", "--clean", dest="clean")
    parser.add_option("-n", "--split", dest="split")
    parser.add_option("-q", "--fastqc", dest="fastqc")
    parser.add_option("-m", "--trimpaired", dest="trimpaired")
    parser.add_option("-r", "--commonind", dest="commonind")
    parser.add_option("-v", "--advparams", dest="advparams")
    parser.add_option("-i", "--customind", action="append", dest="customind")
    parser.add_option("-w", "--pipeline", action="append", dest="pipeline")

    # parse
    options, args = parser.parse_args()
    
    try:
        # retrieve options
        inputdir    = remove_space(options.inputdir)
        inputparams = options.inputparams
        outdir      = remove_space(options.outdir)
        output      = options.output
        useremail   = options.useremail
        genomebuild = options.genomebuild
        spaired     = options.spaired
        barcodes    = options.barcodes
        fastqc      = options.fastqc
        adapter     = options.adapter
        quality     = options.quality
        trim        = options.trim
        clean       = options.clean
        trimpaired  = options.trimpaired
        split       = options.split
        commonind   = options.commonind
        advparams   = options.advparams
        resume      = options.resume
  
        customind = ""
	if options.customind :
            customind     = [i for i in options.customind]

        pipeline = ""
	if options.pipeline:
            pipeline    = [i for i in options.pipeline]

	if not inputdir :
		print >>stderr, 'Error: Input dir is NULL.'
		exit( 128 )

	if not outdir :
		print >>stderr, 'Error: Output dir is NULL.'
		exit( 128 )

	if useremail :
		username = useremail.split('@')[0]
	else :
		print >>systderr, 'Error: User email is NULL.'
		exit( 128 )

	input_fn = output
	content = parse_content( inputparams )
        if (commonind):
           commonind = re.sub('test', '', commonind)
	write_input( input_fn, inputdir, content, genomebuild, spaired, barcodes, adapter, quality, trim, trimpaired, split, commonind, advparams, customind, pipeline )
	workflow = join( bin_dir, 'seqmapping_workflow.txt' )
        write_workflow(resume, customind, commonind, pipeline, barcodes, fastqc, adapter, quality, trim, split, workflow, clean) 
        os.system("chmod 777 "+str(output))
        galaxyhost=commands.getstatusoutput('cat /etc/galaxyhost')[1]

        print cmd % locals()
        print "\n\n\n"
        #system(cmd % locals())
        p = subprocess.Popen(cmd % locals(), shell=True, stdout=subprocess.PIPE)

        for line in p.stdout:
          print(str(line.rstrip()))
          p.stdout.flush()
          if (re.search('failed\n', line) or re.search('Err\n', line) ):
	     stop_err("failed")

        os.system("chmod 755 "+str(output))

    except Exception, ex:
        stop_err('Error running seqmapping.py\n' + str(ex))

    # exit
    sys.exit(0)

def write_input( input_fn, data_dir, content,genomebuild,spaired,barcodes,adapter, quality, trim,trimpaired, split, commonind, advparams, customind, pipeline) :
	content = content.replace( 'DIR', data_dir )
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

def write_workflow( resume, customind, commonind, pipeline, barcodes, fastqc, adapter, quality, trim, split, file, clean ):
        fp = open ( file, 'w') 
        sep='\t'

        stepline=stepCheck % locals()
        print >>fp, '%s'%stepline
         
        if (barcodes):
           stepline=stepBarcode % locals()
           print >>fp, '%s'%stepline
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
        #content = re.sub('[-]+', '_', content)
        return content

if __name__ == "__main__":
    main()
