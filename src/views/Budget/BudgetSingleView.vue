<script setup lang="ts">
import TheHeaderDetails from '@/views/parts/TheHeaderDetails.vue';
import { useUserStore } from '@/stores/user';
import router from '@/router';
import ContentContainer from '../parts/ContentContainer.vue';
import AppButton from '@/components/AppButton.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppPopup from '@/components/AppPopup.vue'
import messages from './BudgetSingleView.i18n.json';
import { useI18n } from 'vue-i18n';
import { onMounted, reactive, ref } from 'vue';
import ScrollArea from '../parts/ScrollArea.vue';
import { useTransactionStore } from '@/stores/transaction';
import TransactionsList from '../parts/TransactionsList.vue';
import { useBudgetStore } from '@/stores/budget';
const { t } = useI18n({
  messages
});
const budgetStore = useBudgetStore();
const transactionStore = useTransactionStore();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
onMounted(async () => {
  //await budgetStore.syncBudget({ budgetId: props.id });
  await budgetStore.syncBudgets();
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

const popupState = reactive({
  isDisplayed: false,
  isLoading: false,
  isArchivePrompt: false,
  isUnarchivePrompt: false,
  isArchivedSuccess: false,
  isUnarchivedSuccess: false,
  isError: false,
  errorMessage: ''
});

function openArchivePromptPopup() {
  popupState.isDisplayed = true;
  popupState.isArchivePrompt = true;
  popupState.isLoading = false;
  popupState.isUnarchivePrompt = false;
  popupState.isArchivedSuccess = false;
  popupState.isUnarchivedSuccess = false;
  popupState.isError = false;
  popupState.errorMessage = '';
}

function openUnarchivePromptPopup() {
  popupState.isDisplayed = true;
  popupState.isUnarchivePrompt = true;
  popupState.isLoading = false;
  popupState.isArchivePrompt = false;
  popupState.isArchivedSuccess = false;
  popupState.isUnarchivedSuccess = false;
  popupState.isError = false;
  popupState.errorMessage = '';
}

async function archiveBudget() {
  popupState.isArchivePrompt = false;
  popupState.isLoading = true;
  try {
    await budgetStore.archiveBudget({ budgetId: budgetStore.budgets[props.id]._id });
    popupState.isLoading = false;
    popupState.isArchivePrompt = false;
    popupState.isArchivedSuccess = true;

  } catch (err) {
    popupState.isLoading = false;
    popupState.isError = true;
    popupState.errorMessage = t('failed-to-archive-budget');
  }
}

async function unarchiveBudget() {
  popupState.isUnarchivePrompt = false;
  popupState.isLoading = true;
  try {
    await budgetStore.unarchiveBudget({ budgetId: budgetStore.budgets[props.id]._id });
    popupState.isLoading = false;
    popupState.isUnarchivePrompt = false;
    popupState.isUnarchivedSuccess = true;

  } catch (err) {
    popupState.isLoading = false;
    popupState.isError = true;
    popupState.errorMessage = t('failed-to-unarchive-budget');
  }
}

function closePopup() {
  popupState.isDisplayed = false;
}

</script>

<template>
  <main>
    <TheHeaderDetails @click="router.back()">{{ budgetStore.budgets[props.id]?.name || '' }}</TheHeaderDetails>
    <ScrollArea>
      <ContentContainer v-if="budgetStore.budgets[props.id] !== undefined">
        <div>
          <AppButton class="custom-button" @click="setDisplayedScreen('budget-info')"
            style="width:50%; margin:0; border-radius: 3px 0 0 3px;" :styleType="budgetInfoButtonStyle"
            :disabled="displayedScreen === 'budget-info'">
            {{ t('info') }}</AppButton>
          <AppButton class="custom-button" @click="setDisplayedScreen('budget-transactions')"
            style="width:50%; margin:0; border-radius: 0 3px 3px 0;" :styleType="budgetTransactionsButtonStyle"
            :disabled="displayedScreen === 'budget-transactions'">
            {{ t('transactions') }}
          </AppButton>
        </div>
        <div id="budget-info" class="local-container" v-show="displayedScreen === 'budget-info'">
          <ContentContainer>
            <p>{{ budgetStore.budgets[props.id].description }}</p>

            <AppButton @click="router.push({ name: 'budgetEdit', params: { id: props.id } })" styleType="empty">
              {{ t('edit-budget') }}</AppButton>
            <AppButton v-if="!budgetStore.budgets[props.id].isArchived" @click="openArchivePromptPopup"
              styleType="clean">
              {{ t('archive-budget') }}</AppButton>
            <AppButton v-else-if="budgetStore.budgets[props.id].isArchived" @click="openUnarchivePromptPopup"
              styleType="clean">
              {{ t('unarchive-budget') }}</AppButton>
          </ContentContainer>

        </div>
        <div id="budget-transaction" class="local-container" v-if="displayedScreen === 'budget-transactions'">
          <AppButton @click="router.push({ name: 'budgetAddFunds', params: { id: props.id } })">
            {{ t('add-funds-to-budget') }}</AppButton>
          <AppButton v-if="budgetStore.budgets[props.id].calculatedTotalAvailableAmount > 0"
            @click="router.push({ name: 'budgetWithdrawFunds', params: { id: props.id } })">
            {{ t('withdraw-funds-from-budget') }}</AppButton>
          <TransactionsList displayAs="budget-transactions" />
        </div>
      </ContentContainer>
    </ScrollArea>

    <AppPopup @close="closePopup" :isOpen="popupState.isDisplayed">
      <div v-show="popupState.isLoading">
        <ContentContainer>
          <AppLoading />
        </ContentContainer>
      </div>
      <div v-if="popupState.isArchivePrompt">
        <ContentContainer>
          <h1 style="text-align: center;">{{ t('are-you-sure-you-want-to-archive-this-budget') }}</h1>
          <AppButton @click="archiveBudget">{{ t('yes') }}</AppButton>
          <AppButton style-type="empty" @click="closePopup">{{ t('no') }}</AppButton>
        </ContentContainer>
      </div>
      <div v-if="popupState.isUnarchivePrompt">
        <ContentContainer>
          <h1 style="text-align: center;">{{ t('are-you-sure-you-want-to-unarchive-this-budget') }}</h1>
          <AppButton @click="unarchiveBudget">{{ t('yes') }}</AppButton>
          <AppButton style-type="empty" @click="closePopup">{{ t('no') }}</AppButton>
        </ContentContainer>
      </div>
      <div v-if="popupState.isArchivedSuccess">
        <ContentContainer>
          <h1 style="text-align: center;">{{ t('budget-has-been-archived') }}</h1>
          <AppButton @click="closePopup">{{ t('i-understand') }}</AppButton>
        </ContentContainer>
      </div>
      <div v-if="popupState.isUnarchivedSuccess">
        <ContentContainer>
          <h1 style="text-align: center;">{{ t('budget-has-been-unarchived') }}</h1>
          <AppButton @click="closePopup">{{ t('i-understand') }}</AppButton>
        </ContentContainer>
      </div>
      <div v-if="popupState.isError">
        <ContentContainer>
          <h1 style="text-align: center;">{{ popupState.errorMessage }}</h1>
          <AppButton styleType="empty" @click="closePopup">{{ t('try-again') }}</AppButton>
        </ContentContainer>
      </div>
    </AppPopup>
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