<!-- src/lib/components/BooleanInput.svelte -->
<script lang="ts">

    import type {BooleanConfig, Question} from "../lib/cnfCheckerLogic";

    let { data, inputId, onChange }: { 
        data: Question & { config: BooleanConfig }, 
        inputId: string,
        onChange: (value: boolean) => void 
    } = $props();
    let value = $state<boolean | null>(null);

    // Reset value when question changes
    $effect(() => {
        // Reference data.id directly to track question changes
        data.id;
        value = null;
    });

    // Generate IDs for the radio buttons based on the inputId
    const trueId = `${inputId}-true`;
    const falseId = `${inputId}-false`;
    const radioName = `${inputId}-radio`;

    // Handle value changes
    function handleChange() {
        if (value !== null) {
            // Ensure value is boolean type
            onChange(value === true);
        }
    }

    // Custom handler for bind:group to ensure boolean conversion
    function handleValueChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
            // Convert string value to boolean
            value = target.value === "true";
        }
    }

    // Handle keyboard navigation
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            const falseInput = document.getElementById(falseId) as HTMLInputElement;
            falseInput?.focus();
            falseInput.checked = true;
            value = false;
            handleChange();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            const trueInput = document.getElementById(trueId) as HTMLInputElement;
            trueInput?.focus();
            trueInput.checked = true;
            value = true;
            handleChange();
        }
    }
</script>

<div class="mb-6" role="radiogroup" aria-labelledby={`${inputId}-label`}>
    <div class="flex space-x-4">
        <!-- Visually hidden but focusable radio buttons with styled labels -->
        <div class="relative focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 rounded-md">
            <input
                type="radio"
                id={trueId}
                name={radioName}
                value="true"
                bind:group={value}
                class="absolute opacity-0 h-full w-full top-0 left-0 cursor-pointer z-10" 
                onchange={(e) => { handleValueChange(e); handleChange(); }}
                onkeydown={handleKeyDown}
            />
            <label 
                for={trueId} 
                class="px-4 py-2 rounded-md border cursor-pointer transition-colors duration-200 inline-block text-center min-w-[80px] pointer-events-none
                      {value === true ? 'bg-blue-200 text-gray-900 border-blue-400 font-medium' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}"
            >
                Yes
            </label>
        </div>

        <div class="relative focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 rounded-md">
            <input
                type="radio"
                id={falseId}
                name={radioName}
                value="false"
                bind:group={value}
                class="absolute opacity-0 h-full w-full top-0 left-0 cursor-pointer z-10" 
                onchange={(e) => { handleValueChange(e); handleChange(); }}
                onkeydown={handleKeyDown}
            />
            <label 
                for={falseId} 
                class="px-4 py-2 rounded-md border cursor-pointer transition-colors duration-200 inline-block text-center min-w-[80px] pointer-events-none
                      {value === false ? 'bg-blue-200 text-gray-900 border-blue-400 font-medium' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}"
            >
                No
            </label>
        </div>
    </div>
</div>
