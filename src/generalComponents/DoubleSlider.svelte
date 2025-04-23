<script lang="ts">
    // numeric bounds and snap step
    export let min: number = 0;
    export let max: number = 100;
    export let step: number = 0.05;
  
    // the two output values
    export let leftValue: number = min;
    export let rightValue: number = max;
  
    // handles & slider refs
    let slider: HTMLElement;
    let leftHandle: HTMLElement;
    let body: HTMLElement;
  
    interface DragDetail { x: number; y: number; dx?: number; dy?: number }
  
    // clamp to [min,max]
    function clamp(v: number, lo: number, hi: number) {
      return v < lo ? lo : v > hi ? hi : v;
    }
  
    // snap a raw value to nearest step
    function snapValue(v: number) {
      const c = clamp(v, min, max);
      return Math.round(c / step) * step;
    }
  
    // compute ratios for positioning
    $: range = max - min;
    $: startRatio = range > 0 ? clamp((leftValue - min) / range, 0, 1) : 0;
    $: endRatio   = range > 0 ? clamp((rightValue - min) / range, 0, 1) : 1;
  
    // Svelte action for dragging
    function draggable(node: HTMLElement) {
      let x = 0, y = 0;
      function down(e: MouseEvent|TouchEvent) {
        const touch = e instanceof TouchEvent ? e.touches[0] : e;
        x = touch.clientX; y = touch.clientY;
        node.dispatchEvent(new CustomEvent<DragDetail>("dragstart", { detail: { x, y } }));
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        window.addEventListener("touchmove", move);
        window.addEventListener("touchend", up);
      }
      function move(e: MouseEvent|TouchEvent) {
        const touch = e instanceof TouchEvent ? e.changedTouches[0] : e;
        const dx = touch.clientX - x, dy = touch.clientY - y;
        x = touch.clientX; y = touch.clientY;
        node.dispatchEvent(new CustomEvent<DragDetail>("dragmove", { detail: { x, y, dx, dy } }));
      }
      function up(e: MouseEvent|TouchEvent) {
        const touch = e instanceof TouchEvent ? e.changedTouches[0] : e;
        x = touch.clientX; y = touch.clientY;
        node.dispatchEvent(new CustomEvent<DragDetail>("dragend",   { detail: { x, y } }));
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup",   up);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend",  up);
      }
      node.addEventListener("mousedown", down as EventListener);
      node.addEventListener("touchstart", down as EventListener);
      return { destroy() {
        node.removeEventListener("mousedown", down as EventListener);
        node.removeEventListener("touchstart", down as EventListener);
      }};
    }
  
    // dragging one handle
    function setHandlePosition(which: "start" | "end") {
      return (evt: CustomEvent<DragDetail>) => {
        const { left, right } = slider.getBoundingClientRect();
        const parentW = right - left;
        const rawRatio = (evt.detail.x - left) / parentW;
        const val = snapValue(min + clamp(rawRatio, 0, 1) * range);
        if (which === "start") {
          leftValue = Math.min(val, rightValue);
        } else {
          rightValue = Math.max(val, leftValue);
        }
      };
    }
  
    // dragging the blue body
    function setHandlesFromBody(evt: CustomEvent<DragDetail>) {
      const { left, right } = slider.getBoundingClientRect();
      const parentW = right - left;
      const bodyW = body.getBoundingClientRect().width;
  
      // new left-edge in px, clamped
      const rawPxStart = leftHandle.getBoundingClientRect().left + evt.detail.dx! - left;
      const pxStart = clamp(rawPxStart, 0, parentW - bodyW);
      const pxEnd   = pxStart + bodyW;
  
      const rawStartVal = min + (pxStart / parentW) * range;
      const rawEndVal   = min + (pxEnd   / parentW) * range;
  
      const a = snapValue(rawStartVal);
      const b = snapValue(rawEndVal);
      leftValue  = Math.min(a, b);
      rightValue = Math.max(a, b);
    }
  </script>
