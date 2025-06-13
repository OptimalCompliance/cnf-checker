# Future Development Ideas

## Table-Based Claim Date Input

Instead of the current step-by-step wizard approach, we could implement a table-based interface for inputting past claim dates. This would offer a more efficient way to manage multiple claims at once.

### Features:
- **Data Source**: Dates would be fetched directly from Companies House
- **Table Structure**:
  - **Column 1**: Claim Start Date
  - **Column 2**: Claim End Date
  - **Column 3**: Date of Submission (date input field)
  - **Column 4**: Amendment Status (boolean selector - Amendment or Original)

### Benefits:
- More efficient data entry for multiple claims
- Better visual representation of claim timeline
- Easier to identify gaps or overlaps in claim periods

### Functionality:
The amendment status selector would be used to determine if the claim in question needs a CNF or whether it's covered by a prior claim. Original submissions would be treated differently from amendments in the validation logic.

### Timeline Visualization:
- All claim dates would be displayed on the timeline SVG for better visualization
- The timeline would clearly mark the 3-year prior threshold, allowing users to easily see which past claims fall within this critical period

## Optional Claim Submission Date

For claims that haven't been submitted yet, we should make the submission date field optional:

### Features:
- Add a "Not submitted yet" checkbox next to the submission date field
- When checked, the date field would be disabled
- This accommodates users who are planning future submissions or evaluating whether a CNF is needed before submission

### Benefits:
- More flexible user experience
- Supports pre-submission planning
- Allows for CNF requirement checking before actual submission
