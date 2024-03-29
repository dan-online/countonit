<script lang="ts" setup>
import { useRafFn } from "@vueuse/core";
import { Buffer } from "buffer";

import CalendarIcon from "~icons/ic/baseline-calendar-month";
import ChevronRightIcon from "~icons/ic/outline-chevron-right";
import ClockIcon from "~icons/mdi/clock";
import TextIcon from "~icons/ic/twotone-text-fields";

const countdowns = useCookie<string[]>("countdowns", {
  default: () => [],
});

useHead({
  title: "Home",
});

const getTime = () => {
  const d = new Date();
  return (
    d.toLocaleTimeString("en-UK") +
    ":" +
    d.getMilliseconds().toString().padStart(3, "0")
  );
};

const page = ref(0);

const day = ref("");
const month = ref("");
const year = ref("");
const hour = ref("");
const minute = ref("");
const second = ref("");
const title = ref("");

const validDate = ref(0);
const validTime = ref(0);

const getDate = () => {
  const d = new Date();
  d.setFullYear(parseInt(year.value));
  d.setMonth(parseInt(month.value) - 1);
  d.setDate(parseInt(day.value));
  return d;
};

const getFullDate = () => {
  const d = getDate();
  d.setHours(
    parseInt(hour.value),
    parseInt(minute.value),
    parseInt(second.value)
  );
  return d;
};

watch([day, month, year], () => {
  const date = getDate();

  if (
    day.value.length === 0 ||
    month.value.length === 0 ||
    year.value.length === 0
  ) {
    return (validDate.value = 0);
  }

  if (date.toString() !== "Invalid Date") {
    validDate.value = 1;
  } else {
    validDate.value = 2;
  }
});

watch([hour, minute, second], () => {
  const date = getFullDate();

  if (
    hour.value.length === 0 ||
    minute.value.length === 0 ||
    second.value.length === 0
  ) {
    return (validTime.value = 0);
  }
  if (
    date.toString() !== "Invalid Date" &&
    hour.value.toString() === date.getHours().toString() &&
    minute.value.toString() === date.getMinutes().toString() &&
    second.value.toString() === date.getSeconds().toString()
  ) {
    validTime.value = 1;
  } else {
    validTime.value = 2;
  }
});

const date = ref(getTime());

const setPage = (p: number) => {
  switch (page.value) {
    case 0:
      if (!validDate) return;
      break;
    case 1:
      if (!validTime) return;
      break;
    default:
      break;
  }
  page.value = p;
};

const finish = () => {
  if (title.value.length === 0) return;
  page.value = 4;
  const data = `${getFullDate().getTime()}_${title.value}`;
  const encoded = Buffer.from(data).toString("base64");

  navigateTo("/" + encoded);
};

useRafFn(() => (date.value = getTime()));

