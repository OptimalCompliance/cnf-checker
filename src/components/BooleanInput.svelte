<!-- src/lib/components/BooleanInput.svelte -->
<script lang="ts">

    import type {BooleanConfig, Question} from "../lib/cnfCheckerLogic";

    let { data, onSubmit }: { data: Question & { config: BooleanConfig }, onSubmit: (value: boolean) => void } = $props();
    let value = $state<boolean | null>(null);
</script>

<div class="mb-6">
    <label class="block text-lg font-medium text-gray-900 mb-2">{data.label}</label>
    <div class="flex space-x-6">
        <div class="flex items-center">
            <input
                    type="radio"
                    id={`true-${data.id}`}
                    name={`boolean-${data.id}`}
                    value="true"
                    bind:group={value}
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    on:change={() => value !== null && onSubmit(true)}
            />
            <label for={`true-${data.id}`} class="ml-2 text-gray-900">Yes</label>
        </div>
        <div class="flex items-center">
            <input
                    type="radio"
                    id={`false-${data.id}`}
                    name={`boolean-${data.id}`}
                    value="false"
                    bind:group={value}
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    on:change={() => value !== null && onSubmit(false)}
            />
            <label for={`false-${data.id}`} class="ml-2 text-gray-900">No</label>
        </div>
    </div>
</div>