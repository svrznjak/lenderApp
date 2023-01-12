<script setup lang="ts">
import TheHeaderEdit from '@/views/parts/TheHeaderEdit.vue';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import { onMounted, reactive, ref } from 'vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
import AppPopup from '@/components/AppPopup.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppCard from '@/components/AppCard.vue';
import AppCurrencyNumber from '@/components/AppCurrencyNumber.vue';
import router from '@/router';
import messages from './LoanAddPaymentView.i18n.json';
import { useI18n } from 'vue-i18n';
import ScrollArea from '../parts/ScrollArea.vue';
import { useBudgetStore } from '@/stores/budget';
import { useLoanStore } from '@/stores/loan';
import { datetimeToString } from '@/helpers/dateToString';
const { t } = useI18n({
  messages
});
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const userStore = useUserStore();
const budgetStore = useBudgetStore();
const loanStore = useLoanStore();

onMounted(async () => {
  await budgetStore.syncBudgets();
});

const form = reactive({
  transactionTimestramp: datetimeToString(new Date()),
  selectedBudgetId: '',
  description: '',
  amount: 0,
})

const popupState = reactive({
  isDisplayed: false,
  showBudgetSelect: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: ''
});

function openSelectBudget() {
  popupState.isDisplayed = true;
  popupState.showBudgetSelect = true;
}
function selectBudget(budgetId: string): void {
  form.selectedBudgetId = budgetId;
  closePopup();
}

async function submitPayment() {
  popupState.isDisplayed = true;
  popupState.isLoading = true;
  try {
    const data = {
      loanId: props.id,
      budgetId: form.selectedBudgetId,
      transactionTimestamp: new Date(form.transactionTimestramp).getTime(),
      description: form.description,
      amount: form.amount,
    }
    await loanStore.addPaymentToLoan(data);
    popupState.isLoading = false;
    popupState.isSuccess = true;

  } catch (err: any) {
    console.log(err);
    popupState.isLoading = false;
    popupState.isError = true;
    popupState.errorMessage = t("failed-to-add-payment");

  }
}

function backToLoan() {
  router.back();
}

function closePopup() {
  popupState.isDisplayed = false;
  popupState.showBudgetSelect = false;
  popupState.isLoading = false;
  popupState.isSuccess = false;
  popupState.isError = false;
  popupState.errorMessage = ''
}

</script>

<template>
  <main>
    <TheHeaderEdit :closeText="t('are-you-sure')">{{ t('add-loan-payment') }}</TheHeaderEdit>
    <ScrollArea>
      <ContentContainer>
        <VeeForm @submit="submitPayment">
          <h2>{{ t('info-about-new-payment') }}</h2>
          <AppFormField name="transaction-timestamp" :label="t('transaction-timestamp')"
            v-model="form.transactionTimestramp" type="datetime-local" rules="required" />
          <AppFormField as="textarea" name="description" :label="t('description')" v-model="form.description"
            type="text" rules="required" />
          <p>{{ t('budget-to-pay-to') }}</p>
          <AppButton v-show="form.selectedBudgetId.length === 0" styleType="empty" @click.prevent="openSelectBudget">
            {{ t('select-budget') }}
          </AppButton>
          <AppCard v-if="form.selectedBudgetId.length !== 0">
            <h2>{{ budgetStore.budgets[form.selectedBudgetId].name }}</h2>
          </AppCard>
          <AppButton v-show="form.selectedBudgetId.length !== 0" styleType="empty" @click.prevent="openSelectBudget">
            {{ t('select-different-budget') }}
          </AppButton>
          <AppFormField name="amount" :label="t('amount')" v-model.number="form.amount" type="number"
            rules="required" />
          <AppButton type="submit">{{ t('add-new-payment') }}</AppButton>
        </VeeForm>
      </ContentContainer>
    </ScrollArea>
    <AppPopup :isOpen="popupState.isDisplayed">
      <div v-show="popupState.showBudgetSelect">
        <ScrollArea :heightPercentage="80">
          <ContentContainer>
            <h1 style="text-align: left;">{{ t('select-budget') }}...</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend velit id euismod dictum. Cras est
              augue, tincidunt in ex a.</p>
            <AppCard :hasArrow="true" @click="selectBudget(budget._id)" v-for="budget in budgetStore.budgets"
              :key="budget._id">
              <h2>{{ budget.name }}</h2>
              <div style="margin-top:10px; display:flex;">
                <h4 style="padding: 3px 5px 0px 0px;">{{ t('current-funds') }}:</h4>
                <h3>
                  <AppCurrencyNumber :amount="budget.calculatedTotalAvailableAmount"
                    :currency="userStore.user!.currency" :locale="userStore.user!.language" />
                </h3>
              </div>
            </AppCard>
          </ContentContainer>
        </ScrollArea>
      </div>
      <div v-show="popupState.isLoading">
        <ContentContainer>
          <AppLoading />
          <h1 style="text-align: center;">{{ t('adding-payment-to-loan') }}...</h1>
        </ContentContainer>
      </div>
      <div v-if="popupState.isSuccess">
        <ContentContainer>
          <h1 style="text-align: center;">{{ t('payment-added') }}</h1>
          <AppButton @click="backToLoan">{{ t('open-loan') }}</AppButton>
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