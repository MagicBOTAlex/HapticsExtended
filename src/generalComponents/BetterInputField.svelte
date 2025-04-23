<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    export let value: string | number | undefined = undefined; // ① declare the prop
    export let placeholder: string = "";

    let inputField: HTMLInputElement;

    const dispatch = createEventDispatcher();

    // ② whenever the user types, update `value` and notify the parent
    function handleInput(e: Event) {
        const input = e.target as HTMLInputElement;
        if (inputField.type == "text") {
            value = input.value;
        }
        if (inputField.type == "number") {
            value = parseFloat(input.value);
        }
        dispatch("input", input.value);
    }

    // ③ explicitly forward keydown
    function handleKeydown(e: KeyboardEvent) {
        dispatch("keydown", e);
    }

    onMount(()=>{
        if (!value){
            if (inputField.type == "text") {
                value = "";
            }
            if (inputField.type == "number") {
                value = 0;
            }
        }
    });
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<div class="relative my-2 w-full">
    <input
        {...$$restProps}
        bind:value
        bind:this={inputField}
        placeholder=" "
        on:input={handleInput}
        on:keydown={handleKeydown}
        class="block w-full placeholder-transparent rounded px-2.5 pb-2.5 pt-5 text-sm
             text-base-content bg-gray-50 dark:bg-base-300 border-0 border-b-2
             border-gray-300 appearance-none
             dark:border-gray-600 dark:focus:border-base-primary
             focus:outline-none focus:ring-0 focus:border-primary peer"
    />
    <label
        class="absolute text-sm opacity-75 select-none pointer-events-none
             text-gray-500 dark:text-base-content duration-300 -translate-y-4 scale-75
             top-4 z-10 origin-[0] start-2.5 peer-focus:text-primary
             peer-focus:dark:text-base-content peer-placeholder-shown:scale-100
             peer-placeholder-shown:translate-y-0 peer-focus:scale-75
             peer-focus:-translate-y-4"
    >
        {placeholder}
    </label>
</div>
