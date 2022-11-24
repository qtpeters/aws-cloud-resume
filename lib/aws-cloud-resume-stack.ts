import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Distribution, AllowedMethods, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

export class CloudResumeStack extends cdk.Stack {

  // Define a constructor in the class that subclasses cdk.Stack
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {

    // Call the userclass with necessary props
    super(scope, id, props);

    // S3 Bucket to hold the website
    const wsBucket = new Bucket(this, 'CloudResumeBucket', {
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.UNENCRYPTED,
      enforceSSL: false,
      versioned: false,
      autoDeleteObjects: true,
      websiteIndexDocument: "index.html",
      removalPolicy: RemovalPolicy.DESTROY,
    });


    // Wrap the web pages up as assets to be uploades
    const asset = path.join(__dirname, 'resume')

    // Create a bucket deployment to specify the assets 
    const bucketDeployment = new BucketDeployment(this, 'CloudResumeDeploy', {
      sources: [
        Source.asset(asset)
      ],
      destinationBucket: wsBucket,
      destinationKeyPrefix: '',
    });


    // Create a cloudfront distribution to manage https
    const crDistribution = new Distribution(this, 'CloudResumeDistribution', {
      defaultBehavior: {
        origin: new S3Origin(wsBucket),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    new CfnOutput(
      this, 'CloudResumeCloudfrontDomainName', { 
        value:  crDistribution.distributionDomainName
      }
    );

  }
}
