# CNF Checker

A step-by-step form application that helps users determine whether a Claim Notification Form (CNF) is necessary for HMRC R&D tax relief and what the submission deadline is.

## Purpose

This application allows users to:
- Check CNF requirements based on company accounting periods
- Determine submission deadlines
- Receive guidance through the process

The tool is completely unauthenticated and available for anyone to use.

## Technical Stack

- **Frontend**: HTML, TypeScript, CSS using Svelte framework
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Deployment**: AWS CDK, S3 bucket for hosting
- **External APIs**: Companies House API for accounting period data

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the project root with:
   ```
   VITE_CH_API_KEY=your_companies_house_api_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Deployment

The application is deployed using AWS CDK to an S3 bucket configured for static website hosting.

### Main Environments
- **dev**: Development environment
- **prod**: Production environment

### Custom Deployment
Deploy to any named environment using:
```
./deploy/deploy.sh <environment_name>
```

This script:
1. Builds the application
2. Deploys the infrastructure using CDK
3. Uploads the build files to the S3 bucket

## Application Flow

The application guides users through a series of questions to determine CNF requirements:
1. Enter company number (fetches data from Companies House API)
2. Select accounting period
3. Answer questions about R&D tax relief claims
4. Receive result indicating if CNF is required and the deadline
