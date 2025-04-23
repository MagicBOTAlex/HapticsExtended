<script>
    import { onMount } from "svelte";
    import "../style.css";
    import Navbar from "./LayoutComps/Navbar.svelte";
    import { hapticManager, hapticSettings } from "@src/lib/stores";

    onMount(async ()=>{
        // Force loads the services
        let settings = hapticSettings;
        let manager = hapticManager;
        console.log(settings);
        console.log(manager);
    });
</script>

<main class="h-screen w-full flex flex-col">
    <Navbar />
    <slot />
</main>
