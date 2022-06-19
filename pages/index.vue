<script lang="ts" setup>
import { useRafFn } from "@vueuse/core";
import { Buffer } from "buffer";

useHead({
  title: "Home",
});

const getTime = () => {
  const d = new Date();
  return (
    d.toLocaleTimeString("us") +
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

watch([day, month, year], () => {
  const date = new Date(`${year.value}-${month.value}-${day.value}`);

  if (
    day.value.length === 0 ||
    month.value.length === 0 ||
    year.value.length === 0
  ) {
    return (validDate.value = 0);
  }

  if (
    date.toString() !== "Invalid Date" &&
    year.value.toString() == date.getFullYear().toString() &&
    month.value.toString() == (date.getMonth() + 1).toString() &&
    day.value.toString() == date.getDate().toString()
  ) {
    validDate.value = 1;
  } else {
    validDate.value = 2;
  }
});

watch([hour, minute, second], () => {
  const date = new Date(
    `${year.value}-${month.value}-${day.value} ${hour.value}:${minute.value}:${second.value}`
  );

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

const setPage = (p) => {
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
  const data = `${new Date(
    `${year.value}-${month.value}-${day.value} ${hour.value}:${minute.value}:${second.value}`
  ).getTime()}_${title.value}`;
  const encoded = Buffer.from(data).toString("base64");
  navigateTo("/" + encoded);
};

useRafFn(() => (date.value = getTime()));
</script>
<template>
  <div class="container mx-auto text-center pt-[40vh]">
    <div
      class="numbers text-4xl md:text-6xl lg:text-8xl align-middle inline-block fade-in-up"
    >
      {{ date }}
    </div>
    <div class="fade-in text-2xl md:text-4xl lg:text-6xl -mt-5">
      Count on it<span class="animate-pulse">.</span
      ><span class="animate-pulse delay-75">.</span
      ><span class="animate-pulse delay-150">.</span>
    </div>
    <div
      class="fade-in-last -mt-10 md:-mt-15 lg:-mt-20 text-xl md:w-1/2 mx-auto"
    >
      <Transition name="page" mode="out-in">
        <div :key="page">
          <div v-if="page === 0" class="flex space-x-4 justify-center">
            <div class="mt-2">
              <ic:baseline-calendar-month></ic:baseline-calendar-month>
            </div>
            <input
              v-model="day"
              min="1"
              max="31"
              type="number"
              placeholder="D"
              class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/4"
            />
            <input
              min="1"
              max="12"
              type="number"
              v-model="month"
              placeholder="M"
              class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/4"
            />
            <input
              min="0"
              type="number"
              v-model="year"
              placeholder="YYYY"
              class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/4"
            />
            <div
              :class="[
                'mt-2 transition',
                {
                  'opacity-0 cursor-not-allowed': validDate === 0,
                  'opacity-50 cursor-not-allowed': validDate === 2,
                  'opacity-100 cursor-pointer': validDate === 1,
                },
              ]"
              @click="setPage(1)"
            >
              <ic:outline-chevron-right></ic:outline-chevron-right>
            </div>
          </div>
          <div v-if="page === 1" class="flex space-x-4 justify-center">
            <div class="mt-2">
              <mdi:clock></mdi:clock>
            </div>
            <input
              v-model="hour"
              min="1"
              max="24"
              type="number"
              placeholder="H"
              class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/3"
            />
            <input
              type="number"
              min="0"
              max="59"
              v-model="minute"
              placeholder="M"
              class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/3"
            />
            <input
              min="0"
              max="59"
              type="number"
              v-model="second"
              placeholder="S"
              class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/3"
            />
            <div
              :class="[
                'mt-2 transition',
                {
                  'opacity-0 cursor-not-allowed': validTime === 0,
                  'opacity-50 cursor-not-allowed': validTime === 2,
                  'opacity-100 cursor-pointer': validTime === 1,
                },
              ]"
              @click="setPage(2)"
            >
              <ic:outline-chevron-right></ic:outline-chevron-right>
            </div>
          </div>
          <div v-if="page === 2" class="flex space-x-4 justify-center">
            <div class="mt-2">
              <ic:twotone-text-fields></ic:twotone-text-fields>
            </div>

            <input
              maxlength="100"
              type="text"
              v-model="title"
              placeholder="Title"
              class="bg-transparent outline-none border-2 focus:border-zinc-400 border-zinc-700 transition px-2 rounded w-1/3"
            />
            <div
              :class="[
                'mt-2 transition',
                {
                  'opacity-0 cursor-not-allowed': title.length === 0,
                  'opacity-100 cursor-pointer': title.length > 0,
                },
              ]"
              @click="finish()"
            >
              <ic:outline-chevron-right></ic:outline-chevron-right>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<style>
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
    opacity: 1;
  }
}

.fade-in-up {
  opacity: 0;
  position: relative;
  animation: fade-in-up 3s cubic-bezier(0.77, 0, 0.175, 1) 0.6s forwards;
}
.fade-in {
  opacity: 0;
  animation: fade-in 5s cubic-bezier(0.77, 0, 0.175, 1) 3s forwards;
}
.fade-in-last {
  opacity: 0;
  animation: fade-in-last 0.5s cubic-bezier(0.77, 0, 0.175, 1) 6s forwards;
}
</style>
