import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

export class AwsCloudResumeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     // S3 Bucket to hold the website
    const wsBucket = new Bucket(this, 'WebsiteBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });


    const asset = path.join(__dirname, 'resume')

    const bucketDeployment = new BucketDeployment(this, 'DeployWebsite', {
      sources: [
        Source.asset(asset)
      ],
      destinationBucket: wsBucket,
      destinationKeyPrefix: 'resume/',
    });

  }
}
