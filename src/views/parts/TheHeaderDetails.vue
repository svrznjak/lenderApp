<script setup lang="ts">
import backIcon from '@/assets/icons/back.svg'
</script>

<template>
  <div id="header-details">
    <img :src="backIcon" alt="+" style="height: 22px; width: 22px; margin-right: 20px; filter: brightness(100);" />
    <h1>
      <slot></slot>
    </h1>
  </div>
</template>

<style scoped>
#header-details {
  padding: 60px 30px 25px 30px;
  background-color: var(--primaryColor);
  color: #fff;
  display: flex;
  cursor: pointer;
}
</style>
