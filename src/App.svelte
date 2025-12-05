<script lang="ts">
  import Chart from "./components/Chart.svelte";
  import { onMount } from "svelte";

  let activeTab = $state("ea");
  let initialLoading = $state(true);
  let loadingProgress = $state(0);
  let showDashboard = $state(false);

  // CDN base URL for data files
  const CDN_BASE = import.meta.env.DEV ? "" : "/dsci320-project-host";
  // "https://cdn.jsdelivr.net/gh/mdean808/dsci320-project-host@e9e03f2b1f2f19542e8e44970623f30d3f8c09ac/data";

  // Tab configuration with view paths
  const tabs = [
    {
      id: "ea",
      name: "Euna Ao",
      theme: "Economy & The Environment",
      views: [
        {
          path: `${CDN_BASE}/specs/ea/view1.json`,
          title: "Interactive Map: GDP, CO₂ Emissions, and Trade CO₂",
          description:
            "Explore the relationship between GDP, total CO₂ emissions, and CO₂ from consumption across countries from 1920-2022. Click countries on the map to drill down into detailed comparisons.",
        },
        {
          path: `${CDN_BASE}/specs/ea/view2.json`,
          title: "Trade and CO₂ Explorer",
          description:
            "Analyze how trade CO₂ varies across different GDP levels and groupings. Compare countries by economic tiers, trade blocs, and regions to uncover patterns in trade-related emissions.",
        },
      ],
    },
    {
      id: "md",
      name: "Morgan Dean",
      theme: "Fossil Fuel Transitions & Economic Development",
      views: [
        {
          path: `${CDN_BASE}/specs/md/view1.json`,
          title: "CO₂ Emissions Multi-View Dashboard",
          description:
            "Examine how a country's energy mix (coal, gas, oil) relates to its economic development. The ternary plot reveals emission composition patterns across GDP levels and continents.",
        },
        {
          path: `${CDN_BASE}/specs/md/view2.json`,
          title: "Emission Transition Speed Dashboard",
          description:
            "Discover which regions are transitioning their emission profiles most rapidly. Compare fast vs slow transitioning countries and explore what patterns characterize energy transitions.",
        },
      ],
    },
    {
      id: "cl",
      name: "Celine Li",
      theme: "Land Use Change Emissions",
      views: [
        {
          path: `${CDN_BASE}/specs/cl/view1.json`,
          title: "Land Use Change CO₂ Emissions (1922-2022)",
          description:
            "Track how land use change emissions have varied across different regions over the last century. Identify top emitting countries and explore regional trends over time.",
        },
        {
          path: `${CDN_BASE}/specs/cl/view2.json`,
          title: "LUC Emissions: Total vs Proportion by Region",
          description:
            "Compare total land use change emissions with their proportion of overall CO₂ and greenhouse gas emissions. See how different regions contribute to global LUC emissions.",
        },
      ],
    },
    {
      id: "am",
      name: "Amanda Máximo",
      theme: "Methane, Climate Change & Unequal Progress",
      views: [
        {
          path: `${CDN_BASE}/specs/am/view1.json`,
          title: "Total vs Per-Capita Methane Emissions",
          description:
            "Compare the top 15 total methane emitters with the top 15 per-capita emitters. Large countries dominate total emissions, while small nations lead per-person output.",
        },
        {
          path: `${CDN_BASE}/specs/am/view2.json`,
          title: "Methane Change Explorer (1992-2022)",
          description:
            "Explore which countries have reduced or increased methane emissions over three decades. See how methane changes relate to overall greenhouse gas trajectories.",
        },
      ],
    },
  ];

  async function initialLoad() {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      if (loadingProgress < 90) {
        loadingProgress += Math.random() * 15;
      }
    }, 100);

    // Small delay for visual effect
    await new Promise((r) => setTimeout(r, 500));

    clearInterval(progressInterval);
    loadingProgress = 100;

    // Wait for progress bar to reach 100% visually
    await new Promise((r) => setTimeout(r, 300));
    initialLoading = false;

    // Slight delay before showing dashboard with animation
    await new Promise((r) => setTimeout(r, 50));
    showDashboard = true;
  }

  // Start loading on mount
  onMount(() => {
    initialLoad();
  });
