<script lang='ts'>
	import { Disc3, Eye, EyeClosed, AlertCircle, CheckCircle } from "@lucide/svelte";
  import { jwtToken, walletAddress } from "../../store/store";
  import { passwordUtils } from "$lib/helpers/securePasswordManager";
  import Dialog from "$lib/components/ui/dialog.svelte";
  import { askFlowId, sendSignature, signWithSolKey } from "$lib/modules/loginFunction";
  import { goto } from "$app/navigation";
  import { SecureStorage } from "$lib/helpers/secureStorage";
  import type { flowIdResponseType } from "../../types/types";
  import { handleAuthPageAccess } from '$lib/helpers/authGuard';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { debugWalletStorage } from '$lib/helpers/debugWallet';
	import { setJWTToken } from '../../store/store';

  let password = $state('')
  let showPassword = $state(false)
  let error = $state('')
  let address = $state('')
  let showStatus = $state(false)
  let showMessageModal = $state(false)
  let isAuthenticating = $state(false)
  let authStep = $state('') 
  let flowIdResponse = $state<flowIdResponseType | undefined>(undefined)
  let isCheckingAuth = $state(true)

  // Check if user should be redirected away from this auth page
  onMount(async () => {
    try {
      console.log('Sign-in page: Checking auth redirect...');
      await handleAuthPageAccess($page.url.pathname);
      console.log('Sign-in page: Auth check completed');
      
      // Debug wallet storage
      debugWalletStorage();
    } catch (error) {
      console.error('Sign-in page: Auth check failed:', error);
    } finally {
      isCheckingAuth = false;
    }
  });

  walletAddress.subscribe(value => address = value)

  // Restore wallet address from session storage on component mount
  $effect(() => {
    const restoreWalletAddress = async () => {
      try {
        console.log('Sign-in: Attempting to restore wallet address...');
        const restoredAddress = await import('../../store/store').then(m => m.getWalletAddress());
        if (restoredAddress && restoredAddress !== 'none') {
          address = restoredAddress;
          console.log('Sign-in: Wallet address restored successfully:', restoredAddress);
        } else {
          console.log('Sign-in: No wallet address found in storage');
          // Check if we can find any wallet-related data
          console.log('Sign-in: Checking for any wallet data in localStorage...');
          const keys = Object.keys(localStorage);
          const walletKeys = keys.filter(key => 
            key.toLowerCase().includes('wallet') || 
            key.toLowerCase().includes('address') ||
            key.toLowerCase().includes('private') ||
            key.toLowerCase().includes('public')
          );
          console.log('Sign-in: Found wallet-related keys:', walletKeys);
        }
      } catch (error) {
        console.error('Sign-in: Failed to restore wallet address:', error);
      }
    };
    
    restoreWalletAddress();
  });

  
  let canSubmit = $derived(password.length >= 6 && !isAuthenticating);

  
  async function handleSubmit(){
    if (password.length < 6){
      error = 'Password must be at least 6 characters'
      return;
    }

    try {
      isAuthenticating = true;
      authStep = 'Verifying password...';
      error = '';
      
      // First ensure we have a wallet address available
      const currentAddress = await import('../../store/store').then(m => m.getWalletAddress());
      if (!currentAddress || currentAddress === 'none') {
        error = 'Wallet session expired. Please refresh and try again.';
        isAuthenticating = false;
        authStep = '';
        return;
      }
      
      // Use the new secure authentication
      const authentication = await passwordUtils.authenticate(password);
      
      if (authentication.success){
        authStep = 'Password verified!';
        error = '';
        showStatus = false;
        
        // Add a brief delay to show success state
        setTimeout(async () => {
          authStep = 'Getting authentication challenge...';
          showMessageModal = true;
          
          try {
            flowIdResponse = await askFlowId();
            authStep = 'Ready to sign';
          } catch (err: unknown) {
            console.error('Flow ID error:', err);
            
            // Provide specific error messages
            const errorMessage = err instanceof Error ? err.message : String(err);
            if (errorMessage.includes('Wallet address not available')) {
              error = 'Wallet session expired. Please refresh and try again.';
            } else if (errorMessage.includes('Failed to get flow ID')) {
              error = 'Cannot connect to authentication server. Please check your internet connection.';
            } else {
              error = 'Failed to get authentication challenge. Please try again.';
            }
            
            showMessageModal = false;
          }
          
          isAuthenticating = false;
        }, 500);
        
      } else {
        error = authentication.error || 'Incorrect password';
        isAuthenticating = false;
        authStep = '';
      }
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      
      // Provide more specific error messages
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('decrypt')) {
        error = 'Incorrect password or corrupted wallet data.';
      } else {
        error = 'Authentication failed. Please try again.';
      }
      
      isAuthenticating = false;
      authStep = '';
    }
  }

  async function login() {
    try {
      authStep = 'Signing message...';
      
      // Check if flowIdResponse exists and has the required data
      if (!flowIdResponse?.payload?.eula) {
        error = 'Authentication data is missing. Please try again.';
        showMessageModal = false;
        return;
      }
      
      const signature = await signWithSolKey(flowIdResponse.payload.eula);
      
      if (!signature) {
        error = 'Failed to sign message. Please try again.';
        return;
      }
      
      authStep = 'Verifying signature...';
      
      const loginResponse = await sendSignature(
        flowIdResponse.payload.flowId, 
        address, 
        signature, 
        flowIdResponse.payload.eula
      );

      if (loginResponse.status === 200){
        // Store JWT token in Chrome storage (persistent until logout)
        await setJWTToken(loginResponse.payload.token);
        
        // Also store in SecureStorage for backward compatibility
        await SecureStorage.setSessionItem('jwt_token', loginResponse.payload.token);
        
        authStep = 'Login successful!';
        showStatus = true;
        
        setTimeout(() => {
          showStatus = false;
          goto('/');
        }, 1500);
      } else {
        error = loginResponse.message || 'Login failed. Please try again.';
        showMessageModal = false;
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      
      // Provide more specific error messages
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('Failed to get flow ID')) {
        error = 'Cannot connect to authentication server. Please check your internet connection.';
      } else if (errorMessage.includes('Authentication failed')) {
        error = 'Server authentication failed. Please try again.';
      } else if (errorMessage.includes('Private key not available')) {
        error = 'Session expired. Please refresh and sign in again.';
      } else if (errorMessage.includes('Failed to sign message')) {
        error = 'Message signing failed. Please try again.';
      } else if (errorMessage.includes('Unexpected end of JSON input')) {
        error = 'Server communication error. Please try again or contact support.';
      } else {
        error = 'Login failed. Please try again.';
      }
      
      showMessageModal = false;
      authStep = '';
    }
  }

  function handlePasswordInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      password = target.value;
      if (error && password.length > 0) {
        error = '';
      }
    }
  }

  // Handle Enter key press
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && canSubmit) {
      handleSubmit();
    }
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
  <h1 class="font-bold text-xl mb-6">Sign in to your account</h1>
  
  <div class="flex-1 flex flex-col justify-center space-y-4">
    <form class="relative flex flex-col justify-center text-sm space-y-2" onsubmit={handleSubmit}>
      <label class='text-left font-bold' for='password'>password</label>
      <div class="relative">
        <input 
          type={showPassword ? "text" : "password"} 
          class="bg-[#3b3b3bbd] border-none outline-[#00887d] rounded-lg py-2 px-4 w-full placeholder:text-white/80 pr-12" 
          placeholder="Enter your password" 
          bind:value={password}
          oninput={handlePasswordInput}
          onkeypress={handleKeyPress}
          disabled={isAuthenticating}
        />
        
        <!-- Password visibility toggle -->
        <button 
          type="button"
          class="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:bg-white/10 rounded p-1 transition-colors"  
          onclick={() => showPassword = !showPassword}
          disabled={isAuthenticating}
        >
          {#if showPassword}
            <Eye size='18' color='#ffffff8f' />
          {:else}
            <EyeClosed size='18' color='#ffffff8f' />
          {/if}
        </button>
      </div>
      
      <!-- Error message -->
      {#if error !== ''}
        <div class="flex items-center gap-2 text-red-400 text-left">
          <AlertCircle size='16' />
          <p class="text-sm">{error}</p>
        </div>
      {/if}
      
      <!-- Authentication status -->
      {#if isAuthenticating && authStep}
        <div class="flex items-center gap-2 text-[#00ccba] text-left">
          <Disc3 class='animate-spin' size='16' />
          <p class="text-sm">{authStep}</p>
        </div>
      {/if}
      
      <a href="/import-wallet" class='text-[#00ccba] text-left hover:underline transition-colors'>
        Forgot password?
      </a>
    </form>
  </div>
  
  <div class='space-y-4 mt-auto'>
    <a href="/create-new-wallet" class='text-[#00ccba] hover:underline transition-colors'>
      I don't have a wallet
    </a>
    <button 
      class="w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba] hover:from-[#0a7d72] hover:to-[#00b3a6] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
      onclick={handleSubmit}
      disabled={!canSubmit}
    >
      {#if isAuthenticating}
        <div class="flex items-center justify-center gap-2">
          <Disc3 class='animate-spin' size='18' />
          Authenticating...
        </div>
      {:else}
        Continue
      {/if}
    </button>
  </div>
</section>
{/if}
<!-- Success Dialog -->
<Dialog open={showStatus} onClose={() => showStatus = false}>
  <div class='bg-[#1012128f] rounded-lg p-6 grid space-y-4 text-center'>
    <h3 class='text-xl font-bold text-white'>Welcome Back!</h3>
    
    <div class="flex items-center justify-center">
      <CheckCircle size='48' class="text-[#00ccba]" />
    </div>
    
    <p class="text-white/80">Redirecting to your wallet...</p>
    
    <div class="flex items-center justify-center gap-2 text-[#00ccba]">
      <Disc3 class='animate-spin' size='16' />
      <span class="text-sm">Loading...</span>
    </div>
  </div>
</Dialog>

<!-- Message Signing Dialog -->
<Dialog open={showMessageModal} onClose={() => showMessageModal = false}> 
  <div class="bg-[#101212d7] rounded-lg p-8 text-center max-w-md mx-auto">
    <h3 class='text-xl font-bold text-white mb-4'>Sign Authentication Message</h3>
    
    {#if flowIdResponse}
      <div class="bg-[#2a2a2a] rounded-lg p-4 mb-6">
        <p class="text-sm text-white/90 break-words">{flowIdResponse?.payload?.eula}</p>
      </div>
      
      <p class="text-white/70 text-sm mb-6">
        This message proves you own this wallet address without revealing your private key.
      </p>
    {:else}
      <div class="flex items-center gap-4 justify-center py-8">
        <p class="text-white/80">Loading authentication message...</p>
        <Disc3 class='animate-spin text-[#00ccba]' size='20' />
      </div>
    {/if}
    
    <!-- Authentication step indicator -->
    {#if authStep && showMessageModal}
      <div class="flex items-center justify-center gap-2 text-[#00ccba] mb-4">
        <Disc3 class='animate-spin' size='16' />
        <span class="text-sm">{authStep}</span>
      </div>
    {/if}
    
    <div class="flex w-full justify-center items-center gap-4 mt-6">
      <button 
        class="flex-1 rounded-3xl py-2 cursor-pointer border border-[#0b8f84] text-[#00ccba] hover:bg-[#0b8f84]/10 transition-colors"
        onclick={() => {
          showMessageModal = false;
          authStep = '';
        }}
        disabled={authStep.includes('Signing') || authStep.includes('Verifying')}
      >
        Cancel
      </button>
      <button 
        class="flex-1 rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba] hover:from-[#0a7d72] hover:to-[#00b3a6] transition-all duration-200 disabled:opacity-50"
        onclick={login}
        disabled={!flowIdResponse || authStep.includes('Signing') || authStep.includes('Verifying')}
      >
        {#if authStep.includes('Signing') || authStep.includes('Verifying')}
          <div class="flex items-center justify-center gap-2">
            <Disc3 class='animate-spin' size='16' />
            Processing...
          </div>
        {:else}
          Sign & Continue
        {/if}
      </button>
    </div>
  </div>
</Dialog>
