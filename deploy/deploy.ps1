# CNF Checker Deployment Script (PowerShell version)
# This script builds the application and deploys it to the S3 bucket

param(
    [string]$Stage
)

# Check if stage parameter is provided
if (-not $Stage) {
    Write-Host "Error: Stage parameter is required" -ForegroundColor Red
    Write-Host "Usage: .\deploy.ps1 <stage>" -ForegroundColor Yellow
    Write-Host "Example: .\deploy.ps1 dev" -ForegroundColor Yellow
    exit 1
}

Write-Host "Deploying to stage: $Stage"

# Get the directory of the script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# Get the project root directory (parent of script directory)
$ProjectRoot = Split-Path -Parent $ScriptDir

# Build the application
Write-Host "Building the application..." -ForegroundColor Cyan
Set-Location -Path $ProjectRoot
bun run build

# Change to the deploy directory
Set-Location -Path $ScriptDir

# Run CDK deploy and capture the outputs
Write-Host "Deploying with CDK..." -ForegroundColor Cyan
$OutputsFile = Join-Path -Path $ScriptDir -ChildPath "cdk-outputs.json"
bun run cdk deploy --context stage=$Stage --outputs-file $OutputsFile --require-approval never

# Parse the outputs file to get bucket name and website URL
$CdkOutputs = Get-Content -Path $OutputsFile | ConvertFrom-Json
$BucketName = $CdkOutputs."cnfChecker-$Stage".BucketName
$WebsiteUrl = $CdkOutputs."cnfChecker-$Stage".WebsiteURL

# Clean up the outputs file
Remove-Item -Path $OutputsFile -Force

# Change back to the project root
Set-Location -Path $ProjectRoot

Write-Host "Deploying to S3 bucket: $BucketName" -ForegroundColor Cyan

# Upload the build files to the S3 bucket (excluding index.html)
Write-Host "Uploading files to S3..." -ForegroundColor Cyan
aws s3 sync "$ProjectRoot\build" "s3://$BucketName" --delete --exclude "index.html"

# Upload index.html separately with custom cache settings
Write-Host "Uploading index.html with custom cache settings..." -ForegroundColor Cyan
aws s3 cp "$ProjectRoot\build\index.html" "s3://$BucketName/index.html" --cache-control "max-age=0,no-cache,no-store,must-revalidate"

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Website URL: $WebsiteUrl"
