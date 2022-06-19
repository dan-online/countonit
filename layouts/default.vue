<script setup lang="ts">
useHead({
  titleTemplate: "%s - Count on it",
});
</script>

<template>
  <div
    class="bg-white px-2 dark:bg-zinc-800 min-h-screen text-zinc-800 dark:text-white"
  >
    <slot></slot>
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
