<script>
    import { onMount } from "svelte";
    import "../style.css";
    import Navbar from "./LayoutComps/Navbar.svelte";
</script>

<main class="h-screen w-full grid">
    <Navbar />
    <slot />
</main>
