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
<<<<<<< HEAD
      host = 'localhost',
=======
      host = 'galaxy.umassmed.edu',
>>>>>>> b4e46361835fc188e0abe2ee1c87f74373462b59
      user = 'biocore',
      passwd = 'biocore2013',
      db = 'biocore',
      port = port)
    try:
        cursor = db.cursor()
        cursor.execute(sql)
<<<<<<< HEAD
        #print sql
=======
	#print sql
>>>>>>> b4e46361835fc188e0abe2ee1c87f74373462b59
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

<<<<<<< HEAD
def getAmazonCredentials(user):
    try:
        sql = 'SELECT DISTINCT ac.* FROM biocore.amazon_credentials ac, biocore.group_amazon ga, biocore.users u where ac.id=ga.amazon_id and ga.group_id=u.group_id and u.username="'+user+'";'
        results = runSQL(sql)
=======
def calcHashFilesInCluster(fastqdir, filename):
     result = checkIfHashCalculated(fastqdir, filename)
     print result 
     
     if len(result)>0:
        print "Already added!!!"
        return
     
     command = "python dolphin_wrapper.py hashcalc_workflow.txt '%s' '%s' /home/ak97w/out kucukura@umassmed.edu"%(filename,fastqdir)
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
		
>>>>>>> b4e46361835fc188e0abe2ee1c87f74373462b59
    except Exception, err:
        sys.stderr.write('ERROR: %s\n' % str(err))
        sys.exit(2)
    return results
<<<<<<< HEAD

def getRunGroups():
    sql = "SELECT DISTINCT run_group_id from biocore.ngs_runlist;"
    return runSQL(sql)


def getSampleList(run_group_id):
    sql = "SELECT s.name, s.adapter, s.genotype, ts.file_name, d.fastq_dir, d.backup_dir, d.amazon_bucket FROM biocore.ngs_runlist nr, biocore.ngs_samples s, biocore.ngs_temp_sample_files ts, biocore.ngs_dirs d where nr.sample_id=s.id and s.runstatus=0 and s.id=ts.sample_id and d.id=ts.dir_id and nr.run_group_id='"+str(run_group_id)+"';"
    return runSQL(sql)

def main():
    try:
        parser = OptionParser()
        parser.add_option('-u', '--username', help='username', dest='username')

        (options, args) = parser.parse_args()
    except:
        parser.print_help()
        print "for help use --help"
        sys.exit(2)

    USERNAME              = options.username

    if (USERNAME == None):
        print "for help use --help"
        sys.exit(2)
    
    rungroup_res = getRunGroups()
    
    for rungroup in rungroup_res:
        samples=getSampleList(rungroup[0])
        for sample in samples:
            print sample 
=======
  

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
>>>>>>> b4e46361835fc188e0abe2ee1c87f74373462b59

    sys.exit(0)

if __name__ == "__main__":
    main()
