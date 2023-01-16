<script>
	import { walletAddress, jwtToken, mnemonicPhase, onboardingStepsLeft, setOnboardingStepsLeft, increaseOnboardingStepsLeft, decreaseOnboardingStepsLeft  } from '../../store/store';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	the wallet address is {$walletAddress}
	<button on:click={() => walletAddress.set('new wallet address')}>Change walletAddress</button>
</div>
<div>
	the jwt token is {$jwtToken}
	<button on:click={() => jwtToken.set('new jwt token')}>Change jwtToken</button>
</div>
<div>
	the mnemonic phase is {$mnemonicPhase}
	<button on:click={() => mnemonicPhase.set('new mnemonic phase')}>Change mnemonic</button>
</div>
<div>
	the onboarding steps left is {$onboardingStepsLeft}
	<button on:click={() => setOnboardingStepsLeft(100)}>Change onboardingStepsLeft</button>
	<button on:click={increaseOnboardingStepsLeft}>increase onboardingStepsLeft</button>
	<button on:click={decreaseOnboardingStepsLeft}>decrease onboardingStepsLeft</button>
</div>
