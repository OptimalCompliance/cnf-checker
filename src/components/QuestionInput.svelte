<!-- src/lib/components/QuestionInput.svelte -->
<script lang="ts">
    import TextInput from './TextInput.svelte';
    import PeriodSelect from './PeriodSelect.svelte';
    import DateInput from './DateInput.svelte';
    import BooleanInput from './BooleanInput.svelte';
    import type {Period, Question} from "../lib/cnfCheckerLogic";

    let { data, onSubmit }: {
        data: Question;
        onSubmit: (value: string | Period | boolean | null) => void;
    } = $props();
</script>

<div class="w-full max-w-md">
    {#if data.config.type === 'text'}
        <TextInput {data} onSubmit={(value) => onSubmit(value)} />
    {:else if data.config.type === 'period-select'}
        <PeriodSelect {data} onSubmit={(value: Period) => onSubmit(value)} />
    {:else if data.config.type === 'date'}
        <DateInput {data} onSubmit={(value) => onSubmit(value)} />
    {:else if data.config.type === 'boolean'}
        <BooleanInput {data} onSubmit={(value) => onSubmit(value)} />
    {/if}
</div>