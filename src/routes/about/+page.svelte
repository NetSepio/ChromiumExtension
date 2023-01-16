<script>
	import { walletAddress, jwtToken, mnemonicPhase, onboardingStepsLeft } from '../../store/store';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	the wallet address is {$walletAddress}
	<button on:click={() => walletAddress.setWalletAddress('new wallet address')}
		>Change walletAddress</button
	>
</div>
<div>
	the wallet address is {$jwtToken}
	<button on:click={() => jwtToken.setJwtToken('new jwt token')}>Change jwtToken</button>
</div>
<div>
	the wallet address is {$mnemonicPhase}
	<button on:click={() => mnemonicPhase.setMnemonicPhase('new mnemonic phase')}
		>Change mnemonic</button
	>
</div>
<div>
	the onboardingStepsLeft is {$onboardingStepsLeft}
	<button on:click={() => onboardingStepsLeft.setOnboardingStepsLeft(100)}
		>Change onboardingStepsLeft</button
	>
	<button on:click={() => onboardingStepsLeft.increaseOnboardingStepsLeft()}
		>increase onboardingStepsLeft</button
	>
	<button on:click={() => onboardingStepsLeft.decreaseOnboardingStepsLeft()}
		>decrease onboardingStepsLeft</button
	>
</div>
