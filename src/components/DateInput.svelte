<!-- src/lib/components/DateInput.svelte -->
<script lang="ts">

    import type {DateConfig, Question} from "../lib/cnfCheckerLogic";

    let { data, inputId, onSubmit }: { 
        data: Question & { config: DateConfig }, 
        inputId: string,
        onSubmit: (value: string | null) => void 
    } = $props();
    let value: string | null = $state(null);
</script>

<div class="mb-6">
    <input
            type="date"
            id={inputId}
            bind:value
            class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            onchange={() => onSubmit(value)}
    />
</div>
