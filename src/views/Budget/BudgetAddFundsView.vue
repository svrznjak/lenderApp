<script setup lang="ts">
import TheHeaderEdit from '@/views/parts/TheHeaderEdit.vue';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import { reactive } from 'vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
import AppPopup from '@/components/AppPopup.vue';
import AppLoading from '@/components/AppLoading.vue';
import router from '@/router';
import messages from './BudgetAddFundsView.i18n.json';
import { useI18n } from 'vue-i18n';
import ScrollArea from '../parts/ScrollArea.vue';
import { useBudgetStore } from '@/stores/budget';
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
const budgetStore = useBudgetStore();

const form = reactive({
  transactionTimestramp: datetimeToString(new Date()),
  description: '',
  amount: NaN,
})

const popupState = reactive({
  isDisplayed: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: ''
});

async function submitBudget() {
  popupState.isDisplayed = true;
  popupState.isLoading = true;
  try {
    const data = {
      budgetId: props.id,
      transactionTimestamp: new Date(form.transactionTimestramp).getTime(),
      description: form.description,
      amount: form.amount,
    }
    await budgetStore.addFundsToBudget(data);
    popupState.isLoading = false;
    popupState.isSuccess = true;

  } catch (err: any) {
    console.log(err);
    popupState.isLoading = false;
    popupState.isError = true;
    popupState.errorMessage = t("funds-adding-failed");

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
    <TheHeaderEdit :closeText="t('are-you-sure')">{{ t('adding-funds-to-budget') }}</TheHeaderEdit>
    <ScrollArea>
      <ContentContainer>
        <VeeForm @submit="submitBudget">
          <h2>{{ t('info-about-new-transaction') }}</h2>
          <AppFormField name="transaction-timestamp" :label="t('transaction-timestamp')"
            v-model="form.transactionTimestramp" type="datetime-local" rules="required" />
          <AppFormField as="textarea" name="description" :label="t('description')" v-model="form.description"
            type="text" rules="required" />
          <AppFormField name="amount" :label="t('amount')" v-model.number="form.amount" type="number"
            rules="required|min_value:0" min="0" />
          <AppButton type="submit">{{ t('add-funds') }}</AppButton>
        </VeeForm>

      </ContentContainer>
    </ScrollArea>
    <AppPopup :isOpen="popupState.isDisplayed">
      <div v-show="popupState.isLoading">
        <AppLoading />
        <h1 style="text-align: center;">{{ t('adding-funds-to-budget') }}...</h1>
      </div>
      <div v-if="popupState.isSuccess">
        <h1 style="text-align: center;">{{ t('funds-added') }}</h1>
        <AppButton style="margin-top:20px;" @click="backToBudget">{{ t('open-budget') }}</AppButton>
      </div>
      <div v-if="popupState.isError">
        <h1 style="text-align: center;">{{ popupState.errorMessage }}</h1>
        <AppButton styleType="empty" style="margin-top:20px;" @click="closePopup">{{ t('try-again') }}</AppButton>
      </div>
    </AppPopup>
  </main>
</template>