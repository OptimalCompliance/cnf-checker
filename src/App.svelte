<script lang="ts">
  import novelIcon from './assets/novel-icon.png'
  import CnfForm from "./components/CnfForm.svelte";
  import RulesExplainer from "./components/RulesExplainer.svelte";

  // Simple routing state
  let currentPage = $state('form'); // 'form' or 'rules'

  function navigateTo(page: string) {
    currentPage = page;
  }
</script>

<svelte:head>
  <title>CNF Requirement Checker</title>
  <meta name="description" content="Determine if your company needs to submit a Claim Notification Form for HMRC R&D tax relief." />
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
  <header class="text-center">
    <img
            src={novelIcon}
            alt="Novel"
            class="mx-auto mb-6 w-32 h-32 object-contain"
            aria-describedby="app-description"
    />
    <h1 class="text-4xl font-bold mb-4">CNF Requirement Checker</h1>
    <p id="app-description" class="text-lg max-w-md mx-auto">
      Determine if your company needs to submit a Claim Notification Form for HMRC R&D tax relief.
    </p>
  </header>

  {#if currentPage === 'form'}
    <CnfForm/>
  {:else if currentPage === 'rules'}
    <RulesExplainer/>
  {/if}

  <footer class="mt-8 text-center text-sm text-gray-600 p-4">
    {#if currentPage === 'form'}
      <p>Need more information? <button onclick={() => navigateTo('rules')} class="text-blue-600 hover:underline">View CNF Rules Explanation</button></p>
    {:else}
      <p><button onclick={() => navigateTo('form')} class="text-blue-600 hover:underline">← Back to CNF Checker</button></p>
    {/if}
  </footer>
</main>

<style>
  /* Custom styles for accessibility and readability */
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
</style>
