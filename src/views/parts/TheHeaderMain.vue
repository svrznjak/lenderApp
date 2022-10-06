<script setup lang="ts">

</script>

<template>
  <div id="header-main">
    <h1>
      <slot></slot>
    </h1>
  </div>
</template>

<style scoped>
#header-main {
  padding: 40px 20px;
  z-index: 100;
  background-color: var(--backgroundColor);
  border-bottom: 2px solid var(--borderColor);
}
</style>
