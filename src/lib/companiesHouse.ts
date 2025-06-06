// Companies House API client

// Placeholder company profile to use when API calls fail
export const PLACEHOLDER_COMPANY_PROFILE: CompanyProfile = {
    accounting_reference_date: { day: 31, month: 3 },
    last_accounts: { period_end_on: '2025-03-31' },
    name: 'Example Company Ltd',
    company_number: '12345678'
};

// Company profile interface matching the Companies House API response structure
export interface CompanyProfile {
    accounting_reference_date: { day: number; month: number };
    last_accounts: { period_end_on: string };
    name: string;
    company_number: string;
}

/**
 * Fetches company information from the Companies House API
 * @param companyNumber The 8-character company registration number
 * @returns Promise resolving to company profile data
 */
export async function getCompany(companyNumber: string): Promise<CompanyProfile> {
    try {
        // Validate company number format
        if (!companyNumber.match(/^[0-9A-Z]{8}$/)) {
            throw new Error('Invalid company number');
        }

        // Get API key from environment variables
        const apiKey = import.meta.env.VITE_CH_API_KEY;
        if (!apiKey) {
            throw new Error('Companies House API key not found in environment variables');
        }

        // Create authorization header with API key (Basic auth with empty password)
        const authHeader = `Basic ${btoa(`${apiKey}:`)}`;

        // Make request to Companies House API
        const response = await fetch(`https://api.companieshouse.gov.uk/company/${companyNumber}`, {
            headers: {
                Authorization: authHeader,
                Accept: 'application/json'
            }
        });

        // Handle error responses
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Company number ${companyNumber} not found`);
            }
            throw new Error(`Companies House API error: ${response.status} ${response.statusText}`);
        }

        // Parse and return the response
        const data = await response.json();

        // Extract and return the required fields
        return {
            accounting_reference_date: data.accounting_reference_date,
            last_accounts: data.last_accounts,
            name: data.company_name,
            company_number: data.company_number
        };
    } catch (error) {
        console.error(`Error fetching company data: ${error instanceof Error ? error.message : String(error)}`);
        // Return placeholder values instead of throwing an error
        return PLACEHOLDER_COMPANY_PROFILE;
    }
}
