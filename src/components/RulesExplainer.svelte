<!-- src/components/RulesExplainer.svelte -->
<script lang="ts">
    // No props or state needed for static content
</script>

<div class="w-full max-w-3xl">
    <section class="bg-white rounded-lg shadow-md p-12 px-6 sm:p-8 leading-relaxed text-gray-900">
        <h1 class="text-3xl font-bold mb-6 text-center">Claim Notification Form (CNF) Guidance</h1>

        <h2 class="text-xl font-semibold mb-4">Overview</h2>
        <p class="mb-4">
            The Claim Notification Form (CNF) is a mandatory step for some R&D tax relief under HMRC rules, as outlined in <a href="https://www.legislation.gov.uk/ukpga/2009/4/section/1045A" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">section 1045A of the Corporation Tax Act 2009</a>. It ensures companies notify HMRC of their intent to claim R&D tax relief within a specific period.
        </p>

        <h2 class="text-xl font-semibold mb-4">When is a CNF Required?</h2>
        <p class="mb-4">
            A CNF is required for an R&D claim unless one of the following applies:
        </p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>A valid R&D claim was made within the 3 years ending on the last day of the claim notification period (6 months after the accounting period ends).</li>
            <li>The accounting period begins before 1 April 2023 (no CNF needed).</li>
            <li>An exception applies due to incorrect HMRC guidance (see below).</li>
        </ul>
        <p class="mb-4">
            Claims for periods before 1 April 2023 amended on or after 1 April 2023 are ignored when checking for prior claims.
        </p>

        <h2 class="text-xl font-semibold mb-4">Deadline for Submitting a CNF</h2>
        <p class="mb-4">
            The CNF must be submitted within 6 months after the end of the accounting period. For example, if your accounting period ends on 31 December 2024, the CNF deadline is 30 June 2025.
        </p>

        <h2 class="text-xl font-semibold mb-4">HMRC Guidance Error Exception (8 September – 30 November 2024)</h2>
        <p class="mb-4">
            Due to incorrect guidance published in HMRC's CIRD183000 (8 September to 17 October 2024), claims may be allowed without a CNF if:
        </p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>A valid R&D claim for a period before 1 April 2023 was amended between 1 April 2023 and 30 November 2024.</li>
            <li>The claim notification period ends between 8 September 2024 and 30 November 2024.</li>
        </ul>

        <h2 class="text-xl font-semibold mb-4">Examples from HMRC</h2>

        <div class="border-l-4 border-blue-500 bg-gray-50 p-4 mb-6 rounded-r-md">
            <h3 class="text-lg font-semibold mb-2">Example 1: CNF Required</h3>
            <p class="mb-2">
                <strong>Accounting Period</strong>: 1 January 2024 – 31 December 2024
            </p>
            <p class="mb-2">
                <strong>Claim Notification Deadline</strong>: 30 June 2025 (6 months after period end)
            </p>
            <p class="mb-2">
                <strong>Prior Claim</strong>: For period 1 January 2022 – 31 December 2022, amended on 31 December 2024.
            </p>
            <p class="mb-2">
                <strong>Outcome</strong>: The prior claim is ignored (pre-1 April 2023 period, amended after 1 April 2023). No other valid claims exist in the 3-year lookback (1 July 2022 – 30 June 2025). A CNF is required by 30 June 2025.
            </p>
        </div>

        <div class="border-l-4 border-blue-500 bg-gray-50 p-4 mb-6 rounded-r-md">
            <h3 class="text-lg font-semibold mb-2">Example 2: CNF Not Required</h3>
            <p class="mb-2">
                <strong>Accounting Period</strong>: 1 January 2024 – 31 December 2024
            </p>
            <p class="mb-2">
                <strong>Claim Notification Deadline</strong>: 30 June 2025
            </p>
            <p class="mb-2">
                <strong>Prior Claims</strong>:
            </p>
            <ul class="list-disc pl-6 mb-2">
                <li>Period 1 January 2020 – 31 December 2020, amended 31 December 2022.</li>
                <li>Period 1 January 2021 – 31 December 2021, amended 31 December 2023.</li>
            </ul>
            <p class="mb-2">
                <strong>Outcome</strong>: The 2021 claim is ignored (pre-1 April 2023, amended after 1 April 2023). The 2020 claim is valid (amended before 1 April 2023, within 1 July 2022 – 30 June 2025). No CNF is required.
            </p>
        </div>

        <h2 class="text-xl font-semibold mb-4">Key Notes</h2>
        <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Ensure CNF details (UTR, period start/end) match the Company Tax Return to avoid rejection.</li>
            <li>Claims allowed under the exception are subject to HMRC's normal review process.</li>
        </ul>
    </section>
</div>

<style>
    /* Component-specific styles */
</style>