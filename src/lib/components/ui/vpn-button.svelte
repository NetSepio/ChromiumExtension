<script lang="ts">

</script>

<div
  class="rounded-full z-30 bg-[#ffffff5e] w-[200px] h-[200px] flex items-center justify-center"
>
  <div class="rounded-full bg-[#ffffff80] size-[75%] flex items-center justify-center relative vpn-loader">
    
    <div class="rounded-full bg-[#ffffff] size-[70%] flex items-center justify-center ">
      <svg
        width="60"
        height="66"
        viewBox="0 0 60 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M47.6805 18.0769C51.176 21.5435 53.5562 25.9598 54.5202 30.7673C55.4842 35.5749 54.9886 40.5579 53.0962 45.0863C51.2038 49.6147 47.9994 53.4851 43.8884 56.2082C39.7773 58.9312 34.9442 60.3846 30 60.3846C25.0558 60.3846 20.2226 58.9312 16.1116 56.2082C12.0005 53.4851 8.79623 49.6147 6.9038 45.0863C5.01137 40.5579 4.51581 35.5749 5.47978 30.7673C6.44375 25.9598 8.82396 21.5435 12.3195 18.0769"
          stroke="url(#paint0_linear_158_19320)"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M30.3848 5V32.6923"
          stroke="url(#paint1_linear_158_19320)"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_158_19320"
            x1="30"
            y1="18.0769"
            x2="30"
            y2="60.3846"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FFC700" />
            <stop offset="1" stop-color="#FF9900" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_158_19320"
            x1="30.8848"
            y1="5"
            x2="30.8848"
            y2="32.6923"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FFC700" />
            <stop offset="1" stop-color="#FF9900" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</div>



<style>
  .vpn-loader::before {
    content: '';
    position: absolute;
    
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      #ff2b2b 360deg
    );
    animation: rotate 1.5s linear infinite;
    z-index: 1;
  }
  /* @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  } */
</style>