<!-- Source: https://svelte.dev/playground/75d34e46cbe64bb68b7c2ac2c61931ce?version=5.28.2#H4sIAAAAAAAACr1Y64_TOBD_V0xXR1No-liWQ2S3Kx0v8QEkBCdxp-1-cGOntS6No8TZppT87zd-Jm3abheOUwWbjMfz-M2MPZNNJ8FL2gk6b3gxiyn6jJM5RV9iRmjW6XciFtO8E9xsOmKdSjZJALrZ9EeaDvI7GgtJm-Gc7qOHPBE0ESCmc5WHGUvF9TSZCrZMeSaQ1qvUaq0oyvgSdQfD1ooR2b1sbG9v1Ex-Jhf8XK34KUvzrtwVU4FygTNxad9oQtQzWJkLlLCQogkiaHKNNpIMiiLkPSLo8WOgPppM0KiHMiqKLEFdbclUmHcyEPwdKynxzntqpZomV8Pa5eRqiVminL9ajK_f0zjm6CvPYvLoaggEtdDGY8YSEiij9SNYPNS8hN2hMMZ5Ppl2YjyjcT7tXGuT2muwtJHueUpUr7oaAsv93KCtydt4au7RODvtRmrTizscFzSfbG7G49sKDbeEXQ0tMBKkXKxjqtYl1YZB0FL4OGbzJEAhpBPNDPgpJoQl8wCN6dKQlrj0V4yIRYDOL0Zp6cjZnMH2EcKF4DZCU7EYWyUhj3kWoLMoekZHo8uGZgH5lEc8WwaoSFOahZDsZj2C_PZz9o0G6MKZoIgryuYLAZYZWUrbQOEbRCzLhR8uWEys9ijmGLhjGokWO-C8nzuTKhrsOhKbpse-4GkANqRlnZQKYyhO6VwnEFlBq_6BIj9Uh9slf4Tr-AGwkUm0TFFl6nfNuWBxrmuLlorHlS3U5mh3ATIUyGNX0RK_9zghMXWkGSdr96IRUq9RkYSCcSjdDM_nGBzwEk5oz2Is2W32yOe1ja7dt1B6PvIip4SvEo_egaNuuz48FG0goUUTOD-6ghfhQnnTbXCCS5IPPDH8kovmN6PbS8tS2YfScYUxgz9_OZb1zsrfbkX6NSAsT7EIF28li5fQFXpd5IIv9XtXoqAN6zcNI1RgFgcQqbKP1siZUfV6TvwKTia-GkAtKlkfWA4hp5nXXUpslvyOgswGWpJy6u4i3d5bpCfsVPj9sF6NfkIOKa4O54HUcHoeKAuPpEG4kBVF_jySDfrmIq2kQL7LXcfUyg9gWl_-H3llQnEwrfrgQV8auCe9jqBdpC2sf6UXOiV-rDYylRo_UR6HBZxQIXs3P6RIDgu4v04UvAeqW56b29slxQo4sLNxhh7caroyFyxCc5HxtbdVbUr-YWCPG3dcwCk2OoSq-gp3aZ5Tc4994jlTFG-1YOHCOWA8dBugFJqFoGt-oy7Evm4U4JadmAtwMKfiFS8S2Ty9VuXwmYbC6-0cGSnOYOmr7KZgqxbi1z1KgxGWP2KxGCxZ4ukHXHrSpIEukkFpNvbQsCm2Dy11H41rxfKwVI7qc3LPVWl7gbQRCN0GOMXw2keNMqgQtMd0nxBndNrXTUavJTVthetItPJ30Me8go5jOx42GqoxVXGQXck9UfipEJ4YQM1Wd00f4Ak4a8IhNYOWkLT8YkBVPZ3n7Uh9ao5fkxCk7BlTIAf6W5b6GqcdV8q3KhxauFX2VLP27Z-GmJ3t1ji7cysNt1m1Iq1wH5vLwC9umnTJ8taMlK3xrzkxEdUvmzFVdsgw67gJau9spac_sWAwRWla1RjfXDGaXTK5ph1LbWyVC-6aguMocL2vJfIksDf29zRTEXtDI1zE4jtch-mnjKd4jmXSg55NO--rWq-aMyb1u2yjI5haNjCOoCe63KrfGvWW6YnJrHtjSAQ1gTZ4nLDr3RF2FwN96O5FoU5MhwXBAvvq3JGgS8vqnf8lTvY09-zJ9mC8dqF4MBBbrgK-v9pR2SE8wE1gP-pk_d3AUJofDQb7K8sew-a7ACiyKbUwU_p5_aUAUMj8nMZwzAUo4Ykd9We8lJO--tww45n8tAQkswh4CupDCxlSuWmV4XR3LLdGpAYZGN9pDMDdWQWHrfvdGSenefTcMTS-TKhHkEc9OE19YLHn3wyH_8wzeYT79hMHPZe_pl8LDJ1JgFgCAUQj9CItwQ74z38O_51dYPnru2V_DNSR-Xf2MpQ_J00hk2HCihycMZZrIHQqtoHAs5zHhaD7nTS4jHZAGbUEBzgSNc7my0OAuqh7SggPmrPjUsuwcR0ea1uDtAf-iMjflnSFFAK1jKCzFzP5OxZiGV8TZQfC8AkyONy0S_xWY7M5JlMmXjN1KvRkuIVuKJN1G-Q93hFiXfvmw5lLywC9bIRKXkHuu54M9Ohe_Ns6nl3gcRQ5BEHQspEQ-z9x3cIbNB5youkEEYaGsPoXfOkf-QEXAAA= -->

<div class="double-range-container">
    <div class="slider" bind:this={slider}>
      <div
        class="body"
        bind:this={body}
        use:draggable
        on:dragmove|preventDefault|stopPropagation={setHandlesFromBody}
        style="left: {100 * startRatio}%; right: {100 * (1 - endRatio)}%;"
      ></div>
  
      <div
        class="handle"
        bind:this={leftHandle}
        use:draggable
        on:dragmove|preventDefault|stopPropagation={setHandlePosition("start")}
        style="left: {100 * startRatio}%"
      ></div>
  
      <div
        class="handle"
        use:draggable
        on:dragmove|preventDefault|stopPropagation={setHandlePosition("end")}
        style="left: {100 * endRatio}%"
      ></div>
    </div>
  </div>

<style>
    .double-range-container {
        width: 100%;
        height: 20px;
        user-select: none;
        box-sizing: border-box;
        white-space: nowrap;
    }
    .slider {
        position: relative;
        width: 100%;
        height: 6px;
        top: 50%;
        transform: translate(0, -50%);
        background-color: #e2e2e2;
        box-shadow:
            inset 0 7px 10px -5px #4a4a4a,
            inset 0 -1px 0px 0px #9c9c9c;
        border-radius: 1px;
    }
    .handle {
        position: absolute;
        top: 50%;
        width: 0;
        height: 0;
    }
    .handle:after {
        content: " ";
        box-sizing: border-box;
        position: absolute;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        background-color: #fdfdfd;
        border: 1px solid #7b7b7b;
        transform: translate(-50%, -50%);
    }
    .handle:active:after {
        background-color: #ddd;
        z-index: 9;
    }
    .body {
        position: absolute;
        top: 0;
        bottom: 0;
        background-color: #34a1ff;
    }
</style>
