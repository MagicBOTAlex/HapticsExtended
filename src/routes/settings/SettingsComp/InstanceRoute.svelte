<script lang="ts">
    import BetterInputField from "@src/generalComponents/BetterInputField.svelte";
    import DoubleSlider from "@src/generalComponents/DoubleSlider.svelte";
    import { Route } from "@src/lib/json/jsonTypes";
    import { hapticSettings } from "@src/lib/stores";
    import { MoveRight, X } from "lucide-svelte";
    import { onMount, tick } from "svelte";
    
    export let route: Route;
    export let onRouteDelete: (()=>void) | undefined = undefined;
    export let onChanged: (()=>void) | undefined = undefined;
</script>

<div class="p-2 m-0 rounded-lg bg-base-200">
    {#if route}
    <div class="flex flex-col w-full">
        <div class="flex flex-col w-full">
            <BetterInputField placeholder="VRC param" on:input={(e)=>{if (onChanged)onChanged();}} bind:value={route.src}/>
            <BetterInputField placeholder="Destination" on:input={(e)=>{if (onChanged)onChanged();}} bind:value={route.dest}/>
            <div class="flex justify-between">
                <div>
                    <div class="flex justify-between">VRC <MoveRight class="mx-auto"/> </div>
                    <div class="flex">
                        <BetterInputField placeholder="Min" type="number" min="0" max="1" step="0.1" on:input={(e)=>{if (onChanged)onChanged();}} bind:value={(route.mapping!.from.lower)}/>
                        <BetterInputField placeholder="Max" type="number" min="0" max="1" step="0.1" on:input={(e)=>{if (onChanged)onChanged();}} bind:value={(route.mapping!.from.upper)}/>
                    </div>
                </div>
                <div>
                    <div>Haptic strength</div>
                    <div class="flex">
                        <BetterInputField placeholder="Min" type="number" min="0" max="100" step="1" on:input={(e)=>{if (onChanged)onChanged();}} bind:value={(route.mapping!.to.lower)}/>
                        <BetterInputField placeholder="Max" type="number" min="0" max="100" step="1" on:input={(e)=>{if (onChanged)onChanged();}} bind:value={(route.mapping!.to.upper)}/>
                    </div>
                </div>
            </div>
        </div>
        <button class="p-2 btn bg-error flex justify-center items-center" on:click={async ()=> {
            hapticSettings.removeRoute(route);
            // console.log(onRouteDelete);
            if (onRouteDelete){
                onRouteDelete();
            }
        }}>
            <div>
                <X class="w-4 h-4"/>
            </div>
        </button>
    </div>
    {/if}
</div>

<style lang="postcss">
    .doubleSliderContainers{
        @apply flex flex-col;
    }
</style>