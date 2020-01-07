import boto3
from botocore.client import Config
from io import StringIO
import io
import zipfile
import mimetypes

def lambda_handler(event, context):
    sns = boto3.resource('sns')
    topic = sns.Topic('arn:aws:sns:ap-southeast-2:079094652481:deployPortfolioTopic')
    
    try:
        s3 = boto3.resource('s3', config=Config(signature_version='s3v4'))
        portfolio_bucket = s3.Bucket('portfolio.simonrichards.info')
        build_bucket = s3.Bucket('portfoliobuild.simonrichards.info')
        
        portfolio_zip = io.BytesIO()
        build_bucket.download_fileobj('portfolio.zip', portfolio_zip)
        
        with zipfile.ZipFile(portfolio_zip) as myzip:
            for nm in myzip.namelist():
                obj = myzip.open(nm)
                portfolio_bucket.upload_fileobj(obj, nm,
                    ExtraArgs={'ContentType':mimetypes.guess_type(nm)[0]})
                portfolio_bucket.Object(nm).Acl().put(ACL='public-read')
        
        topic.publish(Subject="Portfolio Deployed", Message="Portfolio Deployed Successfully")
    except:
        topic.publish(Subject="ERROR: Portfolio Not Deployed", Message="Portfolio Deployment Failure - Investigate")
        raise
    return 'Portfolio Code Uploaded'