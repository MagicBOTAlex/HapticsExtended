<script lang="ts">
    import BetterInputField from "@src/generalComponents/BetterInputField.svelte";
import DoubleSlider from "@src/generalComponents/DoubleSlider.svelte";
    import { Route } from "@src/lib/json/jsonTypes";
    import { X } from "lucide-svelte";
    
    export let route: Route;
</script>

<div class="p-2 m-0 rounded bg-base-200">
    <div class="flex w-full">
        <button class="p-2 cursor-pointer rounded bg-error flex justify-center items-center">
            <div>
                <X class="w-4 h-4"/>
            </div>
        </button>
        <div class="flex flex-col w-full">
            <BetterInputField type="text" placeholder="VRC param"/>
            <BetterInputField type="text" placeholder="Destination"/>
            <div class="doubleSliderContainers">
                <div>VRC In</div>
                <DoubleSlider/>
            </div>
            <div class="doubleSliderContainers">
                <div>Haptic strength</div>
                <DoubleSlider/>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .doubleSliderContainers{
        @apply flex flex-col;
    }
</style>