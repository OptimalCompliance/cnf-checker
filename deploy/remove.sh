#!/bin/bash
# CNF Checker Removal Script
# This script removes the CDK stack for the specified stage

# Exit on error
set -e

# Check if stage parameter is provided
if [ -z "$1" ]; then
    echo "Error: Stage parameter is required"
    echo "Usage: ./remove.sh <stage>"
    echo "Example: ./remove.sh dev"
    exit 1
fi

STAGE=$1
echo "Removing stack for stage: $STAGE"

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Change to the deploy directory
cd "$SCRIPT_DIR"

# Run CDK destroy for the specified stage
echo "Destroying CDK stack..."
bun run cdk destroy -- --context stage=$STAGE --force

echo "Stack removal complete!"
