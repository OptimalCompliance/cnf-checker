<!-- src/lib/components/TextInput.svelte -->
<script lang="ts">
    import type {Question, TextConfig} from "../lib/cnfCheckerLogic";

    let { data, onSubmit }: { data: Question & { config: TextConfig }, onSubmit: (value: string) => void } = $props();
    let value = $state('');

    function handleSubmit() {
        if (data.config.pattern && !new RegExp(data.config.pattern).test(value)) {
            return;
        }
        onSubmit(value);
    }
</script>

<div class="mb-6">
    <label for={`text-${data.id}`} class="block text-lg font-medium text-gray-900 mb-2">
        {data.label}
    </label>
    <input
            type="text"
            id={`text-${data.id}`}
            bind:value
            pattern={data.config.pattern}
            class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            aria-describedby={`error-${data.id}`}
            onkeydown={(e) => e.key === 'Enter' && handleSubmit()}
            required
    />
    {#if data.config.pattern && value && !new RegExp(data.config.pattern).test(value)}
        <p id={`error-${data.id}`} class="mt-1 text-sm text-red-600">
            Invalid input format.
        </p>
    {/if}
</div>