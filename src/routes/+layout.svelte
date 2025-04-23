<script>
    import { onMount } from "svelte";
    import "../style.css";
    import Navbar from "./LayoutComps/Navbar.svelte";
</script>

<Navbar style="height: 15vh;"/>
<div class="w-full grid drawer-end lg:drawer-open max-xl:h-[84vh] overflow-hidden">
    <input id="SideDrawer" type="checkbox" class="drawer-toggle w-0" />
    <div class="drawer-content flex flex-col items-center justify-center w-full h-full">
        <!-- Page content here -->

        <main class="w-full h-full">
            <slot />
        </main>

    </div>
</div>

