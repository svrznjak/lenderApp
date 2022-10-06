<script setup lang="ts">
import TheHeaderEdit from '@/views/parts/TheHeaderEdit.vue';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import { reactive, ref } from 'vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
import AppPopup from '@/components/AppPopup.vue';
import AppLoading from '@/components/AppLoading.vue';
import router from '@/router';
import messages from './BudgetWithdrawFundsView.i18n.json';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n({
  messages
});
const { user, withdrawFundsFromBudget } = useUserStore();
locale.value = user.language;

const now = new Date();
const form = reactive({
  transactionTimestramp: `${now.getFullYear()}-0${now.getUTCMonth() + 1}-${now.getDate()}`,
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

async function submitBudget() {
  console.log(form);
  popupState.isDisplayed = true;
  popupState.isLoading = true;
  try {
    console.log(router.currentRoute.value.params.id);
    const data = {
      budgetId: router.currentRoute.value.params.id,
      transactionTimestamp: new Date(form.transactionTimestramp).getTime(),
      description: form.description,
      amount: form.amount,
    }
    await withdrawFundsFromBudget(data);
    popupState.isLoading = false;
    popupState.isSuccess = true;

  } catch (err: any) {
    console.log(err);
    popupState.isLoading = false;
    popupState.isError = true;
    popupState.errorMessage = t("funds-withdrawal-failed");

  }
}

function backToBudget() {
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
    <TheHeaderEdit :closeText="t('are-you-sure')">{{ t('withdrawing-funds-to-budget')}}</TheHeaderEdit>
    <ContentContainer>
      <VeeForm @submit="submitBudget">
        <h2>{{t('info-about-new-transaction')}}</h2>
        <AppFormField name="transaction-timestamp" :label="t('transaction-timestamp')"
          v-model="form.transactionTimestramp" type="date" rules="required" />
        <AppFormField as="textarea" name="description" :label="t('description')" v-model="form.description" type="text"
          rules="required" />
        <AppFormField name="amount" :label="t('amount')" v-model.number="form.amount" type="number" min="0"
          rules="required|min_value:0" />
        <AppButton type="submit">{{t('withdraw-funds')}}</AppButton>
      </VeeForm>

    </ContentContainer>
    <AppPopup :isOpen="popupState.isDisplayed">
      <div v-show="popupState.isLoading">
        <AppLoading />
        <h1 style="text-align: center;">{{t('withdrawing-funds-from-budget')}}...</h1>
      </div>
      <div v-if="popupState.isSuccess">
        <h1 style="text-align: center;">{{t('funds-withdrawn')}}</h1>
        <AppButton style="margin-top:20px;" @click="backToBudget">{{t('open-budget')}}</AppButton>
      </div>
      <div v-if="popupState.isError">
        <h1 style="text-align: center;">{{popupState.errorMessage}}</h1>
        <AppButton styleType="empty" style="margin-top:20px;" @click="closePopup">{{t('try-again')}}</AppButton>
      </div>
    </AppPopup>
  </main>
</template>