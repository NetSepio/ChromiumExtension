<script>
    let { reviews, averageRating, isUserAuthenticated, urlWithoutProtocol } = $props();

    function openReviewPage() {
        window.open(`https://app.netsepio.com/reviews/${urlWithoutProtocol}`, '_blank')
    }

    function openSubmitPage() {
        window.open(
          `https://app.netsepio.com/dashboard?siteUrl=https://${urlWithoutProtocol}`,
          '_blank'
        );
    }
</script>

<div>
    <h3>reviews</h3>
    <!-- Ratings section -->
    <div>
        <div class="flex justify-between items-center mt-2">
            <h3 class="text-xl font-bold">Ratings</h3>
            <span class="text-xs">{Math.round(averageRating * 10)}% safe</span>
        </div>
        <div class="mt-4 h-2 w-full overflow-hidden rounded-lg bg-[#FFFFFF0D] dark:bg-#2F3A65 shadow-light"
        >
        <span
            style={`width: ${Math.round(averageRating * 10)}%`}
            class="h-8 block my-auto bg-[#11D9C5]"
        ></span>
        </div>
    </div>

    <!-- Reviews section -->
    <div class="my-4">
        <h3 class="text-xl font-bold">Reviews</h3>
        <div class="flex flex-col gap-4">
            {#each reviews.slice(0, 2) as review, index (review.id ?? index)}
                <div class="reviews">
                    <p>
                        {review.description}
                    </p>
                </div>
            {/each}
        </div>
    </div>

    <!-- Grid layout for displaying Review and SubmitReview components -->
    <div class="grid grid-cols-2 gap-x-2">
        <button onclick={openReviewPage}>read reviews</button>
        {#if isUserAuthenticated === false}
            <button onclick={openSubmitPage}>submit review</button>
        {:else}
            <a href="/submit-review"><button class="btn primary-button"> Submit Review </button></a>
        {/if}
    </div>
</div>