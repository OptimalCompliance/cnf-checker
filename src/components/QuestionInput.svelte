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

    // State variable to hold the current input value
    let currentValue = $state<string | Period | boolean | null>(null);
    let isValueSet = $state(false);

    // Reset state when question changes
    $effect(() => {
        // Using data.id directly to detect question changes
        data.id; // Reference data.id to track it
        console.log(`Question changed to ID: ${data.id}`);
        currentValue = null;
        isValueSet = false;
    });

    // Handler for when input value changes
    function handleChange(value: string | Period | boolean | null) {
        currentValue = value;
        isValueSet = value !== null && (typeof value !== 'string' || value.trim() !== '');
    }

    // Handler for the Next button
    function handleNext() {
        if (isValueSet) {
            onSubmit(currentValue);
        }
    }

    // Generate a unique input ID based on the question type and ID
    const inputId = `${data.config.type}-${data.id}`;
</script>

<div class="w-full max-w-lg">
    <!-- Common label for all input types -->
    <label for={inputId} class="block text-2xl font-bold text-gray-900 mb-3">
        Step {data.counter}: {data.label}
    </label>

    {#if data.config.type === 'text'}
        <TextInput {data} {inputId} onChange={handleChange} />
    {:else if data.config.type === 'period-select'}
        <PeriodSelect {data} {inputId} onChange={handleChange} />
    {:else if data.config.type === 'date'}
        <DateInput {data} {inputId} onChange={handleChange} />
    {:else if data.config.type === 'boolean'}
        <BooleanInput {data} {inputId} onChange={handleChange} />
    {/if}

    <!-- Display hint as a helpful caption -->
    <p class="mt-2 text-sm text-gray-600 italic">
        {data.hint}
    </p>

    <!-- Debug display of current value -->
<!--    <div class="mt-3 p-2 bg-gray-100 rounded border border-gray-300">-->
<!--        <p class="text-sm font-mono">Debug - Current Value: {JSON.stringify(currentValue)} ({typeof currentValue})</p>-->
<!--    </div>-->

    <!-- Next button -->
    <button 
        type="button" 
        class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isValueSet}
        onclick={handleNext}
    >
        Next
    </button>
</div>
