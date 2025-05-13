// Interfaces for question config options
interface TextConfig {
    type: 'text';
    pattern?: string; // Regex pattern for validation, e.g., "[0-9A-Z]{8}"
}

interface Period {
    start: string; // YYYY-MM-DD
    end: string; // YYYY-MM-DD
}

interface PeriodSelectConfig {
    type: 'period-select';
    options: Period[]; // Array of period objects
}

interface DateConfig {
    type: 'date';
}

interface BooleanConfig {
    type: 'boolean';
}

type QuestionConfig = TextConfig | PeriodSelectConfig | DateConfig | BooleanConfig;

interface Question {
    id: number;
    label: string;
    config: QuestionConfig;
}

// Interfaces for return types
interface CnfResult {
    kind: 'success';
    cnf_required: boolean;
    deadline: string | null; // YYYY-MM-DD or null
    reason: string; // Human-readable rationale
}

interface ErrorResult {
    kind: 'error';
    error: string;
}

type Result = CnfResult | ErrorResult;

// Mock Companies House API response
interface CompanyProfile {
    accounting_reference_date: { day: number; month: number };
    last_accounts: { period_end_on: string };
}

// Mock Companies House API call (replace with real API)
async function getCompany(companyNumber: string): Promise<CompanyProfile> {
    // In production: fetch from https://api.companieshouse.gov.uk/company/{companyNumber}
    if (!companyNumber.match(/^[0-9A-Z]{8}$/)) {
        throw new Error('Invalid company number');
    }
    return {
        accounting_reference_date: { day: 31, month: 3 },
        last_accounts: { period_end_on: '2024-03-31' },
    };
}

// Extract accounting periods
function getPeriods(companyProfile: CompanyProfile): Period[] {
    const { accounting_reference_date, last_accounts } = companyProfile;
    const day = accounting_reference_date.day;
    const month = accounting_reference_date.month - 1; // JS months 0-based
    const lastEndDate = new Date(last_accounts.period_end_on);

    const periods: Period[] = [];
    for (let year = lastEndDate.getFullYear(); year >= lastEndDate.getFullYear() - 2; year--) {
        const end = new Date(year, month, day);
        const start = new Date(year - 1, month, day + 1);
        periods.push({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0],
        });
    }
    return periods;
}

