<script setup lang="ts">

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})


</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div id="overlay" v-show="isOpen">
        <slot id="content"></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
#overlay {
  position: fixed;
  z-index: 9900;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background-color: var(--backgroundColor);

  display: flex;
  justify-content: center;
  align-items: center;
}

#content {
  max-width: 600px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
