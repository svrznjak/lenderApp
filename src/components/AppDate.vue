<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const props = defineProps({
  timestamp: {
    type: Number,
    required: true,
  },
  locale: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true
  }
})
locale.value = props.locale;

</script>

<template >
  <span>
    <i18n-d :value="new Date(props.timestamp)" :format="{ locale:props.locale}">
    </i18n-d>
  </span>
</template>

<style scoped>
.amount {
  display: inherit;
}

.to {
  color: var(--greenColor);
}

.from {
  color: var(--redColor);
}
</style>