// Calculate deadline (6 months after period end)
function calculateDeadline(endDate: string): string {
    const date = new Date(endDate);
    date.setMonth(date.getMonth() + 6);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Async generator for CNF form logic
async function* cnfFormLogic(): AsyncGenerator<Question, Result, unknown> {
    const companyNumber = yield {
        id: 1,
        label: 'Enter your company number',
        config: { type: 'text', pattern: '[0-9A-Z]{8}' },
    } as Question;

    let periods: Period[];
    try {
        const companyProfile = await getCompany(companyNumber as string);
        periods = getPeriods(companyProfile);
    } catch (error) {
        return { kind: 'error', error: (error as Error).message };
    }

    const chosenPeriod = yield {
        id: 2,
        label: 'Choose a period',
        config: { type: 'period-select', options: periods },
    } as Question;

    // Early return if period starts before 1 April 2023
    if (new Date((chosenPeriod as Period).start) < new Date('2023-04-01')) {
        return {
            kind: 'success',
            cnf_required: false,
            deadline: null,
            reason: 'Claims for periods beginning before 1 April 2023 do not require a CNF to be submitted.',
        };
    }

    const deadline = calculateDeadline((chosenPeriod as Period).end);

    // Check submission date
    const submissionDate = yield {
        id: 3,
        label: 'Claim submission date',
        config: { type: 'date' },
    } as Question;

    // Early return if claim submitted within notification period
    if (submissionDate && new Date(submissionDate as string) <= new Date(deadline)) {
        return {
            kind: 'success',
            cnf_required: false,
            deadline: null,
            reason: 'No CNF is required because the claim was submitted within the notification period (6 months after the accounting period end).',
        };
    }

    // Check previous claims
    const hasClaimed = yield {
        id: 4,
        label: 'Has this company claimed R&D tax relief before?',
        config: { type: 'boolean' },
    } as Question;

    if (!(hasClaimed as boolean)) {
        return {
            kind: 'success',
            cnf_required: true,
            deadline,
            reason: 'A CNF is required because this is the company’s first R&D tax relief claim.',
        };
    }

    // Check recent claim date
    const recentClaimDate = yield {
        id: 5,
        label: 'When was the most recent R&D claim submitted?',
        config: { type: 'date' },
    } as Question;

    // Check if recent claim is within 3 years of deadline
    const threeYearsBeforeDeadline = new Date(deadline);
    threeYearsBeforeDeadline.setFullYear(threeYearsBeforeDeadline.getFullYear() - 3);
    if (recentClaimDate && new Date(recentClaimDate as string) >= threeYearsBeforeDeadline) {
        // Need to check rejection and amendments
    } else {
        return {
            kind: 'success',
            cnf_required: true,
            deadline,
            reason: 'A CNF is required because the most recent claim was submitted more than 3 years before the notification period deadline.',
        };
    }

    // Check rejection
    const claimRejected = yield {
        id: 6,
        label: 'Was any previous R&D claim rejected by HMRC?',
        config: { type: 'boolean' },
    } as Question;
    if (claimRejected as boolean) {
        return {
            kind: 'success',
            cnf_required: true,
            deadline,
            reason: 'A CNF is required because a previous R&D claim was rejected by HMRC.',
        };
    }

    // Check amendments
    const amendedClaim = yield {
        id: 7,
        label: 'Have you amended any R&D claim for a period before 1 April 2023 on or after 1 April 2023?',
        config: { type: 'boolean' },
    } as Question;
    if (!(amendedClaim as boolean)) {
        return {
            kind: 'success',
            cnf_required: false,
            deadline: null,
            reason: 'No CNF is required because there was a recent claim within 3 years, no rejections, and no amendments for periods before 1 April 2023 made on or after 1 April 2023.',
        };
    }

    // Check amendment date
    const amendedDate = yield {
        id: 8,
        label: 'When was the amendment submitted?',
        config: { type: 'date' },
    } as Question;
    if (amendedDate && new Date(amendedDate as string) >= new Date('2023-04-01')) {
        return {
            kind: 'success',
            cnf_required: true,
            deadline,
            reason: 'A CNF is required because an R&D claim for a period before 1 April 2023 was amended on or after 1 April 2023.',
        };
    }

    return {
        kind: 'success',
        cnf_required: false,
        deadline: null,
        reason: 'No CNF is required because the amendment to a claim for a period before 1 April 2023 was made before 1 April 2023.',
    };
}

// Manager to handle async generator and navigation
class FormManager {
    private history: { questionId: number; response: unknown }[] = [];
    private generator: AsyncGenerator<Question, Result, unknown> | null = null;
    private currentQuestion: Question | null = null;
    private result: Result | null = null;

    async start(): Promise<Question> {
        this.generator = cnfFormLogic();
        this.history = [];
        this.result = null;
        this.currentQuestion = (await this.generator.next()).value as Question;
        return this.currentQuestion;
    }

    async next(response: unknown): Promise<Question | Result> {
        if (!this.currentQuestion || !this.generator) return { kind: 'error', error: 'No active question' };
        this.history.push({ questionId: this.currentQuestion.id, response });
        const next = await this.generator.next(response);
        if (next.done) {
            this.result = next.value as Result;
            this.currentQuestion = null;
            return this.result;
        }
        this.currentQuestion = next.value as Question;
        return this.currentQuestion;
    }

    async back(): Promise<Question | Result | null> {
        if (this.history.length === 0) return null;

        this.history.pop();
        this.result = null;

        this.generator = cnfFormLogic();
        this.currentQuestion = (await this.generator.next()).value as Question;

        for (const { response } of this.history) {
            const next = await this.generator.next(response);
            if (next.done) {
                this.result = next.value as Result;
                this.currentQuestion = null;
                return this.result;
            }
            this.currentQuestion = next.value as Question;
        }

        return this.currentQuestion;
    }

    getCurrent(): Question | Result | null {
        return this.result || this.currentQuestion;
    }
}

export function createFormManager(): FormManager {
    return new FormManager();
}

export type { Question, QuestionConfig, Result, CnfResult, ErrorResult, Period };