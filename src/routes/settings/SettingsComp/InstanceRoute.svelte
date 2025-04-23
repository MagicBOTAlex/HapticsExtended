<script lang="ts">
    import BetterInputField from "@src/generalComponents/BetterInputField.svelte";
    import DoubleSlider from "@src/generalComponents/DoubleSlider.svelte";
    import { Route } from "@src/lib/json/jsonTypes";
    import { MoveRight, X } from "lucide-svelte";
    import { onMount, tick } from "svelte";
    
    export let route: Route;
</script>

<div class="p-2 m-0 rounded bg-base-200">
    <div class="flex flex-col w-full">
        <div class="flex flex-col w-full">
            <BetterInputField type="text" placeholder="VRC param" bind:value={route.src}/>
            <BetterInputField type="text" placeholder="Destination" bind:value={route.dest}/>
            <div class="flex justify-between">
                <div>
                    <div class="flex justify-between">VRC <MoveRight class="mx-auto"/> </div>
                    <div class="flex">
                        <BetterInputField type="text" placeholder="Min" bind:value={route.mapping!.from.lower}/>
                        <BetterInputField type="text" placeholder="Max" bind:value={route.mapping!.from.upper}/>
                    </div>
                </div>
                <div>
                    <div>Haptic strength</div>
                    <div class="flex">
                        <BetterInputField type="text" placeholder="Min" bind:value={route.mapping!.to.lower}/>
                        <BetterInputField type="text" placeholder="Max" bind:value={route.mapping!.to.upper}/>
                    </div>
                </div>
            </div>
        </div>
        <button class="p-2 btn bg-error flex justify-center items-center" on:click={async ()=> {
            
        }}>
            <div>
                <X class="w-4 h-4"/>
            </div>
        </button>
    </div>
</div>

<style lang="postcss">
    .doubleSliderContainers{
        @apply flex flex-col;
    }
</style>