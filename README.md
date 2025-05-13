# CNF checker

### Application Description
The application is a Svelte-based wizard form that determines whether a Claim Notification Form (CNF) is required for HMRC R&D tax relief and its submission deadline. Users input a company number to fetch accounting periods from the Companies House API, then answer sequential questions to evaluate CNF requirements based on HMRC rules. The form uses an async generator to manage question flow, supports back navigation, and returns `{ cnf_required: boolean, deadline: string | null }` or an error. Questions are yielded only when needed, with early returns when the outcome is certain.

### Formal Definition: Decision Tree/State Machine Flow
The form operates as a decision tree implemented via an async generator, where each node (state) is a question, and edges (transitions) depend on user responses. The flow evaluates HMRC rules, returning early when CNF requirement is determined or proceeding to the next question if more data is needed. Below, each question is defined with its response type, input method, conditions for early return, and conditions for proceeding.

#### Question 1: Company Number
- **ID**: 1
- **Text**: "Enter your company number"
- **Response Type**: String (8-character alphanumeric, e.g., "12345678")
- **Input Method**: Text input with pattern validation (`[0-9A-Z]{8}`)
- **Early Return**:
    - If API call to `getCompany(companyNumber)` fails (e.g., invalid number, network error):
        - Proceed to Question 2 (error retry).
- **Next Question**:
    - If API call succeeds, fetch company profile, extract periods via `getPeriods`, proceed to Question 3.

#### Question 2: Retry Company Number (Error Handling)
- **ID**: 2
- **Text**: "Error fetching company data: [error message]. Retry company number."
- **Response Type**: String (8-character alphanumeric)
- **Input Method**: Text input with pattern validation (`[0-9A-Z]{8}`)
- **Early Return**:
    - If retry fails, return `{ error: "Invalid company number" }`.
- **Next Question**:
    - If retry succeeds, fetch profile, extract periods, proceed to Question 3.

#### Question 3: Choose a Period
- **ID**: 3
- **Text**: "Choose a period"
- **Response Type**: Object `{ start: "YYYY-MM-DD", end: "YYYY-MM-DD" }`
- **Input Method**: Select dropdown with period options (e.g., "01/04/2023 - 31/03/2024")
- **Early Return**:
    - If `period.start < 2023-04-01`, return `{ cnf_required: false, deadline: null }`.
- **Next Question**:
    - If `period.start >= 2023-04-01`, compute deadline (6 months after `period.end`), proceed to Question 4.

#### Question 4: Claim Submission Date
- **ID**: 4
- **Text**: "Claim submission date"
- **Response Type**: String (`"YYYY-MM-DD"`) or null ("Not yet submitted")
- **Input Method**: Date picker or text input with date format validation
- **Early Return**:
    - If `submissionDate <= deadline`, return `{ cnf_required: false, deadline: null }`.
- **Next Question**:
    - If `submissionDate > deadline` or null, proceed to Question 5.

#### Question 5: Has Claimed Before
- **ID**: 5
- **Text**: "Has this company claimed R&D tax relief before?"
- **Response Type**: Boolean (`true`/`false`)
- **Input Method**: Radio buttons or toggle
- **Early Return**:
    - If `hasClaimed = false`, return `{ cnf_required: true, deadline }`.
- **Next Question**:
    - If `hasClaimed = true`, proceed to Question 6.

#### Question 6: Recent Claim Date
- **ID**: 6
- **Text**: "When was the most recent R&D claim submitted?"
- **Response Type**: String (`"YYYY-MM-DD"`)
- **Input Method**: Date picker or text input with date format validation
- **Early Return**:
    - If `recentClaimDate < (deadline - 3 years)`, return `{ cnf_required: true, deadline }`.
- **Next Question**:
    - If `recentClaimDate >= (deadline - 3 years)`, proceed to Question 7.

#### Question 7: Claim Rejected
- **ID**: 7
- **Text**: "Was any previous R&D claim rejected by HMRC?"
- **Response Type**: Boolean (`true`/`false`)
- **Input Method**: Radio buttons or toggle
- **Early Return**:
    - If `claimRejected = true`, return `{ cnf_required: true, deadline }`.
- **Next Question**:
    - If `claimRejected = false`, proceed to Question 8.

#### Question 8: Amended Claim
- **ID**: 8
- **Text**: "Have you amended any R&D claim for a period before 1 April 2023 on or after 1 April 2023?"
- **Response Type**: Boolean (`true`/`false`)
- **Input Method**: Radio buttons or toggle
- **Early Return**:
    - If `amendedClaim = false`, return `{ cnf_required: false, deadline: null }`.
- **Next Question**:
    - If `amendedClaim = true`, proceed to Question 9.

#### Question 9: Amendment Date
- **ID**: 9
- **Text**: "When was the amendment submitted?"
- **Response Type**: String (`"YYYY-MM-DD"`)
- **Input Method**: Date picker or text input with date format validation
- **Early Return**:
    - If `amendedDate >= 2023-04-01`, return `{ cnf_required: true, deadline }`.
    - If `amendedDate < 2023-04-01`, return `{ cnf_required: false, deadline: null }`.
- **Next Question**: None (end of flow).

### Flow Summary
- **States**: 9 questions, each yielding a question object `{ id, label, config }`.
- **Transitions**: Determined by response values, with conditions checked for early returns or next question.
- **Early Returns**: Triggered when CNF requirement is certain (e.g., period before 1 April 2023, no prior claims, recent claim within 3 years with no issues).
- **Next Questions**: Yielded only when additional data is needed to resolve ambiguity (e.g., checking rejections or amendments after a recent claim).
- **Back Navigation**: Supported by `FormManager`, which stores response history and replays to reconstruct prior states.

This definition ensures the form follows HMRC rules, minimizes questions, and provides clear input methods for user responses.