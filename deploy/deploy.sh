#!/bin/bash
# CNF Checker Deployment Script
# This script builds the application and deploys it to the S3 bucket

# Exit on error
set -e

# Check if stage parameter is provided
if [ -z "$1" ]; then
    echo "Error: Stage parameter is required"
    echo "Usage: ./deploy.sh <stage>"
    echo "Example: ./deploy.sh dev"
    exit 1
fi

STAGE=$1
echo "Deploying to stage: $STAGE"

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Get the project root directory (parent of script directory)
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." &> /dev/null && pwd )"

# Build the application
echo "Building the application..."
cd "$PROJECT_ROOT"
bun run build

# Change to the deploy directory
cd "$SCRIPT_DIR"

# Run CDK deploy and capture the outputs
echo "Deploying with CDK..."
CDK_OUTPUT=$(bun run cdk deploy -- --context stage=$STAGE --outputs-file ./cdk-outputs.json --require-approval never)

# Parse the outputs file to get bucket name and website URL
BUCKET_NAME=$(cat ./cdk-outputs.json | jq -r ".\"cnfChecker-$STAGE\".BucketName")
WEBSITE_URL=$(cat ./cdk-outputs.json | jq -r ".\"cnfChecker-$STAGE\".WebsiteURL")

# Clean up the outputs file
rm ./cdk-outputs.json

# Change back to the project root
cd "$PROJECT_ROOT"

echo "Deploying to S3 bucket: $BUCKET_NAME"

# Upload the build files to the S3 bucket (excluding index.html)
echo "Uploading files to S3..."
aws s3 sync "$PROJECT_ROOT/build" "s3://$BUCKET_NAME" --delete --exclude "index.html"

# Upload index.html separately with custom cache settings
echo "Uploading index.html with custom cache settings..."
aws s3 cp "$PROJECT_ROOT/build/index.html" "s3://$BUCKET_NAME/index.html" --cache-control "max-age=0,no-cache,no-store,must-revalidate"

echo "Deployment complete!"
echo "Website URL: $WEBSITE_URL"
