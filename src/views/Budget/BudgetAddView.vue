<script setup lang="ts">
import TheHeaderEdit from '@/views/parts/TheHeaderEdit.vue';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import { onMounted, onUnmounted, reactive } from 'vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
import AppPopup from '@/components/AppPopup.vue';
import AppLoading from '@/components/AppLoading.vue';
import router from '@/router';
import messages from './BudgetAddView.i18n.json';
import { useI18n } from 'vue-i18n';
import ScrollArea from '../parts/ScrollArea.vue';
import { useBudgetStore } from '@/stores/budget';
import { IInterestRate } from '@/types/interestRateInterface';
import { IBudget } from '@/types/budgetInterface';
import { StatusBar } from '@capacitor/status-bar';
import { isNative } from '@/helpers/deviceInfo';
const { t } = useI18n({
  messages
});

onMounted(async () => {
  if (await isNative())
    StatusBar.hide();
})
onUnmounted(async () => {
  if (await isNative())
    StatusBar.show();
})

const budgetStore = useBudgetStore();

const form = reactive({
  name: '',
  description: '',
  typeOfInterestRate: 'PERCENTAGE_PER_DURATION',
  percentage: 5,
  fixedAmount: 0,
  duration: 'YEAR',
  isCompounding: 'NO',
  initialFunds: NaN
})

const popupState = reactive({
  isDisplayed: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: ''
});

let createdBudget: IBudget | null = null;

async function submitBudget() {
  popupState.isDisplayed = true;
  popupState.isLoading = true;
  try {
    let amount = 0;
    ((form.typeOfInterestRate === 'PERCENTAGE_PER_DURATION') ? amount = form.percentage : amount = form.fixedAmount);
    if (isNaN(form.initialFunds)) {
      form.initialFunds = 0;
    }
    const data = {
      name: form.name,
      description: form.description,
      defaultInterestRate: {
        type: form.typeOfInterestRate,
        duration: form.duration,
        expectedPayments: 'ONE_TIME',
        amount: amount,
        isCompounding: (form.isCompounding === 'YES' ? true : false)
      } as Pick<IInterestRate, "type" | "duration" | "expectedPayments" | "amount" | "isCompounding">,
      initialTransactionDescription: t('initial-transaction-description'),
      initialAmount: form.initialFunds,
    }
    createdBudget = await budgetStore.createBudget(data);
    popupState.isLoading = false;
    popupState.isSuccess = true;

  } catch (err: any) {
    console.log(err);
    popupState.isLoading = false;
    popupState.isError = true;
    popupState.errorMessage = t("budget-creation-failed");

  }
}

function openNewBudget() {
  if (createdBudget !== null)
    router.replace({ name: 'budget', params: { id: createdBudget._id } });
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
    <ScrollArea>
      <TheHeaderEdit :closeText="t('are-you-sure')">{{ t('creating-new-budget') }}</TheHeaderEdit>
      <ContentContainer>
        <VeeForm @submit="submitBudget">
          <h2>{{ t('info-about-new-budget') }}</h2>
          <AppFormField name="name" :label="t('name')" v-model="form.name" type="text" rules="required" />
          <AppFormField as="textarea" name="description" :label="t('description')" v-model="form.description"
            type="text" rules="required" />
          <h2>{{ t('define-default-interest-rate') }}</h2>
          <AppFormField as="select" name="typeOfInterestRate" :label="t('type-of-interest-rate')"
            v-model="form.typeOfInterestRate" rules="required">
            <option value="PERCENTAGE_PER_DURATION">{{ t('percentage-per-duration') }}</option>
            <option value="FIXED_PER_DURATION">{{ t('fixed-per-duration') }}</option>
          </AppFormField>
          <AppFormField name="percentage" :label="t('percentage')"
            v-if="form.typeOfInterestRate === 'PERCENTAGE_PER_DURATION'" v-model.number="form.percentage" type="number"
            rules="required|min_value:0|max_value:1000000" />
          <AppFormField name="fixed-amount" :label="t('fixed-amount')"
            v-if="form.typeOfInterestRate === 'FIXED_PER_DURATION'" v-model.number="form.fixedAmount" type="number"
            rules="required|min_value:0|max_value:999999999" />
          <AppFormField as="select" name="duration" :label="t('duration')" v-model="form.duration" rules="required">
            <option value="DAY">{{ t('day') }}</option>
            <option value="WEEK">{{ t('week') }}</option>
            <option value="MONTH">{{ t('month') }}</option>
            <option value="YEAR">{{ t('year') }}</option>
            <option value="FULL_DURATION">{{ t('full-duration') }}</option>
          </AppFormField>
          <AppFormField as="select" name="isCompounding" :label="t('compounding')" v-model="form.isCompounding"
            rules="required">
            <option value="YES">{{ t('yes') }}</option>
            <option value="NO">{{ t('no') }}</option>
          </AppFormField>
          <h2>{{ t('set-initial-funds-for-this-budget') }}</h2>
          <AppFormField name="initial-funds" :label="t('initial-funds')" v-model.number="form.initialFunds"
            type="number" rules="required" />
          <AppButton type="submit">{{ t('create-new-budget') }}</AppButton>
        </VeeForm>

      </ContentContainer>
    </ScrollArea>
    <AppPopup :isOpen="popupState.isDisplayed">
      <div v-show="popupState.isLoading">
        <AppLoading />
        <h1 style="text-align: center;">{{ t('creating-new-budget') }}...</h1>
      </div>
      <div v-if="popupState.isSuccess">
        <h1 style="text-align: center;">{{ t('budget-created') }}</h1>
        <AppButton style="margin-top:20px;" @click="openNewBudget">{{ t('open-budget') }}</AppButton>
      </div>
      <div v-if="popupState.isError">
        <h1 style="text-align: center;">{{ popupState.errorMessage }}</h1>
        <AppButton styleType="empty" style="margin-top:20px;" @click="closePopup">{{ t('try-again') }}</AppButton>
      </div>
    </AppPopup>
  </main>
</template>
