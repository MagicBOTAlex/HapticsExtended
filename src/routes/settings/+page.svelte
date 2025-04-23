<script lang="ts">
    import InstanceRoute from "./SettingsComp/InstanceRoute.svelte";
    import { Plus, Save } from "lucide-svelte";
    import { hapticManager, hapticSettings } from "@src/lib/stores";
    import { onMount } from "svelte";
    import { fly, scale, slide } from "svelte/transition";
    onMount(async ()=>{
        hapticManager.start();
    });

    let settingsHasChanged = false;
    function onSettingsChanged(){
        settingsHasChanged = true;
        console.log("Setting changed detected");
    }
</script>

<div class="h-full bg-grid-100 w-full overflow-y-auto relative">
    <div class="grid grid-cols-1 grid-flow-row p-4 gap-4 w-full">
        {#each $hapticSettings.Routes as balls, i}
            <InstanceRoute onChanged={onSettingsChanged} bind:route={hapticSettings.routes[i]} />
        {/each}
        <!-- {#each hapticSettings.routes as route}
        <InstanceRoute bind:route={route}/>
        {/each}
        {#each hapticSettings.routes as route}
        <InstanceRoute bind:route={route}/>
        {/each} -->
        
    </div>
    <div class="fixed flex z-10 bottom-0 left-0 m-2 rounded-lg backdrop-blur-md bg-base-100/30">
        <button class="btn btn-info btn-square m-2" on:click={(e)=>{
            hapticSettings.addRoute();
        }}><Plus /></button>
        {#if settingsHasChanged}
        <div transition:fly={{ x: -50, duration: 300 }}>
            <button class="btn btn-success btn-square m-2" on:click={() => {
                hapticSettings.save();
                settingsHasChanged = false;
                }}>
              <Save />
            </button>
        </div>
      {/if}
    </div>
</div>
