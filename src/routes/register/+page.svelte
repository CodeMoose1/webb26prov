<script lang="ts">
    import { register } from "./remote";


</script>

<main>
    <form {...register}>
        <label for="username">Användarnamn</label>
        <input {...register.fields.username.as("text")} id="username">
        <label for="password">Lösenord</label>
        <input {...register.fields._password.as("password")} id="password">
        <button>Registrera</button>
    </form>
    <a href="/login">Logga in</a>
</main>