const decodedCountdowns = computed(() => {
  const decoded = countdowns.value!.map((c) => {
    const decoded = Buffer.from(c, "base64").toString("utf8");
    const date = new Date();
    date.setTime(parseFloat(decoded.split("_")[0]));
    const title = decoded.split("_")[1];
    return {
      original: c,
      date,
      title,
    };
  });
  return decoded.sort((b, a) => a.date.getTime() - b.date.getTime());
});
</script>
<template>
  <div>
    <div :class="[
      'container mx-auto text-center pt-[40vh]',
      { before: countdowns!.length > 0 },
    ]">
      <div class="numbers text-5xl md:text-6xl lg:text-8xl align-middle inline-block fade-in-up">
        {{ date }}
      </div>
      <div class="fade-in text-2xl md:text-4xl lg:text-6xl -mt-5">
        Count on it<span class="animate-pulse">.</span><span class="animate-pulse delay-75">.</span><span
          class="animate-pulse delay-150">.</span>
      </div>
      <div class="fade-in-last -mt-10 md:-mt-15 lg:-mt-20 text-xl md:w-1/2 mx-auto">
        <Transition name="page" mode="out-in">
          <div :key="page">
            <div v-if="page === 0" class="flex space-x-4 justify-center">
              <div class="mt-2">
                <CalendarIcon />
              </div>
              <input v-model="day" min="1" max="31" type="number" placeholder="D"
                class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/4" />
              <input min="1" max="12" type="number" v-model="month" placeholder="M"
                class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/4" />
              <input min="0" type="number" v-model="year" placeholder="YYYY"
                class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/4" />
              <div :class="[
                'mt-2 transition',
                {
                  'opacity-0 cursor-not-allowed': validDate === 0,
                  'opacity-50 cursor-not-allowed': validDate === 2,
                  'opacity-100 cursor-pointer': validDate === 1,
                },
              ]" @click="setPage(1)">
                <ChevronRightIcon />
              </div>
            </div>
            <div v-if="page === 1" class="flex space-x-4 justify-center">
              <div class="mt-2">
                <ClockIcon />
              </div>
              <input v-model="hour" min="1" max="24" type="number" placeholder="H"
                class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/3" />
              <input type="number" min="0" max="59" v-model="minute" placeholder="M"
                class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/3" />
              <input min="0" max="59" type="number" v-model="second" placeholder="S"
                class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/3" />
              <div :class="[
                'mt-2 transition',
                {
                  'opacity-0 cursor-not-allowed': validTime === 0,
                  'opacity-50 cursor-not-allowed': validTime === 2,
                  'opacity-100 cursor-pointer': validTime === 1,
                },
              ]" @click="setPage(2)">
                <ChevronRightIcon />
              </div>
            </div>
            <div v-if="page === 2" class="flex space-x-4 justify-center">
              <div class="mt-2">
                <TextIcon />
              </div>

              <input maxlength="100" type="text" v-model="title" placeholder="Title"
                class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/3" />
              <div :class="[
                'mt-2 transition',
                {
                  'opacity-0 cursor-not-allowed': title.length === 0,
                  'opacity-100 cursor-pointer': title.length > 0,
                },
              ]" @click="finish()">
                <ChevronRightIcon></ChevronRightIcon>
              </div>
            </div>
          </div>
        </Transition>
        <div class="max-h-90 md:max-h-100 overflow-y-scroll mt-5">
          <nuxt-link :class="[
            'border-b border-zinc-600 flex py-3 px-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 transition',
            { 'opacity-50': new Date().getTime() > c.date.getTime() },
          ]" :to="'/' + c.original" v-for="c in decodedCountdowns">
            <div class="w-1/2 text-left">
              {{ c.title }}
            </div>
            <div class="w-1/2 text-right">
              {{ c.date.toLocaleString("us") }}
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@keyframes fade-in-up {
  0% {
    transform: translateY(50px);
    opacity: 0;
  }

  50% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-50px);
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  40% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

@keyframes fade-in-last {
  0% {
    opacity: 0;
  }

  100% {
    pointer-events: all;
    opacity: 1;
  }
}

.before .fade-in-up {
  pointer-events: none;
  animation-duration: 2s !important;
}

.before .fade-in {
  opacity: 0 !important;
  animation: unset !important;
}

.before .fade-in-last {
  pointer-events: none;
  animation-delay: 2s !important;
}

.fade-in-up {
  opacity: 0;
  position: relative;
  will-change: transform, opacity;
  animation: fade-in-up 3s cubic-bezier(0.77, 0, 0.175, 1) 0.6s forwards;
}

.fade-in {
  opacity: 0;
  will-change: transform, opacity;
  animation: fade-in 5s cubic-bezier(0.77, 0, 0.175, 1) 3s forwards;
}

.fade-in-last {
  opacity: 0;
  will-change: transform, opacity;
  animation: fade-in-last 0.5s cubic-bezier(0.77, 0, 0.175, 1) 6s forwards;
}
</style>
