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

def runSQL(dbhostname, sql):
    port=3306
    db = MySQLdb.connect(
      host = dbhostname,
      user = 'biocore',
      passwd = 'biocore2013',
      db = 'biocore',
      port = port)
    try:
        cursor = db.cursor()
        cursor.execute(sql)
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

def getFileList(dbhostname, username, wkey):
    try:
        sql = "SELECT d.fastq_dir, f.file_name, d.amazon_bucket FROM biocore.ngs_fastq_files f, biocore.ngs_dirs d where d.id=f.dir_id;"
        results = runSQL(dbhostname, sql)
    except Exception, err:
        sys.stderr.write('ERROR: %s\n' % str(err))
        sys.exit(2)
    return results


def main():
    #define options
    parser = OptionParser()
    parser.add_option("-d", "--inputdir", dest="inputdir")
    parser.add_option("-s", "--s3path", dest="s3path")

    # parse
    options, args = parser.parse_args()
    
    # retrieve options
    inputdir    = options.inputdir
    s3path      = options.s3path
    if not inputdir :
         print >>stderr, 'Error: Input dir is NULL.'
         exit( 128 )

    if not s3path :
         print >>stderr, 'Error: s3path is NULL.'
         exit( 128 )

    conn = S3Connection('AKIAIMGELA7PNLBEHUSA', 'rK2esfiqi9mxwuFSFymZUZMNF5UYY+ihcZMFrnzq')
    pb = conn.get_bucket('biocorebackup')

    k = Key(pb)
    file_name = "%s/%s"%(s3path, os.path.basename(inputdir))
    k.name = file_name
    k.set_contents_from_filename(inputdir)
    sys.exit(0)

if __name__ == "__main__":
    main()
