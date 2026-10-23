<script>
    import { page } from "$app/state";
    import { get_votes } from "../remote";

</script>

<main>
    {#each await get_votes(page.params.id) as vote}
        <div>
            <b>{vote.user.username}</b>
            {#if vote.value}
                <p>För</p>
            {:else}
                <p>Emot</p>
            {/if}
        </div>
    {/each}
</main>