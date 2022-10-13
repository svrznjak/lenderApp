<script setup lang="ts">

import closeIcon from '@/assets/icons/close_dark.svg';
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  hasCloseButton: {
    type: Boolean,
    default: false,
  }
})

defineEmits<{
  (e: 'close'): void
}>()

</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div id="background-dim" @click="$emit('close')" v-show="isOpen"></div>
    </Transition>
    <Transition name="slide">
      <div id="overlay" v-show="isOpen">
        <div v-if="hasCloseButton" @click="$emit('close')" style="position: absolute; top: 20px;right: 20px;">
          <img style="width: 20px; right: 50px;" :src="closeIcon" alt=">" />
        </div>
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
#overlay {
  position: fixed;
  z-index: 9901;
  bottom: 0px;
  left: 50%;
  padding-top: 40px;
  padding-bottom: 40px;
  transform: translateX(-50%);
  width: 90%;
  max-width: 500px;
  border-radius: 5px 5px 0 0;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.15);
  background-color: var(--backgroundColor);

  display: flex;
  justify-content: center;
  align-items: center;
}


#background-dim {
  position: fixed;
  z-index: 9900;
  bottom: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background-color: #000;
  opacity: 0.3;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}

.slide-enter-from {
  transform: translate(-50%, 100%) !important;
}

.slide-leave-to {
  transform: translate(-50%, 100%) !important;
}
</style>
