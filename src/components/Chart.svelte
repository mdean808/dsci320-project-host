<script lang="ts">
  import vegaEmbed from "vega-embed";
  import { onMount } from "svelte";

  interface Props {
    path: string;
  }

  let { path }: Props = $props();
  let container: HTMLDivElement | undefined;
  let bindingsContainer: HTMLDivElement | undefined;

  let loading = $state(true);
  let error = $state<string | null>(null);
  let htmlContent = $state<string | null>(null);
  let isHtml = $derived(path.endsWith(".html"));

  onMount(() => {
    if (!path) {
      loading = false;
      return;
    }

    if (isHtml) {
      // Fetch HTML content and use srcdoc to bypass X-Frame-Options
      fetch(path)
        .then((r) => {
          if (!r.ok) throw new Error(`Failed to load ${path}`);
          return r.text();
        })
        .then((html) => {
          htmlContent = html;
          loading = false;
        })
        .catch((err) => {
          error = err.message;
          loading = false;
        });
      return;
    }

    // Load JSON spec
    fetch(path)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${path}`);
        return r.json();
      })
      .then((spec) => {
        loading = false;
        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => {
          if (container) {
            vegaEmbed(container, spec, {
              actions: false,
              renderer: "canvas",
              bind: bindingsContainer || undefined,
            });
          }
        });
      })
      .catch((err) => {
        error = err.message;
        loading = false;
      });
  });

  function handleIframeLoad(e: Event) {
    const iframe = e.currentTarget as HTMLIFrameElement;
    try {
      const height = iframe.contentWindow?.document.body.scrollHeight;
      if (height) iframe.style.height = height + "px";
    } catch {
      // Cross-origin restriction, keep default height
    }
  }
</script>

{#if loading}
  <div class="h-52 flex items-center justify-center">
    <div class="w-52 h-1 bg-slate-200 rounded-full overflow-hidden relative">
      <div
        class="absolute top-0 left-0 h-full w-2/5 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full animate-loading-slide"
      ></div>
    </div>
  </div>
{:else if error}
  <div class="text-red-500 text-center py-8 px-4">
    <svg
      class="w-8 h-8 mx-auto mb-2 text-red-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <p class="font-medium">Failed to load visualization</p>
    <p class="text-sm text-red-400 mt-1">{error}</p>
  </div>
{:else if isHtml && htmlContent}
  <iframe
    srcdoc={htmlContent}
    title="Visualization"
    class="w-full min-h-[650px] border-0 block"
    sandbox="allow-scripts"
    onload={handleIframeLoad}
  ></iframe>
{:else}
  <!-- Controls container (at top) -->
  <div bind:this={bindingsContainer} class="vega-controls"></div>
  <!-- Chart container with horizontal scroll -->
  <div class="chart-wrapper">
    <div bind:this={container} class="chart-container"></div>
  </div>
{/if}

<style>
  .chart-wrapper {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .chart-container {
    width: max-content;
    min-width: 100%;
  }

  .vega-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
    border-radius: 0.75rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 6px -1px rgba(236, 72, 153, 0.2);
    align-items: center;
  }

  .vega-controls:empty {
    display: none;
  }

  /* Each control group */
  .vega-controls :global(.vega-bind) {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-left: 0.5rem;
  }

  /* First control doesn't need extra left margin */
  .vega-controls :global(.vega-bind:first-child) {
    margin-left: 0;
  }

  /* Control labels/titles */
  .vega-controls :global(.vega-bind-name) {
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
  }

  /* All text elements should be white */
  .vega-controls :global(label),
  .vega-controls :global(span) {
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }

  /* Select dropdowns */
  .vega-controls :global(select) {
    margin-left: 0.5rem;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.95);
    color: #1e293b;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.25rem;
  }

  .vega-controls :global(select option) {
    color: #1e293b;
    background: white;
  }

  .vega-controls :global(select:hover) {
    border-color: rgba(255, 255, 255, 0.6);
    background-color: white;
  }

  .vega-controls :global(select:focus) {
    outline: none;
    border-color: white;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }

  /* Checkboxes */
  .vega-controls :global(input[type="checkbox"]) {
    margin-left: 0.5rem;
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 0.375rem;
    background: transparent;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
    flex-shrink: 0;
  }

  .vega-controls :global(input[type="checkbox"]:hover) {
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  .vega-controls :global(input[type="checkbox"]:checked) {
    background: white;
    border-color: white;
  }

  .vega-controls :global(input[type="checkbox"]:checked::after) {
    content: "";
    position: absolute;
    left: 0.3rem;
    top: 0.1rem;
    width: 0.35rem;
    height: 0.6rem;
    border: solid #db2777;
    border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg);
  }

  .vega-controls :global(input[type="checkbox"]:focus) {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }

  /* Radio buttons */
  .vega-controls :global(input[type="radio"]) {
    appearance: none;
    width: 1.125rem;
    height: 1.125rem;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
    flex-shrink: 0;
  }

  .vega-controls :global(input[type="radio"]:hover) {
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  .vega-controls :global(input[type="radio"]:checked) {
    border-color: white;
    background: transparent;
  }

  .vega-controls :global(input[type="radio"]:checked::after) {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: white;
  }

  .vega-controls :global(input[type="radio"]:focus) {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }

  /* Range sliders */
  .vega-controls :global(input[type="range"]) {
    margin-left: 0.5rem;
    appearance: none;
    width: 140px;
    height: 0.5rem;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .vega-controls :global(input[type="range"]:hover) {
    background: rgba(255, 255, 255, 0.4);
  }

  .vega-controls :global(input[type="range"]:focus) {
    outline: none;
  }

  /* Webkit slider thumb */
  .vega-controls :global(input[type="range"]::-webkit-slider-thumb) {
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: white;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    cursor: grab;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .vega-controls :global(input[type="range"]::-webkit-slider-thumb:hover) {
    transform: scale(1.1);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  }

  .vega-controls :global(input[type="range"]::-webkit-slider-thumb:active) {
    cursor: grabbing;
    transform: scale(1.05);
  }

  /* Firefox slider thumb */
  .vega-controls :global(input[type="range"]::-moz-range-thumb) {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: white;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    cursor: grab;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .vega-controls :global(input[type="range"]::-moz-range-thumb:hover) {
    transform: scale(1.1);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  }

  /* Firefox track */
  .vega-controls :global(input[type="range"]::-moz-range-track) {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 0.25rem;
    height: 0.5rem;
  }

  /* Slider value display - Vega creates a span right after the range input */
  .vega-controls :global(.vega-bind input[type="range"] ~ span) {
    color: white;
    font-weight: 700;
    font-size: 0.9rem;
    min-width: 3rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.35rem 0.625rem;
    border-radius: 0.5rem;
    margin-left: 0.75rem;
    backdrop-filter: blur(4px);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  /* Radio button container styling */
  .vega-controls :global(.vega-bind-radio) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    margin-left: 0.5rem;
  }

  /* Individual radio option labels */
  .vega-controls :global(.vega-bind-radio label) {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: white;
    cursor: pointer;
    padding: 0.125rem 0.375rem;
    border-radius: 0.375rem;
    transition: background 0.15s ease;
  }

  .vega-controls :global(.vega-bind-radio label:hover) {
    background: rgba(255, 255, 255, 0.1);
  }

  .animate-loading-slide {
    animation: loadingSlide 1s ease-in-out infinite;
  }

  @keyframes loadingSlide {
    0% {
      left: -40%;
    }
    100% {
      left: 100%;
    }
  }
</style>
