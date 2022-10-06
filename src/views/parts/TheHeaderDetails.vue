<script setup lang="ts">
import backIcon from '@/assets/icons/back.svg'
</script>

<template>
  <div id="header-details">
    <img :src="backIcon" alt="+" style="margin-right: 20px;" />
    <h1>
      <slot></slot>
    </h1>
  </div>
</template>

<style scoped>
#header-details {
  padding: 40px 20px;
  border-bottom: 2px solid var(--borderColor);
  display: flex;
  cursor: pointer;
}
</style>
