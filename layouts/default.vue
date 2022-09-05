<script setup lang="ts">
const colorMode = useColorMode();

useHead({
  titleTemplate: "%s - Count on it",
});
</script>

<template>
  <div>
    <div
      class="bg-white px-2 dark:bg-zinc-800 min-h-screen text-zinc-800 dark:text-white transition"
    >
      <div class="h-[96vh]">
        <slot></slot>
      </div>

      <div class="px-2 bottom-0 flex w-full">
        <div class="w-2/3">
          Count on it &copy; DanCodes {{ new Date().getFullYear() }}
        </div>
        <div class="text-right w-1/3">
          <div class="flex space-x-2 float-right">
            <a
              aria-label="Open Github page"
              target="_blank"
              href="https://github.com/dan-online/countonit"
            >
              <mdi:github></mdi:github>
            </a>
            <span
              aria-label="Light mode"
              class="cursor-pointer"
              v-if="colorMode.value === 'dark'"
              @click="colorMode.preference = 'light'"
            >
              <ic:outline-wb-sunny></ic:outline-wb-sunny>
            </span>
            <span
              aria-label="Dark mode"
              class="cursor-pointer"
              v-else
              @click="colorMode.preference = 'dark'"
            >
              <majesticons:moon></majesticons:moon>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
html,
body {
  font-family: "Roboto Mono", monospace;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>