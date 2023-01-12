<script setup lang="ts">
import HeaderDetails from '@/views/parts/TheHeaderDetails.vue';
import { useUserStore } from '@/stores/user';
import router from '@/router';
import ContentContainer from '../parts/ContentContainer.vue';
import AppButton from '@/components/AppButton.vue';
import messages from './LoanSingleView.i18n.json';
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import AppTransactionCard from '@/components/AppTransactionCard.vue';
import ScrollArea from '../parts/ScrollArea.vue';
import { storeToRefs } from 'pinia';
import { useLoanStore } from '@/stores/loan';
import { useTransactionStore } from '@/stores/transaction';
import TransactionsList from '../parts/TransactionsList.vue';
const { t, locale } = useI18n({
  messages
});
const { user } = storeToRefs(useUserStore());
locale.value = user.value!.language;

const loanStore = useLoanStore();
const transactionStore = useTransactionStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const currentLoan = ref(loanStore.getLoanById(props.id));

onMounted(async () => {
  await loanStore.syncLoans();
  currentLoan.value = loanStore.getLoanById(props.id);
});

type displayedScreenType = 'loan-info' | 'loan-transactions'

const displayedScreen = ref<displayedScreenType | undefined>(undefined);
const loanInfoButtonStyle = ref('regular');
const loanTransactionsButtonStyle = ref('empty');

if (router.currentRoute.value.query.tab === "transactions") {
  setDisplayedScreen("loan-transactions");
} else {
  setDisplayedScreen('loan-info');
}

function setDisplayedScreen(newValue: displayedScreenType): void {
  if (newValue === 'loan-info') {
    router.replace({ name: 'loan', params: { id: props.id }, query: { tab: "info" } })
    displayedScreen.value = 'loan-info';
    loanInfoButtonStyle.value = 'regular';
    loanTransactionsButtonStyle.value = 'empty';
  } else if (newValue === 'loan-transactions') {
    router.replace({ name: 'loan', params: { id: props.id }, query: { tab: "transactions" } })
    displayedScreen.value = 'loan-transactions';
    loanInfoButtonStyle.value = 'empty';
    loanTransactionsButtonStyle.value = 'regular';
    transactionStore.getLoanTransactions({
      loanId: props.id,
    })
  }
}
</script>

<template>
  <main>
    <HeaderDetails @click="router.back()">{{ currentLoan?.name || '' }}</HeaderDetails>
    <ScrollArea>
      <ContentContainer v-if="currentLoan !== undefined">
        <div>
          <AppButton class="custom-button" @click="setDisplayedScreen('loan-info')"
            style="width:50%; margin:0; border-radius: 3px 0 0 3px;" :styleType="loanInfoButtonStyle">
            {{ t('info') }}</AppButton>
          <AppButton class="custom-button" @click="setDisplayedScreen('loan-transactions')"
            style="width:50%; margin:0; border-radius: 0 3px 3px 0;" :styleType="loanTransactionsButtonStyle">
            {{ t('transactions') }}
          </AppButton>
        </div>
        <div id="loan-info" class="local-container" v-show="displayedScreen === 'loan-info'">
          <p>{{ currentLoan.description }}</p>
          <AppButton styleType="empty">{{ t('edit-loan') }}</AppButton>
        </div>
        <div id="loan-transaction" class="local-container" v-if="displayedScreen === 'loan-transactions'">
          <AppButton @click="router.push({ name: 'loanAddPayment', params: { id: props.id } })">
            {{ t('add-loan-payment') }}</AppButton>
          <AppButton @click="router.push({ name: 'loanAddManualInterest', params: { id: props.id } })">
            {{ t('add-manual-interest') }}</AppButton>
          <TransactionsList displayAs="loan-transactions" />
        </div>
      </ContentContainer>
    </ScrollArea>
  </main>
</template>
<style scoped>
.local-container>* {
  margin-bottom: 20px;
}

button.regular.custom-button {
  &:hover {
    border-color: var(--primaryColor);
    background-color: var(--primaryColor);
  }
}
</style>