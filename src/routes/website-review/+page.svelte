<script lang="ts">
	import VpnHeader from "$lib/components/ui/vpn-header.svelte";
    import {PUBLIC_GATEWAY_URL} from "$env/static/public";
    import Summary from "$lib/components/ui/summary.svelte";
    import Review from "$lib/components/ui/review.svelte";
    import {checkAuth} from "$lib/modules/storePassword";
    import {removeIpfsPrefix} from "$lib/helpers/removeIpfsPrefix";
    import type {ReviewType} from "../../types/types";
    import LoadingCircle from '@lucide/svelte'

    let currentUrl: string | undefined = $state('');
    let isLoading = $state(false);
    let urlWithoutProtocol = $derived(currentUrl.replace(/^https?:\/\//, ''));
    let currentTab = $state('summary')
    let summary = $state('');
    let result = $state('');
    let isUserAuthenticated = $state(false);
    let averageRating = $state(0);
    let reviews = $state<ReviewType[]>([]);

    // Asynchronous function to get the current URL
    async function getUrl(){
      isLoading = true;
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        currentUrl = tab.url?.toLocaleLowerCase();
      } catch (error) {
        console.log(error);
      } finally {
        isLoading = false;
      }
    }

    async function getSummary() {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(
        `${PUBLIC_GATEWAY_URL}/site-insight?siteUrl=${currentUrl}`,
        options
      );
      const data = await response.json();
      result = data.message;
      if (data.payload.insight) {
        summary = data.payload.insight;
      }
      return summary;
    }

    async function getReviews() {
      try {
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const response = await fetch(
          `${PUBLIC_GATEWAY_URL}/getreviews?page=1&domain=${urlWithoutProtocol}`,
          options
        );
        const result = await response.json();
        averageRating = result.payload.averageRating;
        const data = result.payload.reviews;

        if (data) {
          for (const meta of result.payload.reviews) {
            const response = await fetch(
              `https://nftstorage.link/ipfs/${removeIpfsPrefix(meta.metaDataUri)}`
            );
            const data = await response.json();

            reviews = [...reviews, data];
            // console.log(reviews);
          }
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }

    $effect(() => {
      (async () => {
        await getUrl();
        await getReviews();
        [isUserAuthenticated] = await checkAuth();
        setTimeout(await getSummary(), 30000)
      })();
    });
</script>

<section class="h-full pt-4 pb-8 px-8 bg-[#101212] text-white text-center capitalize relative text-sm">
  <VpnHeader wallet={false} />
  <h1 class="font-bold text-base">Reviews for</h1>
  <h2>{urlWithoutProtocol}</h2>
  <div class="py-4">
    <div class="flex p-1 rounded-lg gap-2 bg-[#3333338f]">
      <button onclick={() => currentTab = 'summary'} class={`cursor-pointer py-2 w-full rounded-lg ${currentTab === 'summary' ? 'bg-[#00ccba]' : 'bg-transparent'} text-white transition-colors duration-500`}>
        Summary
      </button>
      <button onclick={() => currentTab = 'reviews'} class={`cursor-pointer py-2 w-full rounded-lg ${currentTab === 'reviews' ? 'bg-[#00ccba]' : 'bg-transparent'} text-white transition-colors duration-500`}>Reviews</button>
    </div>
    {#if currentTab === 'summary'}
      <div class="w-full h-80 rounded-lg bg-[#3333338f] py-4 my-6">
       <Summary {result} {summary} />
      </div>
      {:else if currentTab === 'reviews'}
      <div>
        <Review {averageRating} {urlWithoutProtocol} {reviews} {isUserAuthenticated} />
      </div>
    {/if}
  </div>
</section>


<Dialog open={isLoading} onClose={() => isLoading = false }>
  <LoaderCircle />
</Dialog>