<!-- src/lib/components/TextInput.svelte -->
<script lang="ts">
    import type {Question, TextConfig} from "../lib/cnfCheckerLogic";

    let { data, inputId, onSubmit }: { 
        data: Question & { config: TextConfig }, 
        inputId: string,
        onSubmit: (value: string) => void 
    } = $props();
    let value = $state('');
    let attemptedSubmit = $state(false);

    function handleSubmit() {
        attemptedSubmit = true;
        if (data.config.pattern && !new RegExp(data.config.pattern).test(value)) {
            return;
        }
        onSubmit(value);
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
            onkeydown={(e) => e.key === 'Enter' && handleSubmit()}
            required
    />
    <p class="mt-1 text-sm text-gray-500">
        Press Enter to proceed to the next step
    </p>
    {#if attemptedSubmit && data.config.pattern && value && !new RegExp(data.config.pattern).test(value)}
        <p id={`error-${data.id}`} class="mt-1 text-sm text-red-600">
            Invalid input format.
        </p>
    {/if}
</div>
