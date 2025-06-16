<script lang='ts'>
  import {browser} from '$app/environment';
	import { Eye, EyeClosed, Disc3, ArrowLeft, AlertCircle, CheckCircle, Shield } from "@lucide/svelte";
  import { askFlowId, sendSignature, signWithSolKey } from "$lib/modules/loginFunction"
  import { walletAddress, onboardingStepsLeft, jwtToken, getWalletAddress, setJWTToken } from "../../store/store";
  import Dialog from "$lib/components/ui/dialog.svelte";
	import { passwordUtils, SecurePasswordManager } from "$lib/helpers/securePasswordManager";
	import { setData } from "$lib/helpers/timeStamp";
	import { SecureStorage } from "$lib/helpers/secureStorage";
	import type { flowIdResponseType } from "../../types/types";
  import { handleAuthPageAccess } from '$lib/helpers/authGuard';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';


  let password = $state('')
  let confirmPassword = $state('')
  let showPassword = $state(false)
  let showConfirmPassword = $state(false)
  let error = $state('')
  let showMessageModal = $state(false)
  let showStatus = $state(false)
  let flowIdResponse = $state<flowIdResponseType | undefined>(undefined)
  let address = $state('')
  let isCreating = $state(false)
  let creationStep = $state('')
  let isCheckingAuth = $state(true)

  // Check if user should be redirected away from this auth page
  onMount(async () => {
    try {
      console.log('Create password page: Checking auth redirect...');
      await handleAuthPageAccess($page.url.pathname);
      console.log('Create password page: Auth check completed');
    } catch (error) {
      console.error('Create password page: Auth check failed:', error);
    } finally {
      isCheckingAuth = false;
    }
  });

  let passwordStrength = $derived(
    password 
      ? SecurePasswordManager.getPasswordStrength(password)
      : { score: 0, feedback: [] }
  );
  
  let strengthLabel = $derived(
    SecurePasswordManager.getPasswordStrengthLabel(passwordStrength.score)
  );
  let passwordsMatch = $derived(password && confirmPassword && password === confirmPassword);
  let isValidPassword = $derived(password.length >= 6 && passwordStrength.score >= 40);
  let canProceed = $derived(isValidPassword && passwordsMatch && !isCreating);

  // Get wallet address securely
  $effect(() => {
    getWalletAddress().then(addr => {
      if (addr) {
        address = addr;
      }
    });
  });

  // Use $derived for computed values to avoid infinite loops
  

  async function handleSubmit(){
    error = '';
    
    if (password.length < 6) {
      error = 'Password must be at least 6 characters long';
      return;
    }

    if (passwordStrength.score < 40) {
      error = 'Password is too weak. Please choose a stronger password.';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    try {
      isCreating = true;
      creationStep = 'Getting authentication challenge...';
      
      // Get flow ID first
      flowIdResponse = await askFlowId();
      
      if (flowIdResponse?.payload?.eula) {
        showMessageModal = true;
        creationStep = 'Ready to sign authentication message';
      } else {
        error = 'Failed to get authentication challenge. Please try again.';
        isCreating = false;
        creationStep = '';
      }
    } catch (err) {
      console.error('Error getting flow ID:', err);
      error = 'Failed to initialize authentication. Please try again.';
      isCreating = false;
      creationStep = '';
    }
  }

  async function handleSave() {
    try {
      creationStep = 'Securing wallet with password...';
      
      // Store password for wallet (mnemonic is already in store from create-new-wallet)
      const walletResult = await passwordUtils.storePassword(password);
      
      if (!walletResult.success) {
        error = walletResult.error || 'Failed to secure wallet';
        showMessageModal = false;
        isCreating = false;
        creationStep = '';
        return;
      }

      creationStep = 'Signing authentication message...';
      
      // Check if flowIdResponse exists and has the required data
      if (!flowIdResponse?.payload?.eula) {
        error = 'Authentication data is missing. Please try again.';
        showMessageModal = false;
        isCreating = false;
        creationStep = '';
        return;
      }
      
      // Sign the authentication message
      const signature = await signWithSolKey(flowIdResponse.payload.eula);
      
      if (!signature) {
        error = 'Failed to sign authentication message';
        showMessageModal = false;
        isCreating = false;
        creationStep = '';
        return;
      }

      creationStep = 'Completing authentication...';
      
      // Send signature for authentication
      const loginResponse = await sendSignature(
        flowIdResponse.payload.flowId, 
        address, 
        signature, 
        flowIdResponse.payload.eula
      );

      if (loginResponse.status === 200) {
        // Store JWT token in Chrome storage (persistent until logout)
        await setJWTToken(loginResponse.payload.token);
        
        // Also store in SecureStorage for backward compatibility
        await SecureStorage.setSessionItem('jwt_token', loginResponse.payload.token);
        
        setData('unlocked', 'true', 60);
        
        creationStep = 'Wallet created successfully!';
        showMessageModal = false;
        showStatus = true;
        onboardingStepsLeft.set(0);
        
        // Clear creation state
        isCreating = false;
        creationStep = '';
      } else {
        error = loginResponse.message || 'Authentication failed after wallet creation';
        showMessageModal = false;
        isCreating = false;
        creationStep = '';
      }

    } catch (err) {
      console.error('Error in handleSave:', err);
      error = 'Failed to create wallet. Please try again.';
      showMessageModal = false;
      isCreating = false;
      creationStep = '';
    }
  }

  // Handle password input changes
  function handlePasswordInput() {
    // Clear error when user starts typing
    if (error && password.length > 0) {
      error = '';
    }
  }

  function handleConfirmPasswordInput() {
    // Clear error when passwords match
    if (error && password === confirmPassword) {
      error = '';
    }
  }

  // Handle Enter key press
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && canProceed) {
      handleSubmit();
    }
  }

  // Get strength color for progress bar
  function getStrengthColor(score: number) {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#65a30d';
    if (score >= 40) return '#ca8a04';
    if (score >= 20) return '#dc2626';
    return '#991b1b';
  }
