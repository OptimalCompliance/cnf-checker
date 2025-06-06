# CNF Checker Removal Script (PowerShell version)
# This script removes the CDK stack for the specified stage

param(
    [string]$Stage
)

# Check if stage parameter is provided
if (-not $Stage) {
    Write-Host "Error: Stage parameter is required" -ForegroundColor Red
    Write-Host "Usage: .\remove.ps1 <stage>" -ForegroundColor Yellow
    Write-Host "Example: .\remove.ps1 dev" -ForegroundColor Yellow
    exit 1
}

Write-Host "Removing stack for stage: $Stage" -ForegroundColor Yellow

# Get the directory of the script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Change to the deploy directory
Set-Location -Path $ScriptDir

# Run CDK destroy for the specified stage
Write-Host "Destroying CDK stack..." -ForegroundColor Cyan
bun run cdk destroy --context stage=$Stage --force

Write-Host "Stack removal complete!" -ForegroundColor Green
