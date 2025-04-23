<script lang="ts">
    import InstanceRoute from "./SettingsComp/InstanceRoute.svelte";
    import { Plus } from "lucide-svelte";
    import { hapticManager, hapticSettings } from "@src/lib/stores";
    import { onMount } from "svelte";
    onMount(async ()=>{
        hapticManager.start();
    });
</script>

<div class="h-full bg-grid-100 w-full overflow-y-scroll relative">
    <div class="grid grid-cols-1 grid-flow-row p-4 gap-4 w-full">
        {#each hapticSettings.routes as route}
            <InstanceRoute bind:route />
        {/each}
        <!-- {#each HapticSettings.routes as route}
        <InstanceRoute bind:route={route}/>
        {/each}
        {#each HapticSettings.routes as route}
        <InstanceRoute bind:route={route}/>
        {/each} -->hapticSettings
    </div>
    <div class="sticky z-10 bottom-0 right-0">
        <button class="btn btn-success btn-square m-4"><Plus /></button>
    </div>
</div>
