#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CnfCheckerStack } from './lib/cnf-checker-stack';

const app = new cdk.App();

// Get the stage from context or use 'dev' as default
const stage = app.node.tryGetContext('stage') || 'dev';

// Create the stack with a stage-specific name
new CnfCheckerStack(app, `cnfChecker-${stage}`, {
  stage: stage,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'eu-west-2',
  },
});