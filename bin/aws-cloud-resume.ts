#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CloudResumeStack } from '../lib/aws-cloud-resume-stack';

const app = new cdk.App();
new CloudResumeStack(app, 'AwsCloudResumeStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  }
});