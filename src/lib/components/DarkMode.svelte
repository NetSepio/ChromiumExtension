<script lang="ts">
  import { browser } from '$app/environment';

  let darkMode = true;

  function handleSwitchDarkMode() {
      darkMode = !darkMode;

      localStorage.setItem('theme', darkMode ? 'dark' : 'light');

      darkMode
          ? document.documentElement.classList.add('dark')
          : document.documentElement.classList.remove('dark');
  }

  if (browser) {
      if (
          localStorage.theme === 'dark' ||
          (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
          document.documentElement.classList.add('dark');
          darkMode = true;
      } else {
          document.documentElement.classList.remove('dark');
          darkMode = false;
      }
  }
</script>

<button class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-200" on:click={handleSwitchDarkMode}>
    {#if darkMode == false}
        Dark Mode
    {:else if darkMode == true}
        Light Mode
    {/if}
</button>
