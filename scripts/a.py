#!/usr/bin/env python
 
import os, re, string, sys, commands
from sys import argv, exit, stderr
from optparse import OptionParser
 
from boto.s3.connection import S3Connection
from boto.s3.key import Key

def stop_err( msg ):
    sys.stderr.write( "%s\n" % msg )
    sys.exit()

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
    try:
      if not inputdir :
         print >>stderr, 'Error: Input dir is NULL.'
         exit( 128 )

      if not s3path :
         print >>stderr, 'Error: s3path is NULL.'
         exit( 128 )





if __name__ == '__main__' :
	main()
