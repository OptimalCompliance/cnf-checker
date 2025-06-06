import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface CnfCheckerStackProps extends cdk.StackProps {
  stage: string;
}

export class CnfCheckerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CnfCheckerStackProps) {
    super(scope, id, props);

    // Create a public S3 bucket for hosting the static website
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      // Use stage in bucket name to ensure uniqueness across deployments
      bucketName: `cnf-checker-website-${props.stage}`,
      // Configure for website hosting
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY, // Allow public access
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      // Remove bucket and contents when stack is deleted
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Output the bucket name and website URL
    new cdk.CfnOutput(this, 'BucketName', {
      value: websiteBucket.bucketName,
      description: 'The name of the S3 bucket',
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: websiteBucket.bucketWebsiteUrl,
      description: 'The URL of the website',
    });
  }
}
