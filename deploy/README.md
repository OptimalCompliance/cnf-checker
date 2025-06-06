# CNF Checker Deployment

This directory contains the AWS CDK infrastructure code for deploying the CNF Checker application.

## Prerequisites

- [Bun](https://bun.sh/) installed

## Deployment

The deployment scripts will:
1. Build the application
2. Deploy the CloudFormation stack using CDK
3. Upload the built files to an S3 bucket
4. Display the website URL

It does not matter which directory you run the scripts from.

### Using the Bash script (Linux/macOS)

```bash
# Deploy to a specific environment
./deploy.sh <stage>

# Example: Deploy to dev environment
./deploy.sh dev
```

### Using the PowerShell script (Windows)

```powershell
# Deploy to a specific environment
.\deploy.ps1 -Stage <stage>

# Example: Deploy to dev environment
.\deploy.ps1 -Stage dev
```

## Cleanup

To remove all resources created by a stack:

### Using the PowerShell script (Windows)

```powershell
# Remove a specific environment
.\remove.ps1 -Stage <stage>

# Example: Remove dev environment
.\remove.ps1 -Stage dev
```

### Using CDK directly

```bash
# Remove a specific environment
bun run cdk destroy --context stage=<stage> --force
```
