<script setup lang="ts">
import { Buffer } from "buffer";
import { useRafFn } from "@vueuse/core";

const { params } = useRoute();
const encoded = params.encoded;

const decoded = Buffer.from(encoded as string, "base64").toString("utf8");
const date = new Date();
date.setTime(parseFloat(decoded.split("_")[0]));
const title = decoded.split("_")[1];

const padNumber = (n: number, a = 2) => {
  return n.toString().padStart(a, "0");
};

const timeToGo = (date: Date) => {
  const distance = date.getTime() - new Date().getTime();

  const second = 1000;

  const minute = second * 60;

  const hour = minute * 60;

  const day = hour * 24;

  const daysLeft = Math.trunc(distance / day);

  const hoursLeft = Math.trunc((distance % day) / hour);

  const minutesLeft = Math.trunc((distance % hour) / minute);

  const secondsLeft = Math.trunc((distance % minute) / second);

  const msLeft = Math.trunc(distance % second);

  return {
    s:
      padNumber(daysLeft) +
      "d " +
      padNumber(hoursLeft) +
      "h " +
      padNumber(minutesLeft) +
      "m " +
      padNumber(secondsLeft) +
      "s " +
      (distance < 100 ? "000" : padNumber(msLeft, 3)) +
      "ms",
    ago: distance < 0 ? 1 : 0,
  };
};

const timeLeft = ref(timeToGo(date));

useRafFn(() => (timeLeft.value = timeToGo(date)));

useHead({
  title,
});
</script>
<template>
  <div>
    <div class="container mx-auto text-center pt-[40vh]">
      <div class="text-2xl md:text-4xl lg:text-6xl">
        {{ title }}
      </div>
      <Transition mode="out-in" name="page">
        <div :key="timeLeft.ago">
          <div
            class="numbers text-4xl md:text-6xl lg:text-8xl"
            v-if="!timeLeft.ago"
          >
            {{ timeLeft.s }}
          </div>
          <div class="numbers text-4xl md:text-6xl lg:text-8xl" v-else>🎉</div>
        </div>
      </Transition>
    </div>
  </div>
</template>
