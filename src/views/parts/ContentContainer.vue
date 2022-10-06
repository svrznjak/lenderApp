<script setup lang="ts">
import { onMounted } from 'vue';

//onMounted(() => {
  //const container = document.getElementById("app-content-container");
  //container.style.height = window.innerHeight - 200 + "px";
//});
</script>

<template>
  <div id="app-content">
    <slot></slot>
  </div>
</template>

<style scoped>
#app-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: auto;
}

#app-content #app-content {
  padding: 0px;
}
</style>
