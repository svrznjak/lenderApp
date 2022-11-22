<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: 'blue',
    validator(value: string) {
      return ['blue', 'green', 'yellow', 'red'].includes(value);
    }
  },
  isFullWidth: {
    type: Boolean,
    default: false,
  }
})
</script>

<template>
  <div class="info-badge" :class="[props.color, props.isFullWidth ? 'full-width' : '']">
    <slot></slot>
  </div>
</template>

<style scoped>
.info-badge {
  border-radius: 5px;
  font-weight: 500;
  padding: 5px 10px;
  text-align: center;
  width: fit-content;
}

.full-width {
  width: calc(100% - 20px);
}

.blue {
  background-color: #E1E5F2;
  color: #1826A3;
}

.yellow {
  background-color: #FF8A1E;
  color: #FFFFFF;
}

.red {
  background-color: #cf3434;
  color: #ffffff;
}
</style>