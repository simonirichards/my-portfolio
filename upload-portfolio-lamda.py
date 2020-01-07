import boto3
from botocore.client import Config
from io import StringIO
import io
import zipfile
import mimetypes

def lambda_handler(event, context):
    sns = boto3.resource('sns')
    topic = sns.Topic('arn:aws:sns:ap-southeast-2:079094652481:deployPortfolioTopic')
    
    location = {
        "bucketName": 'portfoliobuild.simonrichards.info',
        "objectKey": 'portfolio.zip'
    }

    try:
        job = event.get("CodePipeline.job")

        if job:
            print("CodePipeline Job " + str(job))
            for artifact in job["data"]["inputArtifacts"]:
                if artifact["name"] == "BuildArtifact":
                    location = artifact["location"]["s3Location"]

        print("Building portfolio from " + str(location))

        s3 = boto3.resource('s3', config=Config(signature_version='s3v4'))
        portfolio_bucket = s3.Bucket('portfolio.simonrichards.info')
        build_bucket = s3.Bucket(location["bucketName"])
        
        portfolio_zip = io.BytesIO()
        build_bucket.download_fileobj(location["objectKey"], portfolio_zip)
        
        with zipfile.ZipFile(portfolio_zip) as myzip:
            for nm in myzip.namelist():
                obj = myzip.open(nm)
                portfolio_bucket.upload_fileobj(obj, nm,
                    ExtraArgs={'ContentType':mimetypes.guess_type(nm)[0]})
                portfolio_bucket.Object(nm).Acl().put(ACL='public-read')
        
        topic.publish(Subject="Portfolio Deployed", Message="Portfolio Deployed Successfully")
        if job:
            codepipeline = boto3.client('codepipeline')
            codepipeline.put_job_success_result(jobId=job["id"])
    except:
        topic.publish(Subject="ERROR: Portfolio Not Deployed", Message="Portfolio Deployment Failure - Investigate")
        if job:
            codepipeline = boto3.client('codepipeline')
            codepipeline.put_job_failure_result(jobId=job["id"],failureDetails={'type': 'JobFailed','message': 'CodePipeline Job Failure'})
        raise
    return 'Portfolio Code Uploaded'