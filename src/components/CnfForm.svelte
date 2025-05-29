<!-- src/lib/components/CnfForm.svelte -->
<script lang="ts">
    import QuestionInput from './QuestionInput.svelte';
    import AnswerContext from './AnswerContext.svelte';
    import {createFormManager, type Period, type Question, type Result} from "../lib/cnfCheckerLogic";

    let manager = $state(createFormManager());
    let current = $state<Question | Result | null>(null);
    let currentState = $state<Record<number, unknown>>({});

    async function init() {
        current = await manager.start();
        currentState = manager.getCurrentState();
    }
    init();

    async function handleSubmit(value: string | Period | boolean | null) {
        current = await manager.next(value);
        currentState = manager.getCurrentState();
    }

    async function handleGoToQuestion(questionId: number) {
        current = await manager.goToQuestion(questionId);
        currentState = manager.getCurrentState();
    }
</script>

<div class="flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-4">
    <div class="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
        {#if current && 'label' in current}
            <form onsubmit={e=>{e.preventDefault();console.log('form submitted')}} >
                {#if Object.keys(currentState).length > 0}
                    <AnswerContext state={currentState} onQuestionClick={handleGoToQuestion} />
                {/if}
                <QuestionInput data={current} onSubmit={handleSubmit} />

            </form>
        {:else if current && 'kind' in current}
            {#if current.kind === 'success'}
                <div class="text-center" role="alert" aria-live="polite">
                    <h2 class="text-2xl font-bold mb-4">Result</h2>
                    {#if Object.keys(currentState).length > 0}
                        <div class="mb-4">
                            <AnswerContext state={currentState} onQuestionClick={handleGoToQuestion} />
                        </div>
                    {/if}
                    <p class="text-lg mb-2">
                        <strong>CNF Required:</strong> {current.cnf_required ? 'Yes' : 'No'}
                    </p>
                    {#if current.deadline}
                        <p class="text-lg mb-2">
                            <strong>Deadline:</strong> {current.deadline}
                        </p>
                    {/if}
                    <p class="text-lg">{current.reason}</p>
                </div>
            {:else}
                <div class="text-center text-red-600" role="alert" aria-live="polite">
                    <h2 class="text-2xl font-bold mb-4">Error</h2>
                    {#if Object.keys(currentState).length > 0}
                        <div class="mb-4">
                            <AnswerContext state={currentState} onQuestionClick={handleGoToQuestion} />
                        </div>
                    {/if}
                    <p class="text-lg">{current.error}</p>
                    <button
                            type="button"
                            onclick={init}
                            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    >
                        Try Again
                    </button>
                </div>
            {/if}
        {/if}
    </div>
</div>
