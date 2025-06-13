<!-- src/lib/components/TextInput.svelte -->
<script lang="ts">
    import type {Question, TextConfig} from "../lib/cnfCheckerLogic";

    let { data, inputId, onChange }: { 
        data: Question & { config: TextConfig }, 
        inputId: string,
        onChange: (value: string) => void 
    } = $props();
    let value = $state('');

    // Reset value when question changes
    $effect(() => {
        // Reference data.id directly to track question changes
        data.id;
        value = '';
        attemptedValidation = false;
    });

    $effect(() => {
        value = value.trim();
        validateAndUpdate();
    });
    let attemptedValidation = $state(false);

    function validateAndUpdate() {
        attemptedValidation = true;
        if (!data.config.pattern || new RegExp(data.config.pattern).test(value)) {
            onChange(value);
        } else {
            onChange('');
        }
    }
</script>

<div class="mb-6">
    <input
            type="text"
            id={inputId}
            bind:value
            pattern={data.config.pattern}
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            aria-describedby={`error-${data.id}`}
            onchange={validateAndUpdate}
            oninput={validateAndUpdate}
            required
    />
    {#if attemptedValidation && data.config.pattern && value && !new RegExp(data.config.pattern).test(value)}
        <p id={`error-${data.id}`} class="mt-1 text-sm text-red-600">
            Invalid input format.
        </p>
    {/if}
</div>
