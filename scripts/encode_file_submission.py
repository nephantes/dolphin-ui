#imports
import sys
import math
import os
import requests
import json
#from filechunkio import FileChunkIO
import boto
from boto.s3.connection import S3Connection
from boto.s3.key import Key

#grab commandline args
file_path = sys.argv[1]
access_key = sys.argv[2]
secret_key = sys.argv[3]
upload = sys.argv[4]
split = upload.split("/")
upload_path = upload.split(split[2])[1]
session_token = sys.argv[5]
url = sys.argv[6]
bucket = sys.argv[7]
log = sys.argv[8]

host = url
print upload.split("/")[-1].split(".")[0]

#connect
conn = S3Connection(access_key, secret_key, security_token=session_token)
Bucket = conn.get_bucket(bucket, validate=False)

# Get file info
source_path = file_path
source_size = os.stat(source_path).st_size
try:
    # Create a multipart upload request
    mp = Bucket.initiate_multipart_upload(upload)

    # Use a chunk size of 50 MiB
    chunk_size = 52428800
    chunk_count = int(math.ceil(source_size / float(chunk_size)))

    # Send the file parts, using FileChunkIO to create a file-like object
    # that points to a certain byte range within the original file. We
    # set bytes to never exceed the original file size.
    for i in range(chunk_count):
        offset = chunk_size * i
        bytes = min(chunk_size, source_size - offset)
        with FileChunkIO(source_path, 'r', offset=offset, bytes=bytes) as fp:
            mp.upload_part_from_file(fp, part_num=i + 1)

    # Finish the upload
    mp.complete_upload()
except boto.exception.S3ResponseError as e:
    print e

#send whole file
sys.stdout = open(log, 'a')
try:
    k = Key(Bucket)
    k.name = upload_path 
    k.set_contents_from_filename(file_path)
    print '{"message":"passed"}'
except boto.exception.S3ResponseError as e:
    print e
