<script setup lang="ts">
import { PropType } from 'vue';
import AppButton from '@/components/AppButton.vue';
import AppPopup from '@/components/AppPopup.vue';
import ContentContainer from '@/views/parts/ContentContainer.vue';

interface IOption {
  text: string,
  eventName: string,
}

const props = defineProps({
  isDisplayed: {
    type: Boolean,
    required: true,
  },
  options: {
    type: Array as PropType<IOption[]>,
    required: true,
  }
});

defineEmits<{
  (e: 'event', name: string): void
  (e: 'close'): void
}>()

</script>

<template>
  <AppPopup :is-open="props.isDisplayed" :has-close-button="true" @close="()=>$emit('close')">
    <div style="width:100%;">
      <ContentContainer>
        <AppButton v-for="option in props.options" @click="$emit('event', option.eventName)">{{option.text}}</AppButton>
      </ContentContainer>
    </div>
  </AppPopup>
</template>