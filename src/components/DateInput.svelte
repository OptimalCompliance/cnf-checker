<!-- src/lib/components/DateInput.svelte -->
<script lang="ts">

    import type {DateConfig, Question} from "../lib/cnfCheckerLogic";

    let { data, inputId, onChange }: { 
        data: Question & { config: DateConfig }, 
        inputId: string,
        onChange: (value: string | null) => void 
    } = $props();
    let value: string | null = $state(null);

    // Reset value when question changes
    $effect(() => {
        // Reference data.id directly to track question changes
        data.id;
        value = null;
    });

    function handleChange() {
        onChange(value);
    }
</script>

<div class="mb-6">
    <input
            type="date"
            id={inputId}
            bind:value
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            onchange={handleChange}
    />
</div>
