<script lang="ts">
    import { login } from "./remote";




</script>

<main>
    <form {...login}>
        <input {...login.fields.username.as("text")} placeholder="användarnamn">
        <input {...login.fields._password.as("password")} placeholder="lösenord">
        <button>Logga in</button>
    </form>
    {#if login.result?.error}
        <p>{login.result.error}</p>
    {/if}
</main>