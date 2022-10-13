<script setup lang="ts">
import TheHeaderEdit from '@/views/parts/TheHeaderEdit.vue';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import { onMounted, reactive } from 'vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
import AppPopup from '@/components/AppPopup.vue';
import AppLoading from '@/components/AppLoading.vue';
import router from '@/router';
import messages from './EditTransactionView.i18n.json';
import { useI18n } from 'vue-i18n';
import ScrollArea from '../parts/ScrollArea.vue';
import { useTransactionStore } from '@/stores/transaction';
import dateToString from '@/helpers/dateToString';
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
locale.value = userStore.user!.language;


const { getTransaction, updateTransaction } = useTransactionStore();

onMounted(async () => {
  const transaction = await getTransaction({ transactionId: props.id });

  form.transactionTimestramp = dateToString(new Date(transaction.transactionTimestamp));
  form.description = transaction.description;
  form.amount = transaction.amount;
})

const form = reactive({
  transactionTimestramp: '',
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

async function submitUpdate() {
  console.log(form);
  popupState.isDisplayed = true;
  popupState.isLoading = true;
  try {
    console.log(router.currentRoute.value.params.id);
    const data = {
      transactionId: props.id,
      transactionTimestamp: new Date(form.transactionTimestramp).getTime(),
      description: form.description,
      amount: form.amount,
    }
    await updateTransaction(data);
    popupState.isLoading = false;
    popupState.isSuccess = true;

  } catch (err: any) {
    console.log(err);
    popupState.isLoading = false;
    popupState.isError = true;
    popupState.errorMessage = t("budget-update-failed");

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
    <TheHeaderEdit :closeText="t('are-you-sure')">{{ t('adding-funds-to-budget')}}</TheHeaderEdit>
    <ScrollArea>
      <ContentContainer>
        <VeeForm @submit="submitUpdate">
          <h2>{{t('info-about-transaction')}}</h2>
          <AppFormField name="transaction-timestamp" :label="t('transaction-timestamp')"
            v-model="form.transactionTimestramp" type="datetime-local" rules="required" />
          <AppFormField as="textarea" name="description" :label="t('description')" v-model="form.description"
            type="text" rules="required" />
          <AppFormField name="amount" :label="t('amount')" v-model.number="form.amount" type="number"
            rules="required" />
          <AppButton type="submit">{{t('update-transaction')}}</AppButton>
        </VeeForm>

      </ContentContainer>
    </ScrollArea>
    <AppPopup :isOpen="popupState.isDisplayed">
      <div v-show="popupState.isLoading">
        <AppLoading />
        <h1 style="text-align: center;">{{t('updating-transaction')}}...</h1>
      </div>
      <div v-if="popupState.isSuccess">
        <h1 style="text-align: center;">{{t('transaction-updated')}}</h1>
        <AppButton style="margin-top:20px;" @click="backToBudget">{{t('back-to-transactions')}}</AppButton>
      </div>
      <div v-if="popupState.isError">
        <h1 style="text-align: center;">{{popupState.errorMessage}}</h1>
        <AppButton styleType="empty" style="margin-top:20px;" @click="closePopup">{{t('try-again')}}</AppButton>
      </div>
    </AppPopup>
  </main>
</template>