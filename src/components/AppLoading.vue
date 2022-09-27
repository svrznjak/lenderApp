<script setup lang="ts">
import lottie from 'lottie-web';
import { onMounted } from 'vue';
const LoadingAnimationURL = new URL('../assets/loading.json', import.meta.url).href

onMounted(() => {
  lottie.loadAnimation({
    container: document.getElementById('lottie-container'), // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: LoadingAnimationURL // the path to the animation json
  });
});

</script>

<template>
  <div id="lottie-container"></div>
</template>

<style scoped>
#lottie-container {
  max-width: 200px;
  margin: auto;
}
</style>
