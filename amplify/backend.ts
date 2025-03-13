import { defineBackend } from '@aws-amplify/backend';
import * as s3 from 'aws-cdk-lib/aws-s3';
// import { data } from './data/resource';
import { auth } from './auth/resource';
import { storage } from './storage/resource';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  storage,
  auth,
  // data,
});

const s3Bucket = backend.storage.resources.bucket;
const cfnBucket = s3Bucket.node.defaultChild as s3.CfnBucket;

// Enable static website hosting
cfnBucket.websiteConfiguration = {
  indexDocument: "index.html",
  errorDocument: "error.html",
};

// // Grant public read access by updating the bucket policy
// const bucketPolicy = new iam.PolicyStatement({
//   actions: ["s3:GetObject"],
//   resources: [`${s3Bucket.bucketArn}/*`],
//   principals: [new iam.AnyPrincipal()], // Allows public access
// });

// s3Bucket.addToResourcePolicy(bucketPolicy);

// Remove default S3 public access blocks
cfnBucket.publicAccessBlockConfiguration = {
  blockPublicAcls: false,
  blockPublicPolicy: false,
  ignorePublicAcls: false,
  restrictPublicBuckets: false,
};