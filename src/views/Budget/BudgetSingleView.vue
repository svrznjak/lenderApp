<script setup lang="ts">
import TheHeaderDetails from '@/views/parts/TheHeaderDetails.vue';
import { useUserStore } from '@/stores/user';
import router from '@/router';
import ContentContainer from '../parts/ContentContainer.vue';
import AppButton from '@/components/AppButton.vue';
import messages from './BudgetSingleView.i18n.json';
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import ScrollArea from '../parts/ScrollArea.vue';
import { useTransactionStore } from '@/stores/transaction';
import TransactionsList from '../parts/TransactionsList.vue';
import { useBudgetStore } from '@/stores/budget';
const { t, locale } = useI18n({
  messages
});
const userStore = useUserStore();
const budgetStore = useBudgetStore();
const transactionStore = useTransactionStore();
locale.value = userStore.user!.language;
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const currentBudget = ref(budgetStore.getBudgetById(props.id));
onMounted(async () => {
  //await budgetStore.syncBudget({ budgetId: props.id });
  await budgetStore.syncBudgets();
  currentBudget.value = budgetStore.getBudgetById(props.id);
});

type displayedScreenType = 'budget-info' | 'budget-transactions'

const displayedScreen = ref<displayedScreenType | undefined>(undefined);
const budgetInfoButtonStyle = ref('regular');
const budgetTransactionsButtonStyle = ref('empty');

if (router.currentRoute.value.query.tab === "transactions") {
  setDisplayedScreen("budget-transactions");
} else {
  setDisplayedScreen('budget-info');
}


function setDisplayedScreen(newValue: displayedScreenType): void {
  if (newValue === 'budget-info') {
    router.replace({ name: 'budget', params: { id: props.id }, query: { tab: "info" } })
    displayedScreen.value = 'budget-info';
    budgetInfoButtonStyle.value = 'regular';
    budgetTransactionsButtonStyle.value = 'empty';
  } else if (newValue === 'budget-transactions') {
    router.replace({ name: 'budget', params: { id: props.id }, query: { tab: "transactions" } })
    displayedScreen.value = 'budget-transactions';
    budgetInfoButtonStyle.value = 'empty';
    budgetTransactionsButtonStyle.value = 'regular';
    transactionStore.getBudgetTransactions({
      budgetId: props.id,
    })
  }
}

</script>

<template>
  <main>
    <TheHeaderDetails @click="router.back()">{{ currentBudget?.name || '' }}</TheHeaderDetails>
    <ScrollArea>
      <ContentContainer v-if="currentBudget !== undefined">
        <div>
          <AppButton class="custom-button" @click="setDisplayedScreen('budget-info')"
            style="width:50%; margin:0; border-radius: 5px 0 0 5px;" :styleType="budgetInfoButtonStyle"
            :disabled="displayedScreen === 'budget-info'">
            {{t('info')}}</AppButton>
          <AppButton class="custom-button" @click="setDisplayedScreen('budget-transactions')"
            style="width:50%; margin:0; border-radius: 0 5px 5px 0;" :styleType="budgetTransactionsButtonStyle"
            :disabled="displayedScreen === 'budget-transactions'">
            {{t('transactions')}}
          </AppButton>
        </div>
        <div id="budget-info" class="local-container" v-show="displayedScreen==='budget-info'">
          <ContentContainer>
            <p>{{currentBudget.description}}</p>

            <AppButton styleType="empty">{{t('edit-budget')}}</AppButton>
          </ContentContainer>

        </div>
        <div id="budget-transaction" class="local-container" v-if="displayedScreen==='budget-transactions'">
          <AppButton @click="router.push({name: 'budgetAddFunds', params:{id: props.id}})">
            {{t('add-funds-to-budget')}}</AppButton>
          <AppButton @click="router.push({name: 'budgetWithdrawFunds', params:{id: props.id}})">
            {{t('withdraw-funds-from-budget')}}</AppButton>
          <TransactionsList />
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