</script>

{#if initialLoading}
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200"
  >
    <div class="text-center w-full max-w-md px-8">
      <h1 class="text-4xl font-bold text-slate-800 mb-8 animate-fade-in-up">
        Global Emissions Dashboard
      </h1>
      <div
        class="relative h-1.5 bg-black/10 rounded-full overflow-hidden animate-fade-in-up animation-delay-200"
      >
        <div
          class="h-full bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 rounded-full transition-all duration-150 ease-out shimmer"
          style="width: {Math.min(loadingProgress, 100)}%"
        ></div>
      </div>
      <p
        class="text-slate-500 mt-6 text-sm animate-fade-in-up animation-delay-400"
      >
        Loading visualizations...
      </p>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
    <div
      class="transition-all duration-500 ease-out"
      class:opacity-100={showDashboard}
      class:translate-y-0={showDashboard}
      class:opacity-0={!showDashboard}
      class:translate-y-5={!showDashboard}
    >
      <!-- Header -->
      <header
        class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50"
      >
        <div class="mx-auto px-3 sm:px-4 lg:px-6 py-4">
          <h1 class="text-2xl font-bold text-slate-800">
            Global Emissions Dashboard
          </h1>
          <p class="text-slate-600 mt-1">
            Team TheGirlyPops — Exploring CO₂ and Greenhouse Gas Trends
          </p>
          <p class="text-slate-500 text-sm mt-1">
            Please note that some visualizations may not appear equivalent to
            their notebooks due to difficulties converting the visualizations.
          </p>
        </div>
      </header>

      <!-- Tabs Navigation -->
      <nav class="bg-white/60 backdrop-blur-sm border-b border-slate-200">
        <div class="mx-auto px-3 sm:px-4 lg:px-6">
          <div class="flex gap-1 overflow-x-auto py-2">
            {#each tabs as tab}
              <button
                onclick={() => (activeTab = tab.id)}
                class="px-5 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  {activeTab === tab.id
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}"
              >
                {tab.name}
              </button>
            {/each}
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="mx-auto px-2 sm:px-4 lg:px-6 py-8">
        {#each tabs as tab}
          {#if activeTab === tab.id}
            <!-- Theme Header -->
            <div class="mb-8">
              <div
                class="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium mb-3"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                Theme
              </div>
              <h2 class="text-xl font-semibold text-slate-700">{tab.theme}</h2>
            </div>

            <!-- Views Grid -->
            <div class="space-y-8">
              {#each tab.views as view, i}
                <article
                  class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden"
                >
                  <!-- View Header -->
                  <div
                    class="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white"
                  >
                    <div class="flex items-start gap-4">
                      <div
                        class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-md"
                      >
                        {i + 1}
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-800">
                          {view.title}
                        </h3>
                        <p class="text-slate-500 text-sm mt-1 leading-relaxed">
                          {view.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <!-- Chart Container -->
                  <div
                    class="p-2 sm:p-4"
                    class:p-0={view.path.endsWith(".html")}
                  >
                    <Chart path={view.path} />
                  </div>
                </article>
              {/each}
            </div>
          {/if}
        {/each}
      </main>

      <!-- Footer -->
      <footer
        class="border-t border-slate-200 bg-white/60 backdrop-blur-sm mt-12"
      >
        <div
          class="mx-auto px-3 sm:px-4 lg:px-6 py-6 text-center text-slate-500 text-sm"
        >
          DSCI 320 Project — Euna Ao, Morgan Dean, Celine Li, Amanda Máximo
        </div>
      </footer>
    </div>
  </div>
{/if}

<style>
  /* Custom animations */
  .animate-fade-in-up {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animation-delay-200 {
    animation-delay: 0.2s;
  }

  .animation-delay-400 {
    animation-delay: 0.4s;
  }

  .shimmer::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
