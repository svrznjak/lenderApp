<script setup lang="ts">
import calendarIcon from '@/assets/icons/calendar.svg';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import AppCard from './AppCard.vue';
import AppCurrencyNumber from './AppCurrencyNumber.vue';
import AppOptionsSelectPopup from './AppOptionsSelectPopup.vue';
import messages from './AppTransactionCart.i18n.json';
import router from '@/router';
import { useTransactionStore } from '@/stores/transaction';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

const { t } = useI18n({
  messages
});

const transactionStore = useTransactionStore();
const props = defineProps({
  transactionId: {
    type: String,
    required: true,
  },
  dateTimestamp: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  from: {
    type: String,
  },
  additionalDescription: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    validator(value: string) {
      // The value must match one of these strings
      return ['to', 'from'].includes(value)
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

const date = computed(() => new Date(props.dateTimestamp).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }));

const isPopupDisplayed = ref(false);
async function openPopup() {
  isPopupDisplayed.value = true;
}
function closePopup() {
  isPopupDisplayed.value = false;
}

async function popupEvent(eventName: string) {
  console.log(eventName)
  switch (eventName) {
    case "editTransaction": { router.push({ name: "transactionEdit", params: { id: props.transactionId } }); break; }
    case "deleteTransaction": {
      const isDeleted = await transactionStore.deleteTransaction({ transactionId: props.transactionId });

      closePopup();
      break;
    }
  }
}

</script>

<template>
  <div>
    <AppCard :has-arrow="false" @click="openPopup">
      <div class="app-transaction-card-container">
        <div class="date-and-amount-section">
          <div v-if="props.dateTimestamp > -1" class="date">
            <img style="width: 15px; margin-right: 5px;" :src="calendarIcon" alt=">" />
            <h5>{{ date }}</h5>
          </div>
          <div class="amount">
            <h2>
              <AppCurrencyNumber :type="props.type" :amount="props.amount" :currency="props.currency"
                :locale="props.locale"></AppCurrencyNumber>
            </h2>
          </div>
        </div>
        <h2>{{ props.description }}</h2>
        <h4 v-if="props.additionalDescription">{{ props.additionalDescription }}</h4>
      </div>
    </AppCard>

    <AppOptionsSelectPopup :isDisplayed="isPopupDisplayed" :options="[
  { text: t('edit-transaction'), eventName: 'editTransaction' },
  { text: t('delete-transaction'), eventName: 'deleteTransaction' },
]" @event="(name) => popupEvent(name)" @close="() => isPopupDisplayed = false" />
  </div>
</template>

<style scoped>
.date {
  display: flex;
  align-items: center;
}

.amount {
  display: inherit;
}

.amount>h2.to {
  color: var(--greenColor);
}

.amount>h2.from {
  color: var(--redColor);
}

.date-and-amount-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-transaction-card-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
