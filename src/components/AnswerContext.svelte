<!-- src/components/AnswerContext.svelte -->
<script lang="ts">
    import type { Period } from "../lib/cnfCheckerLogic";

    let { state, onQuestionClick = null }: { 
        state: Record<number, unknown>,
        onQuestionClick?: ((questionId: number) => void) | null
    } = $props();


    // Map of question IDs to their display names (shorter, more concise versions)
    const questionDisplayNames: Record<number, string> = {
        1: 'Use company number',
        2: 'Company number',
        3: 'Claim period',
        4: 'Period start date',
        5: 'Period end date',
        6: 'Previous claim rejected',
        7: 'Amended pre-2023 claim',
        8: 'Amendment date'
    };

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    function formatPeriod(period: Period): string {
        return `${formatDate(period.start)} to ${formatDate(period.end)}`;
    }

    function formatAnswer(answer: unknown): string {
        if (answer === null || answer === undefined) return 'Not answered';

        // Format based on question type
        if (typeof answer === 'boolean') {
            return answer ? 'Yes' : 'No';
        } else if (typeof answer === 'string') {
            // Check if it's a date string (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(answer)) {
                return formatDate(answer);
            }
            return answer;
        } else if (typeof answer === 'object' && 'start' in answer && 'end' in answer) {
            // It's a period
            return formatPeriod(answer as Period);
        }

        return String(answer);
    }

    function getCompanyNumber(): string | null {
        return state[1] as string || null;
    }

    function getCompanyName(): string | null {
        // Using placeholder name since we don't have direct access to the company profile
        return getCompanyNumber() ? 'Company Name Placeholder' : null;
    }

    function getPeriod(): Period | null {
        return state[2] as Period || null;
    }

    function getNotificationDeadline(): string | null {
        const period = getPeriod();
        if (!period) return null;

        // Calculate deadline (6 months after period end)
        const date = new Date(period.end);
        date.setMonth(date.getMonth() + 6);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

</script>

<div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded-r-md shadow-sm">
    <h3 class="text-sm font-semibold text-blue-800 mb-1">Questions and Answers:</h3>
    <div class="text-xs text-blue-700 space-y-1">
        {#if getCompanyName()}
            <div class="context-item">
                <span class="font-medium">Company name:</span> {getCompanyName()}
            </div>
        {/if}

        {#if getNotificationDeadline() && getPeriod()}
            <div class="context-item">
                <span class="font-medium">Notification deadline:</span> {formatDate(getNotificationDeadline()!)}
            </div>
        {/if}

        <!-- Display all questions and answers -->
        {#each Object.entries(state).sort(([a], [b]) => parseInt(a) - parseInt(b)) as [questionId, answer]}
            {#if questionDisplayNames[parseInt(questionId)]}
                {#if onQuestionClick}
                    <button 
                        type="button"
                        class="context-item clickable" 
                        onclick={() => onQuestionClick(parseInt(questionId))}
                        title={`Click to edit ${questionDisplayNames[parseInt(questionId)].toLowerCase()}`}
                    >
                        <span class="font-medium">{questionDisplayNames[parseInt(questionId)]}:</span> {formatAnswer(answer)}
                    </button>
                {:else}
                    <div class="context-item">
                        <span class="font-medium">{questionDisplayNames[parseInt(questionId)]}:</span> {formatAnswer( answer)}
                    </div>
                {/if}
            {/if}
        {/each}
    </div>
</div>

<style>
    .context-item {
        padding: 2px 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
        display: block;
        width: auto;
        text-align: left;
    }

    .clickable {
        cursor: pointer;
        position: relative;
    }

    .clickable:hover {
        background-color: rgba(59, 130, 246, 0.1);
        text-decoration: underline;
    }

    .clickable:focus {
        outline: 2px solid rgba(59, 130, 246, 0.5);
        outline-offset: 1px;
    }

    .clickable::after {
        content: "✏️";
        font-size: 0.8em;
        margin-left: 4px;
        opacity: 0.7;
    }
</style>
