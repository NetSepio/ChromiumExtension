<script>
    let { result, summary } = $props()
</script>

<div>
    <h3>summary</h3>
    {#if !result && !summary}
        <p>Generation in progress</p>
    {/if}
    {#if result === 'Insight generation in progress'}
        <!-- Display a message if insight generation is in progress -->
        <p>{result}</p>
    {:else}
        <!-- Display the summary if available -->
        <p>{summary}</p>
    {/if}
</div>