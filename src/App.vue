<script setup lang="ts">
import { Transition } from 'vue';
import { useI18n } from 'vue-i18n';
import { setLocale } from "@vee-validate/i18n";
import { useUserStore } from '@/stores/user';

const { locale } = useI18n();
const userStore = useUserStore();

function setLang() {
  console.log("🔥", "set lang");
  if (userStore.user !== undefined) {
    // userStore.user.language = "en";
    locale.value = userStore.user.language;
    setLocale(userStore.user.language);
  }

}


</script>

<template>
  <router-view @vnode-before-mount="setLang" @vnode-updated="setLang" v-slot="{ Component, route }">
    <!-- Use any custom transition and fallback to `fade` -->
    <Transition :name="route.meta.transition as string || 'fade'">
      <component :is="Component" />
    </Transition>
  </router-view>

</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}


.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
  position: absolute;
  height: 100%;
  width: 100%;
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s;
  position: absolute;
  height: 100%;
  width: 100%;
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(0%);
}

.slide-down-enter-active {}

.slide-down-leave-active {
  z-index: 8999;
  transition: all 0.5s;
  position: absolute;
  height: 100%;
  width: 100%;
}

.slide-down-enter-from {
  transform: translateY(0%);
}

.slide-down-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
  position: absolute;
  width: 100%;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.none-enter-active,
.none-leave-active {}

.none-enter-from {}

.none-leave-to {}
</style>
