#!/usr/bin/env python
 
import os, re, string, sys, commands
import warnings
import MySQLdb

from sys import argv, exit, stderr
from optparse import OptionParser
 
from boto.s3.connection import S3Connection
from boto.s3.key import Key

warnings.filterwarnings('ignore', '.*the sets module is deprecated.*',
                        DeprecationWarning, 'MySQLdb')

def runSQL(sql):
    port=3306
    db = MySQLdb.connect(
      host = 'galaxy.umassmed.edu',
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

def calcHashFilesInCluster(fastqdir, filename):
     result = checkIfHashCalculated(fastqdir, filename)
     print result 
     
     if len(result)>0:
        print "Already added!!!"
        return
     
     command = "python hashcalc_v1_wrapper.py hashcalc_workflow.txt '%s' '%s' /home/ak97w/out kucukura@umassmed.edu"%(filename,fastqdir)
     #print command
     child = os.popen(command)
     jobout = child.read().rstrip()
     err = child.close()
     print jobout

def checkIfHashCalculated(fastqdir, filename):
    try:
        sql = "SELECT nff.id FROM biocore.ngs_fastq_files nff, biocore.ngs_dirs nd " 
        sql += "where nff.dir_id = nd.id AND "
        sql += "nff.file_name='"+str(filename)+"' and "
        sql += "nd.fastq_dir='"+str(fastqdir)+"' and "
        sql += "nff.checksum!=''"
        results = runSQL(sql)
		
    except Exception, err:
        sys.stderr.write('ERROR: %s\n' % str(err))
        sys.exit(2)
    return results
  

def getFileList():
    try:
        sql = "SELECT d.fastq_dir, f.file_name, d.amazon_bucket FROM biocore.ngs_fastq_files f, biocore.ngs_dirs d where d.id=f.dir_id;"
        results = runSQL(sql)
    except Exception, err:
        sys.stderr.write('ERROR: %s\n' % str(err))
        sys.exit(2)
    return results

def uploadFile(pb, amazon_bucket, fastq_dir, filename ):
    k = Key(pb)
    inputfile = "%s/%s"%(fastq_dir.strip(), filename.strip())
    s3file = "%s/%s"%(amazon_bucket.strip(), filename.strip())
   
    print inputfile
    print s3file
    m=pb.get_key(s3file)
    
    if m and m.exists():
        print "Already uploaded %s" % s3file
    else:
        print 'Upload started=>'
        k.name = s3file
        k.set_contents_from_filename(inputfile)
        
def main():

    conn = S3Connection('AKIAIMGELA7PNLBEHUSA', 'rK2esfiqi9mxwuFSFymZUZMNF5UYY+ihcZMFrnzq')
    pb = conn.get_bucket('biocorebackup')
    
    results=getFileList()
    for result in results:
        print result
        
        fastq_dir=result[0]
        filename=result[1]
        calcHashFilesInCluster(fastq_dir, filename)
        amazon_bucket=result[2]
        if (filename.find(',')!=-1):
            files=filename.split(',')
            uploadFile(pb, amazon_bucket, fastq_dir, files[0] )
            uploadFile(pb, amazon_bucket, fastq_dir, files[1] )
        else:
            uploadFile(pb, amazon_bucket, fastq_dir, filename )

    sys.exit(0)

if __name__ == "__main__":
    main()