</script>

{#if isCheckingAuth}
<section class="h-full flex items-center justify-center bg-[#101212]">
  <div class="text-center space-y-4">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ccba] mx-auto"></div>
    <p class="text-white/70 text-sm">Checking authentication...</p>
  </div>
</section>
{:else}
<section class="h-[600px] overflow-y-auto p-8 bg-[#101212] text-white text-center capitalize relative flex flex-col">
  <button 
    class='absolute top-8 left-8 cursor-pointer hover:bg-white/10 rounded p-1 transition-colors' 
    onclick={() => {
      onboardingStepsLeft.set(0);
      if (browser) {
        history.back();
      }
    }}
    disabled={isCreating}
  >
    <ArrowLeft color='#00ccba' />
  </button>
  
  <h1 class="font-bold h-fit mb-4">Password</h1>
  
  <div class="space-y-2 mb-6">
    <h2 class="text-2xl font-bold">Set up your Password</h2>
    <p class="text-white/70 text-sm normal-case">
      Create a strong password to secure your wallet
    </p>
  </div>
  
  <div class="flex-1 flex flex-col space-y-4">
    <!-- Password Input -->
    <form class="relative grid space-y-2 text-sm" onsubmit={handleSubmit}>
      <label class='text-left font-bold' for='password'>Password</label>
      <div class="relative">
        <input 
          type={showPassword ? "text" : "password"} 
          class="bg-[#3b3b3bbd] border-none outline-[#00887d] rounded-lg py-2 px-4 pr-12 w-full placeholder:text-white/80" 
          placeholder="Enter your password" 
          bind:value={password}
          oninput={handlePasswordInput}
          onkeypress={handleKeyPress}
          disabled={isCreating}
        />
        <button 
          type="button"
          class="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:bg-white/10 rounded p-1 transition-colors"
          onclick={() => showPassword = !showPassword}
          disabled={isCreating}
        >
          {#if showPassword}
            <Eye size='18' color='#ffffff8f' />
          {:else}
            <EyeClosed size='18' color='#ffffff8f' />
          {/if}
        </button>
      </div>
      
      <!-- Password Strength Indicator -->
      {#if password}
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs text-white/70">Password Strength:</span>
            <span class="text-xs font-medium" style="color: {strengthLabel.color}">
              {strengthLabel.label} ({passwordStrength.score}/100)
            </span>
          </div>
          
          <!-- Progress bar -->
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-300"
              style="width: {passwordStrength.score}%; background-color: {getStrengthColor(passwordStrength.score)}"
            ></div>
          </div>
          
          <!-- Feedback -->
          {#if passwordStrength.feedback.length > 0}
            <div class="text-left">
              {#each passwordStrength.feedback.slice(0, 3) as feedback}
                <p class="text-xs text-white/60 normal-case">• {feedback}</p>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </form>

    <!-- Confirm Password Input -->
    <form class="relative grid space-y-2 text-sm">
      <label class='text-left font-bold' for="password">Confirm Password</label>
      <div class="relative">
        <input 
          type={showConfirmPassword ? "text" : "password"} 
          class="bg-[#3b3b3bbd] border-none outline-[#00887d] rounded-lg py-2 px-4 pr-12 w-full placeholder:text-white/80" 
          placeholder="Confirm your password" 
          bind:value={confirmPassword}
          oninput={handleConfirmPasswordInput}
          onkeypress={handleKeyPress}
          disabled={isCreating}
        />
        <button 
          type="button"
          class="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:bg-white/10 rounded p-1 transition-colors"
          onclick={() => showConfirmPassword = !showConfirmPassword}
          disabled={isCreating}
        >
          {#if showConfirmPassword}
            <Eye size='18' color='#ffffff8f' />
          {:else}
            <EyeClosed size='18' color='#ffffff8f' />
          {/if}
        </button>
      </div>
      
      <!-- Password match indicator -->
      {#if confirmPassword}
        <div class="flex items-center gap-2 text-left">
          {#if passwordsMatch}
            <CheckCircle size='16' class="text-green-400" />
            <span class="text-xs text-green-400">Passwords match</span>
          {:else}
            <AlertCircle size='16' class="text-red-400" />
            <span class="text-xs text-red-400">Passwords do not match</span>
          {/if}
        </div>
      {/if}
    </form>

    <!-- Error message -->
    {#if error !== ''}
      <div class="flex items-center gap-2 text-red-400 text-left">
        <AlertCircle size='16' />
        <p class="text-sm normal-case">{error}</p>
      </div>
    {/if}

    <!-- Creation status -->
    {#if isCreating && creationStep}
      <div class="flex items-center gap-2 text-[#00ccba] text-left">
        <Disc3 class='animate-spin' size='16' />
        <p class="text-sm normal-case">{creationStep}</p>
      </div>
    {/if}

    <!-- Security notice -->
    <div class="bg-[#2a2a2a] rounded-lg p-2 space-y-2">
      <div class="flex items-center gap-2 text-[#00ccba]">
        <Shield size='16' />
        <span class="text-sm font-medium">Security Notice</span>
      </div>
      <p class="text-xs text-white/70 normal-case text-left">
        Your password encrypts your wallet locally. We cannot recover it if lost. 
        Store it safely and never share it with anyone.
      </p>
    </div>
  </div>
  
  <div class="mt-auto">
    <button 
      class="w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba] hover:from-[#0a7d72] hover:to-[#00b3a6] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
      onclick={handleSubmit}
      disabled={!canProceed}
    >
      {#if isCreating}
        <div class="flex items-center justify-center gap-2">
          <Disc3 class='animate-spin' size='18' />
          Creating Wallet...
        </div>
      {:else}
        Continue
      {/if}
    </button>
  </div>
</section>
{/if}
<!-- Message Signing Dialog -->
<Dialog open={showMessageModal} onClose={() => showMessageModal = false}> 
  <div class="bg-[#101212d7] rounded-lg p-8 text-center max-w-md mx-auto">
    <h3 class='text-xl font-bold text-white mb-4'>Sign Authentication Message</h3>
    
    {#if flowIdResponse}
      <div class="bg-[#2a2a2a] rounded-lg p-4 mb-6">
        <p class="text-sm text-white/90 break-words">{flowIdResponse?.payload?.eula}</p>
      </div>
      
      <p class="text-white/70 text-sm mb-6 normal-case">
        This message proves you own this wallet address to complete the setup process.
      </p>
    {:else}
      <div class="flex items-center gap-4 justify-center py-8">
        <p class="text-white/80">Loading authentication message...</p>
        <Disc3 class='animate-spin text-[#00ccba]' size='20' />
      </div>
    {/if}
    
    <!-- Creation step indicator -->
    {#if creationStep && showMessageModal}
      <div class="flex items-center justify-center gap-2 text-[#00ccba] mb-4">
        <Disc3 class='animate-spin' size='16' />
        <span class="text-sm normal-case">{creationStep}</span>
      </div>
    {/if}
    
    <div class="flex w-full justify-center items-center gap-4 mt-6">
      <button 
        class="flex-1 rounded-3xl py-2 cursor-pointer border border-[#0b8f84] text-[#00ccba] hover:bg-[#0b8f84]/10 transition-colors"
        onclick={() => {
          showMessageModal = false;
          isCreating = false;
          creationStep = '';
        }}
        disabled={creationStep.includes('Securing') || creationStep.includes('Signing') || creationStep.includes('Completing')}
      >
        Cancel
      </button>
      <button 
        class="flex-1 rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba] hover:from-[#0a7d72] hover:to-[#00b3a6] transition-all duration-200 disabled:opacity-50"
        onclick={handleSave}
        disabled={!flowIdResponse || creationStep.includes('Securing') || creationStep.includes('Signing') || creationStep.includes('Completing')}
      >
        {#if creationStep.includes('Securing') || creationStep.includes('Signing') || creationStep.includes('Completing')}
          <div class="flex items-center justify-center gap-2">
            <Disc3 class='animate-spin' size='16' />
            Processing...
          </div>
        {:else}
          Create Wallet
        {/if}
      </button>
    </div>
  </div>
</Dialog>

<!-- Success Dialog -->
<Dialog open={showStatus} onClose={() => showStatus = false}>
  <div class="bg-[#101212d7] rounded-lg p-8 text-center w-full">
    {#if error !== ''}
      <h3 class='text-xl font-bold text-white'>Unable to Create Wallet</h3>
      <div class="flex items-center justify-center gap-2 text-red-400 my-4">
        <AlertCircle size='24' />
        <p class="text-sm normal-case">{error}</p>
      </div>
      <div class="flex w-full justify-center items-center gap-4 mt-8">
        <button 
          class="self-end w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" 
          onclick={() => showStatus = false}
        >
          Retry
        </button>
      </div>
    {:else}
      <h3 class='text-xl font-bold text-white'>Congratulations!</h3>
      
      <div class="flex items-center justify-center my-6">
        <CheckCircle size='48' class="text-[#00ccba]" />
      </div>
      
      <p class="text-white/80 mb-6 normal-case">
        Your secure wallet has been created successfully!
      </p>
        
      <div class="flex w-full justify-center items-center gap-4 mt-8 text-sm">
        <a 
          class="self-end w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba] hover:from-[#0a7d72] hover:to-[#00b3a6] transition-all duration-200" 
          href='/'
          onclick={() => showStatus = false}
        >
          Start Using Netsepio
        </a>
      </div>
    {/if}
  </div>
</Dialog>
