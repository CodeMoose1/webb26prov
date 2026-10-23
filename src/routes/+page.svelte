<script>
    import { create_motion, get_motions, vote_yes, vote_no } from "./remote";
    

</script>

<main>
    {#each await get_motions() as motion}
        {@const yes = vote_yes.for(motion.id)}
        {@const no = vote_no.for(motion.id)}
        
        <a href="/{motion.id}">{motion.text}</a>
        <div class="votes">
            <div class="vote_row">
                <form {...yes}>
                    <button>Ja</button>
                </form>
                <p>{motion.votes.filter((vote)=>vote.value).length}</p>
                
            </div>
            <div class="vote_row">
                <form {...no}>
                    <button>Nej</button>
                </form>
                <p>{motion.votes.filter((vote)=>!vote.value).length}</p>
                
            </div>

        </div>
    {/each}
</main>

<form {...create_motion}>
    <input {...create_motion.fields.text.as("text")}>
</form>

<style>
main{
    display: flex;
    flex-direction: column;
}
.vote_row{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.motion{
    display: flex;
    flex-direction: row;
}
</style>