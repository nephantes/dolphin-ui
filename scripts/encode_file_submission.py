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
requests.packages.urllib3.disable_warnings()

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

encoded_access_key = "JZZGVV5D"
encoded_secret_access_key = '5grlay5j7mlpqo7h'
headers = {
    'Content-type': 'application/json',
    'Accept': 'application/json',
}
r = requests.post(
    host + 'files/'+upload.split("/")[-1].split(".")[0]+'/upload',
    auth=(encoded_access_key, encoded_secret_access_key),
    data=json.dumps({}),
    headers=headers
)
try:
    r.raise_for_status()
except:
    print(r.text)
    raise

item = r.json()['@graph'][0];
access_key = item['upload_credentials']['access_key'];
secret_key = item['upload_credentials']['secret_key'];
session_token = item['upload_credentials']['session_token'];
upload = item['upload_credentials']['upload_url'];
split = upload.split("/")
upload_path = upload.split(split[2])[1]
com = "export AWS_SESSION_TOKEN="+ session_token
com = com + " && export AWS_ACCESS_KEY_ID="+ access_key 
com = com + " && export AWS_SECRET_ACCESS_KEY="+ secret_key 
com = com + " && aws s3 cp "+ file_path +" " + upload

print(com)

child = os.popen(com)
response = child.read().rstrip()
print(response)
err = child.close()
print(err)
