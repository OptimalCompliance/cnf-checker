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

    // Generate a unique input ID based on the question type and ID
    const inputId = `${data.config.type}-${data.id}`;
</script>

<div class="w-full max-w-lg">
    <!-- Common label for all input types -->
    <label for={inputId} class="block text-2xl font-bold text-gray-900 mb-3">
        Step {data.counter}: {data.label}
    </label>

    {#if data.config.type === 'text'}
        <TextInput {data} {inputId} onSubmit={(value) => onSubmit(value)} />
    {:else if data.config.type === 'period-select'}
        <PeriodSelect {data} {inputId} onSubmit={(value: Period) => onSubmit(value)} />
    {:else if data.config.type === 'date'}
        <DateInput {data} {inputId} onSubmit={(value) => onSubmit(value)} />
    {:else if data.config.type === 'boolean'}
        <BooleanInput {data} {inputId} onSubmit={(value) => onSubmit(value)} />
    {/if}

    <!-- Display hint as a helpful caption -->
    <p class="mt-2 text-sm text-gray-600 italic">
        {data.hint}
    </p>
</div>
