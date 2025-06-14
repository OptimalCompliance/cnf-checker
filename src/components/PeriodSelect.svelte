<!-- src/lib/components/PeriodSelect.svelte -->
<script lang="ts">

    import type {Period, PeriodSelectConfig, Question} from "../lib/cnfCheckerLogic";

    let { data, inputId, onChange }: { 
        data: Question & { config: PeriodSelectConfig }, 
        inputId: string,
        onChange: (value: Period) => void 
    } = $props();
    let value = $state<Period | null>(null);
    let attempted = $state<boolean>(false);

    // Reset value when question changes
    $effect(() => {
        // Reference data.id directly to track question changes
        data.id;
        value = null;
        attempted = false;
    });

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    function handleSelect(period: Period) {
        attempted = true;
        value = period;
        if (value) {
            onChange(value);
        }
    }
</script>

<div class="mb-6">
    <div class="w-full">
        <div class="flex flex-wrap gap-4" id={inputId}>
            {#each data.config.options as period}
                <div 
                    role="button"
                    tabindex="0"
                    class="period-box flex-1 min-w-[150px] p-4 border rounded-md transition-colors duration-200 text-center"
                    class:selected={value === period}
                    onclick={() => handleSelect(period)}
                    onkeypress={(e) => e.key === 'Enter' && handleSelect(period)}
                    aria-pressed={value === period}
                >
                    <span class="block font-medium">
                        {formatDate(period.start)}
                    </span>
                    <span class="block mt-1">to</span>
                    <span class="block font-medium mt-1">
                        {formatDate(period.end)}
                    </span>
                </div>
            {/each}
        </div>
        {#if !value && attempted}
            <div class="text-sm text-red-500 mt-2">Please select a period</div>
        {/if}
    </div>
</div>

<style>
    .period-box {
        border-color: #9ca3af;
        border-width: 2px;
        color: #4b5563;
    }

    .period-box:hover {
        border-color: #3b82f6;
        color: #3b82f6;
    }

    .period-box:focus {
        border-color: #3b82f6;
        color: #3b82f6;
        outline: 2px solid rgba(59, 130, 246, 0.5);
        outline-offset: 2px;
    }

    .period-box.selected {
        border-color: #3b82f6;
        color: #3b82f6;
        background-color: rgba(59, 130, 246, 0.05);
    }
</style>
