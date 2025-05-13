<!-- src/lib/components/PeriodSelect.svelte -->
<script lang="ts">

    import type {Period, PeriodSelectConfig, Question} from "../lib/cnfCheckerLogic";

    let { data, onSubmit }: { data:
            Question & { config: PeriodSelectConfig }, onSubmit: (value: Period) => void } = $props();
    let value = $state<Period | null>(null);

    function handleSubmit() {
        if (value) {
            onSubmit(value);
        }
    }

    function formatPeriod(period: Period) {
        return `${period.start} - ${period.end}`;
    }
</script>

<div class="mb-6">
    <label for={`period-${data.id}`} class="block text-lg font-medium text-gray-900 mb-2">
        {data.label}
    </label>
    <select
            id={`period-${data.id}`}
            bind:value
            class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            on:change={handleSubmit}
            required
    >
        <option value={null} disabled selected>Select a period</option>
        {#each data.config.options as period}
            <option value={period}>{formatPeriod(period)}</option>
        {/each}
    </select>
</div>