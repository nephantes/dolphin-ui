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

def getAmazonCredentials(user):
    try:
        sql = 'SELECT DISTINCT ac.* FROM biocore.amazon_credentials ac, biocore.group_amazon ga, biocore.users u where ac.id=ga.amazon_id and ga.group_id=u.group_id and u.username="'+user+'";'
        results = runSQL(sql)
    except Exception, err:
        sys.stderr.write('ERROR: %s\n' % str(err))
        sys.exit(2)
    return results

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

    sys.exit(0)

if __name__ == "__main__":
    main()
