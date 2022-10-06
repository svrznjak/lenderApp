<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const props = defineProps({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    validator(value: string) {
      // The value must match one of these strings
      return ['to', 'from', undefined].includes(value)
    }
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
  <span :class="props.type">
    <span v-if="props.type === 'to'">+</span>
    <span v-if="props.type === 'from'">-</span>
    <i18n-n :value="props.amount" :format="{ key: 'currency', currency: props.currency, locale:props.locale}">
    </i18n-n>
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