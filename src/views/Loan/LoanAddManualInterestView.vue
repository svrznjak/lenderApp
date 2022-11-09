<script setup lang="ts">
import TheHeaderEdit from '@/views/parts/TheHeaderEdit.vue';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import { onMounted, reactive, ref } from 'vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
import AppPopup from '@/components/AppPopup.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppCurrencyNumber from '@/components/AppCurrencyNumber.vue';
import router from '@/router';
import messages from './LoanAddManualInterestView.i18n.json';
import { useI18n } from 'vue-i18n';
import ScrollArea from '../parts/ScrollArea.vue';
import { useBudgetStore } from '@/stores/budget';
import { useLoanStore } from '@/stores/loan';
import { datetimeToString } from '@/helpers/dateToString';
const { t, locale } = useI18n({
  messages
});
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const userStore = useUserStore();
const loanStore = useLoanStore();
locale.value = userStore.user!.language;

const form = reactive({
  transactionTimestramp: datetimeToString(new Date()),
  description: '',
  amount: 0,
})

const popupState = reactive({
  isDisplayed: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: ''
});

function openSelectBudget() {
  popupState.isDisplayed = true;
}

async function submitPayment() {
  console.log(form);
  popupState.isDisplayed = true;
  popupState.isLoading = true;
  try {
    const data = {
      loanId: props.id,
      transactionTimestamp: new Date(form.transactionTimestramp).getTime(),
      description: form.description,
      amount: form.amount,
    }
    await loanStore.addManualInterestRate(data);
    popupState.isLoading = false;
    popupState.isSuccess = true;

  } catch (err: any) {
    console.log(err);
    popupState.isLoading = false;
    popupState.isError = true;
    popupState.errorMessage = t("manual-interest-creation-failed");

  }
}

function backToLoan() {
  router.back();
}

function closePopup() {
  popupState.isDisplayed = false;
  popupState.isLoading = false;
  popupState.isSuccess = false;
  popupState.isError = false;
  popupState.errorMessage = ''
}

</script>

<template>
  <main>
    <TheHeaderEdit :closeText="t('are-you-sure')">{{ t('add-manual-interest') }}</TheHeaderEdit>
    <ScrollArea>
      <ContentContainer>
        <VeeForm @submit="submitPayment">
          <h2>{{ t('info-about-new-transaction') }}</h2>
          <AppFormField name="transaction-timestamp" :label="t('transaction-timestamp')"
            v-model="form.transactionTimestramp" type="datetime-local" rules="required" />
          <AppFormField name="description" :label="t('description')" v-model="form.description" type="text"
            rules="required" />
          <AppFormField name="amount" :label="t('amount')" v-model.number="form.amount" type="number"
            rules="required" />
          <AppButton type="submit">{{ t('add-manual-interest') }}</AppButton>
        </VeeForm>
      </ContentContainer>
    </ScrollArea>
    <AppPopup :isOpen="popupState.isDisplayed">
      <div v-show="popupState.isLoading">
        <AppLoading />
        <h1 style="text-align: center;">{{ t('adding-interest-to-loan') }}...</h1>
      </div>
      <div v-if="popupState.isSuccess">
        <h1 style="text-align: center;">{{ t('manual-interest-added') }}</h1>
        <AppButton style="margin-top:20px;" @click="backToLoan">{{ t('open-loan') }}</AppButton>
      </div>
      <div v-if="popupState.isError">
        <h1 style="text-align: center;">{{ popupState.errorMessage }}</h1>
        <AppButton styleType="empty" style="margin-top:20px;" @click="closePopup">{{ t('try-again') }}</AppButton>
      </div>
    </AppPopup>
  </main>
</template>