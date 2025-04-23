<script>
    import { onMount } from "svelte";
    import "../style.css";
    import Navbar from "./LayoutComps/Navbar.svelte";
</script>

<div class="h-screen flex flex-col">
    <Navbar />

    <main class="flex-1 h-full w-full overflow-y-scroll">
        <slot />
    </main>
</div>
