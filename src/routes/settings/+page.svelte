<script>
    import { HapticSettings } from "@src/lib/stores";
    import InstanceRoute from "./SettingsComp/InstanceRoute.svelte";
    // import { onMount } from "svelte";
    // onMount(async ()=>{
    //     console.log(HapticSettings);
    // })
</script>

<div class="h-full bg-grid-100 w-full overflow-y-scroll">
    <div class="grid grid-cols-1 grid-flow-row p-4 gap-4 w-full">
        {#each HapticSettings.routes as route}
        <InstanceRoute bind:route={route}/>
        {/each}
        <!-- {#each HapticSettings.routes as route}
        <InstanceRoute bind:route={route}/>
        {/each}
        {#each HapticSettings.routes as route}
        <InstanceRoute bind:route={route}/>
        {/each} -->

    </div>
</div>