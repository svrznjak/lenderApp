<script setup lang="ts">
import rightIcon from "@/assets/icons/right.svg";
const props = defineProps({
  hasArrow: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="card">
    <div style="width: 100%">
      <slot></slot>
    </div>
    <div v-if="props.hasArrow" style="display: flex; align-items: center">
      <img style="width: 20px; right: 50px" :src="rightIcon" alt=">" />
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
}
</style>