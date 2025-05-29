<!-- src/components/AnswerContext.svelte -->
<script lang="ts">
    import type { Period } from "../lib/cnfCheckerLogic";

    let { state, onQuestionClick = null }: { 
        state: Record<number, unknown>,
        onQuestionClick?: ((questionId: number) => void) | null
    } = $props();

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

    function getSubmissionDate(): string | null {
        return state[3] as string || null;
    }

    function getHasClaimed(): boolean | null {
        return typeof state[4] === 'boolean' ? state[4] as boolean : null;
    }

    function getRecentClaimDate(): string | null {
        return state[5] as string || null;
    }

    function getClaimRejected(): boolean | null {
        return typeof state[6] === 'boolean' ? state[6] as boolean : null;
    }

    function getAmendedClaim(): boolean | null {
        return typeof state[7] === 'boolean' ? state[7] as boolean : null;
    }

    function getAmendedDate(): string | null {
        return state[8] as string || null;
    }
</script>

<div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded-r-md shadow-sm">
    <h3 class="text-sm font-semibold text-blue-800 mb-1">Claim context:</h3>
    <div class="text-xs text-blue-700 space-y-1">
        {#if getCompanyName()}
            <div class="context-item">
                <span class="font-medium">Company name:</span> {getCompanyName()}
            </div>
        {/if}

        {#if getCompanyNumber()}
            <div 
                class="context-item {onQuestionClick ? 'clickable' : ''}" 
                on:click={() => onQuestionClick && onQuestionClick(1)}
                role={onQuestionClick ? 'button' : undefined}
                tabindex={onQuestionClick ? 0 : undefined}
                title={onQuestionClick ? 'Click to edit company number' : undefined}
            >
                <span class="font-medium">Company number:</span> {getCompanyNumber()}
            </div>
        {/if}

        {#if getPeriod()}
            <div 
                class="context-item {onQuestionClick ? 'clickable' : ''}" 
                on:click={() => onQuestionClick && onQuestionClick(2)}
                role={onQuestionClick ? 'button' : undefined}
                tabindex={onQuestionClick ? 0 : undefined}
                title={onQuestionClick ? 'Click to edit claim period' : undefined}
            >
                <span class="font-medium">Claim period:</span> {formatPeriod(getPeriod()!)}
            </div>
        {/if}

        {#if getNotificationDeadline() && getPeriod()}
            <div class="context-item">
                <span class="font-medium">Notification deadline:</span> {formatDate(getNotificationDeadline()!)}
            </div>
        {/if}

        {#if getSubmissionDate()}
            <div 
                class="context-item {onQuestionClick ? 'clickable' : ''}" 
                on:click={() => onQuestionClick && onQuestionClick(3)}
                role={onQuestionClick ? 'button' : undefined}
                tabindex={onQuestionClick ? 0 : undefined}
                title={onQuestionClick ? 'Click to edit submission date' : undefined}
            >
                <span class="font-medium">Submission date:</span> {formatDate(getSubmissionDate()!)}
            </div>
        {/if}

        {#if getHasClaimed() !== null}
            <div 
                class="context-item {onQuestionClick ? 'clickable' : ''}" 
                on:click={() => onQuestionClick && onQuestionClick(4)}
                role={onQuestionClick ? 'button' : undefined}
                tabindex={onQuestionClick ? 0 : undefined}
                title={onQuestionClick ? 'Click to edit previous R&D claims' : undefined}
            >
                <span class="font-medium">Previous R&D claims:</span> {getHasClaimed() ? 'Yes' : 'No'}
            </div>
        {/if}

        {#if getRecentClaimDate()}
            <div 
                class="context-item {onQuestionClick ? 'clickable' : ''}" 
                on:click={() => onQuestionClick && onQuestionClick(5)}
                role={onQuestionClick ? 'button' : undefined}
                tabindex={onQuestionClick ? 0 : undefined}
                title={onQuestionClick ? 'Click to edit most recent claim date' : undefined}
            >
                <span class="font-medium">Most recent claim:</span> {formatDate(getRecentClaimDate()!)}
            </div>
        {/if}

        {#if getClaimRejected() !== null}
            <div 
                class="context-item {onQuestionClick ? 'clickable' : ''}" 
                on:click={() => onQuestionClick && onQuestionClick(6)}
                role={onQuestionClick ? 'button' : undefined}
                tabindex={onQuestionClick ? 0 : undefined}
                title={onQuestionClick ? 'Click to edit previous claim rejected' : undefined}
            >
                <span class="font-medium">Previous claim rejected:</span> {getClaimRejected() ? 'Yes' : 'No'}
            </div>
        {/if}

        {#if getAmendedClaim() !== null}
            <div 
                class="context-item {onQuestionClick ? 'clickable' : ''}" 
                on:click={() => onQuestionClick && onQuestionClick(7)}
                role={onQuestionClick ? 'button' : undefined}
                tabindex={onQuestionClick ? 0 : undefined}
                title={onQuestionClick ? 'Click to edit amended pre-2023 claim' : undefined}
            >
                <span class="font-medium">Amended pre-2023 claim:</span> {getAmendedClaim() ? 'Yes' : 'No'}
            </div>
        {/if}

        {#if getAmendedDate()}
            <div 
                class="context-item {onQuestionClick ? 'clickable' : ''}" 
                on:click={() => onQuestionClick && onQuestionClick(8)}
                role={onQuestionClick ? 'button' : undefined}
                tabindex={onQuestionClick ? 0 : undefined}
                title={onQuestionClick ? 'Click to edit amendment date' : undefined}
            >
                <span class="font-medium">Amendment date:</span> {formatDate(getAmendedDate()!)}
            </div>
        {/if}
    </div>
</div>

<style>
    .context-item {
        padding: 2px 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
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