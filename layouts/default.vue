<script setup lang="ts">
const colorMode = useColorMode();

useHead({
  titleTemplate: "%s - Count on it",
});
</script>

<template>
  <div
    class="bg-white px-2 dark:bg-zinc-800 min-h-screen text-zinc-800 dark:text-white transition"
  >
    <slot></slot>
    <div class="absolute -mx-2 px-2 bottom-0 flex w-screen">
      <div class="w-1/2">Count on it &copy; DanCodes 2020</div>
      <div class="text-right w-1/2">
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
</template>
<style>
html,
body {
  font-family: "Major Mono Display", monospace;
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
