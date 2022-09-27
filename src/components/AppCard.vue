<script setup lang="ts">
import rightIcon from '@/assets/icons/right.svg';
defineProps({
  styleType: {
    type: String,
    default: 'regular',
    validator(value: string) {
      // The value must match one of these strings
      return ['regular', 'empty', 'clean'].includes(value)
    }
  },
})


</script>

<template >
  <div class="card">
    <div>
      <slot></slot>
    </div>
    <div style="display:flex; align-items: center;">
      <img style="width: 20px; position: absolute; right: 50px;" :src="rightIcon" alt=">" />
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