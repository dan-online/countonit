<script setup lang="ts">
import { Buffer } from "buffer";
import { usePermission, useRafFn, useWebNotification } from "@vueuse/core";
import { useShare } from "@vueuse/core";
import { create } from "canvas-confetti";
import { useWindowSize, useClipboard } from "@vueuse/core";

import RoundHomeIcon from "~icons/ic/round-home";
import RoundShareIcon from "~icons/ic/round-share";
import RoundCheckIcon from "~icons/ic/round-check";

const countdowns = useCookie<string[]>("countdowns", {
  default: () => [],
});

let confettied = false;

const copied = ref(false);
const canvas = ref<HTMLCanvasElement | null>(null);

const { share, isSupported: shareSupported } = useShare();
const { copy, isSupported: clipboardSupported } = useClipboard();
const { width, height } = useWindowSize();

const { params } = useRoute();
const encoded = params.encoded as string;

if (countdowns.value && !countdowns.value.find((x) => x == encoded)) {
  countdowns.value = [...countdowns.value, encoded];
}

const decoded = Buffer.from(encoded, "base64").toString("utf8");
const date = new Date();
date.setTime(parseFloat(decoded.split("_")[0]));
const title = decoded.split("_").slice(1).join("_");

onMounted(() => {
  const perm = usePermission("notifications");
  if (perm.value === "prompt") {
    const { show: showReqNotif } = useWebNotification({
      title: "Notifications enabled!",
      dir: "auto",
      lang: "en",
      renotify: true,
      tag: "reqNotif",
    });
    showReqNotif();
  }
});

const sharing = () => {
  if (shareSupported) {
    share({
      title: title + " | Count on it",
      url: location.href,
    });
  } else if (clipboardSupported) {
    copy(location.href);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  } else {
    alert("Shareand and clipboard is not supported");
  }
};

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

  const ago = distance < 0 ? 1 : 0;

  if (ago && !confettied && canvas.value) {
    const conf = create(canvas.value, {
      disableForReducedMotion: true,
      useWorker: true,
      resize: true,
    });
    conf({ particleCount: 100, spread: 150 });
    confettied = true;

    const {
      isSupported: notificationSupported,
      show,
      onClick: onNotificationClick,
    } = useWebNotification({
      title,
      dir: "auto",
      lang: "en",
      renotify: true,
      tag: "notif",
      icon: location.origin + "/favicon.ico",
    });
    onNotificationClick.on(() => {
      window.focus();
    });
    if (notificationSupported) show();
  }

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
    ago,
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
    <canvas :width="width" :height="height" ref="canvas"></canvas>
    <div class="container mx-auto text-center pt-[40vh]">
      <div class="text-2xl md:text-4xl lg:text-6xl">
        {{ title }}
      </div>
      <Transition mode="out-in" name="page">
        <div :key="timeLeft.ago">
          <ClientOnly>
            <div
              class="numbers text-4xl md:text-6xl lg:text-8xl"
              v-if="!timeLeft.ago"
            >
              {{ timeLeft.s }}
            </div>
            <div class="numbers text-4xl md:text-6xl lg:text-8xl" v-else>
              🎉
            </div>
          </ClientOnly>
        </div>
      </Transition>
      <div class="buttons flex space-x-2 justify-center mt-2">
        <nuxt-link
          to="/"
          class="border-2 border-zinc-600 rounded pl-5 pr-7 pt-2 pb-2.5"
        >
          <RoundHomeIcon class="inline-block align-middle mr-2"></RoundHomeIcon>
          <span class="inline-block align-middle">Home</span>
        </nuxt-link>
        <button
          @click="sharing"
          class="border-2 border-zinc-600 rounded pl-5 pr-7 pt-2 pb-2.5"
        >
          <RoundShareIcon
            v-if="!copied"
            class="inline-block align-middle mr-2"
          ></RoundShareIcon>
          <RoundCheckIcon
            class="inline-block align-middle mr-2"
            v-else
          ></RoundCheckIcon>
          <span class="inline-block align-middle">{{
            copied ? "Copied" : "Share"
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<style>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
</style>
