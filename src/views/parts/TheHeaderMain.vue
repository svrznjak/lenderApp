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
  padding: 60px 30px 25px 30px;
  z-index: 100;
  background-color: var(--primaryColor);
  color: #fff;
  width: 102%;
}
</style>
