<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStateStore } from '@/stores/appState.js';
const route = useRoute();

const props = defineProps({
  saveScrollTop: {
    type: Boolean,
    default: false,
  },
  heightPercentage: {
    type: Number,
    default: 100,
  }
})

const { getScrollTop, saveScrollTop } = useAppStateStore();

const thisScrollUrl = route.fullPath;
const thisScrollArea = ref<HTMLElement | null>(null);

onMounted(() => {
  recalculateScrollAreaHeight();
  if (props.saveScrollTop)
    thisScrollArea.value!.scrollTop = getScrollTop(thisScrollUrl);
});
onBeforeUnmount(() => {
  if (props.saveScrollTop)
    saveScrollTop(thisScrollUrl, thisScrollArea.value!.scrollTop)

})
onUnmounted(() => {
  window.removeEventListener("resize", recalculateScrollAreaHeight);
})

window.addEventListener("resize", recalculateScrollAreaHeight);

function recalculateScrollAreaHeight() {
  const scrollAreaElement = thisScrollArea.value;

  const siblings = getSiblings(scrollAreaElement!);

  let siblingsHeight = 0;
  siblings.forEach((sibling) => {
    // Manualy skip elements that are hidden from view
    if (sibling.id === "background-dim") return;
    if (sibling.id === "overlay") return;
    if (sibling.id === "drawer-bottom-menu") return;
    siblingsHeight += sibling.clientHeight;
  });
  let containerHeight = innerHeight * (props.heightPercentage / 100);
  scrollAreaElement!.style.height = `${containerHeight - siblingsHeight}px`;
}

let getSiblings = function (e: HTMLElement) {
  // for collecting siblings
  let siblings: any[] = [];
  // if no parent, return no sibling
  if (!e.parentNode) {
    return siblings;
  }
  // first child of the parent node
  let sibling = e.parentNode.firstChild;

  // collecting siblings
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== e) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
};
</script>

<template>
  <div id="scroll-area" ref="thisScrollArea">
    <slot></slot>
  </div>
</template>

<style scoped>
#scroll-area {
  overflow-y: scroll;
}
</style>
