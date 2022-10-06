<script setup lang="ts">
import {
  add,
} from 'date-fns';
import TheHeaderEdit from '@/views/parts/TheHeaderEdit.vue';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import { reactive, ref, watch } from 'vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
import AppPopup from '@/components/AppPopup.vue';
import AppCard from '@/components/AppCard.vue';
import AppCurrencyNumber from '@/components/AppCurrencyNumber.vue';
import AppLoading from '@/components/AppLoading.vue';
import router from '@/router';
import ScrollArea from '../parts/ScrollArea.vue';
import dateToString from '@/helpers/dateToString.js';

import messages from './LoanAddView.i18n.json';
import { useI18n } from 'vue-i18n';
import AppInfoBadge from '@/components/AppInfoBadge.vue';
import IFund from '@/types/fundInterface';
const { t, locale } = useI18n({
  messages
});
const { user, createLoan, getBudgetById } = useUserStore();
locale.value = user.language;



const form = reactive({
  name: '',
  description: '',
  openedDate: dateToString(new Date()),
  loanDurationType: 'MONTHS',
  loanDuration: 1,
  closesDate: '',
  typeOfInterestRate: 'PERCENTAGE_PER_DURATION',
  percentage: 5,
  fixedAmount: 0,
  duration: 'YEAR',
  isCompounding: 'NO',
  expectedPayments: 'MONTHLY',
  funds: []
});

const addFundsForm = reactive({
  newFundsAmount: 0,
})

watch(
  () => form.openedDate,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      recalculateClosesDate();
    }
  }
);

watch(
  () => form.loanDurationType,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (newValue !== "PICK_DATE")
        recalculateClosesDate();
    }
  }
);
watch(
  () => form.loanDuration,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      recalculateClosesDate();
    }
  }
);

function recalculateClosesDate() {
  console.log("recalculate");
  const openedDate = new Date(form.openedDate);
  let newClosesDate = new Date(form.closesDate);
  if (form.loanDurationType === "DAYS")
    newClosesDate = add(openedDate, { days: form.loanDuration });
  else if (form.loanDurationType === "WEEKS")
    newClosesDate = add(openedDate, { weeks: form.loanDuration });
  else if (form.loanDurationType === "MONTHS")
    newClosesDate = add(openedDate, { months: form.loanDuration });
  else if (form.loanDurationType === "YEARS")
    newClosesDate = add(openedDate, { years: form.loanDuration });
  form.closesDate = dateToString(newClosesDate);
}
recalculateClosesDate();

function addFund(newFund: IFund): Boolean {
  form.funds.push(newFund);
  addFundsForm.newFundsAmount = 0;
  closePopup();
  return true;
}

function getFormTotalFunds() {
  const total = form.funds.reduce(function (total, fund) {
    return total + fund.amount
  }, 0);
  console.log(total);
  return total;
}


const popupState = reactive({
  isDisplayed: false,
  isSelectFunds: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: ''
});

let createdLoan: any = null;

async function submitLoan() {
  console.log(form);
  popupState.isDisplayed = true;
  popupState.isLoading = true;
  try {
    let amount = 0;
    ((form.typeOfInterestRate === 'PERCENTAGE_PER_DURATION') ? amount = form.percentage : amount = form.fixedAmount);
    const data = {
      name: form.name,
      description: form.description,
      openedTimestamp: new Date(form.openedDate).getTime(),
      closesTimestamp: new Date(form.closesDate).getTime(),
      interestRate: {
        type: form.typeOfInterestRate,
        duration: form.duration,
        expectedPayments: form.expectedPayments,
        amount: amount,
        isCompounding: (form.isCompounding === 'YES' ? true : false)
      },
      initialTransactionDescription: t('initial-transaction-description'),
      funds: form.funds,
    }
    createdLoan = await createLoan(data);
    console.log(createdLoan);
    popupState.isLoading = false;
    popupState.isSuccess = true;

  } catch (err: any) {
    console.log(err);
    popupState.isLoading = false;
    popupState.isError = true;
    popupState.errorMessage = t("loan-creation-failed");

  }
}

function openNewLoan() {
  router.replace({ name: 'loan', params: { id: createdLoan._id } });
}

function closePopup() {
  popupState.isDisplayed = false;
  popupState.isSelectFunds = false;
  popupState.isLoading = false;
  popupState.isSuccess = false;
  popupState.isError = false;
  popupState.errorMessage = '';
}

function openSelectFundsPopup() {
  popupState.isDisplayed = true;
  popupState.isSelectFunds = true;
}


</script>

<template>
  <main>
    <TheHeaderEdit :closeText="t('are-you-sure')">{{ t('creating-new-loan')}}</TheHeaderEdit>
    <ScrollArea>
      <ContentContainer>
        <VeeForm @submit="submitLoan">
          <h2>{{t('info-about-new-loan')}}</h2>
          <AppFormField name="name" :label="t('name')" v-model="form.name" type="text" rules="required" />
          <AppFormField as="textarea" name="description" :label="t('description')" v-model="form.description"
            type="text" rules="required" />
          <h2>{{t('loan-timeframe')}}</h2>
          <AppFormField name="opened-date" :label="t('loan-start-date')" v-model="form.openedDate" type="date"
            rules="required" />
          <AppFormField as="select" name="loan-duration-type" :label="t('loan-duration-type')"
            v-model="form.loanDurationType" rules="required">
            <option value="DAYS">{{ t('days') }}</option>
            <option value="WEEKS">{{ t('weeks') }}</option>
            <option value="MONTHS">{{ t('months') }}</option>
            <option value="YEARS">{{ t('years') }}</option>
            <option value="PICK_DATE">{{ t('pick-date')}}</option>
          </AppFormField>
          <AppFormField name="loan-duration" :label="t('loan-duration')" v-if="form.loanDurationType !=='PICK_DATE'"
            v-model.number="form.loanDuration" type="number" rules="required|min_value:0|max_value:1000000" />
          <AppInfoBadge v-if="form.loanDurationType !=='PICK_DATE'">Loan will end on {{form.closesDate}}</AppInfoBadge>
          <AppFormField v-if="form.loanDurationType ==='PICK_DATE'" name="closes-date" :label="t('loan-end-date')"
            v-model="form.closesDate" type="date" rules="required" />
          <h2>{{t('select-funds-for-this-loan')}}</h2>

          <AppCard v-for="fund in form.funds" :key="fund.budgetId">
            <h2>{{ getBudgetById(fund.budgetId).name}}</h2>
            <div style="margin-top:10px; display:flex;">
              <h4 style="padding: 3px 5px 0px 0px;">Selected funds:</h4>
              <h3>
                <AppCurrencyNumber :amount="fund.amount" :currency="user.currency" :locale="user.language" />
              </h3>
            </div>
            <div style="margin-top:10px; display:flex;">
              <h4 style="padding: 3px 5px 0px 0px;">Avaiable funds:</h4>
              <h3>
                <AppCurrencyNumber
                  :amount="getBudgetById(fund.budgetId).calculatedTotalAmount - getBudgetById(fund.budgetId).calculatedLendedAmount"
                  :currency="user.currency" :locale="user.language" />
              </h3>
            </div>
          </AppCard>
          <AppInfoBadge v-if="form.funds.length > 0">Total loan amount is {{ getFormTotalFunds() }}
          </AppInfoBadge>
          <AppButton styleType="empty" @click.prevent="openSelectFundsPopup">Select funds from budget</AppButton>
          <h2>{{t('define-default-interest-rate')}}</h2>
          <AppFormField as="select" name="typeOfInterestRate" :label="t('type-of-interest-rate')"
            v-model="form.typeOfInterestRate" rules="required">
            <option value="PERCENTAGE_PER_DURATION">{{ t('percentage-per-duration')}}</option>
            <option value="FIXED_PER_DURATION">{{ t('fixed-per-duration') }}</option>
          </AppFormField>
          <AppFormField name="percentage" :label="t('percentage')"
            v-if="form.typeOfInterestRate==='PERCENTAGE_PER_DURATION'" v-model.number="form.percentage" type="number"
            rules="required|min_value:0|max_value:1000000" />
          <AppFormField name="fixed-amount" :label="t('fixed-amount')"
            v-if="form.typeOfInterestRate==='FIXED_PER_DURATION'" v-model.number="form.fixedAmount" type="number"
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
          <AppFormField as="select" name="expectedPayments" :label="t('expected-payments')"
            v-model="form.expectedPayments" rules="required">
            <option value="DAILY">{{ t('daily') }}</option>
            <option value="WEEKLY">{{ t('weekly') }}</option>
            <option value="MONTHLY">{{ t('monthly') }}</option>
            <option value="YEARLY">{{ t('yearly') }}</option>
            <option value="ONE_TIME">{{ t('one-time') }}</option>
          </AppFormField>
          <AppButton type="submit">{{t('create-new-budget')}}</AppButton>
        </VeeForm>

      </ContentContainer>
    </ScrollArea>

    <AppPopup :isOpen="popupState.isDisplayed">
      <div v-show="popupState.isSelectFunds">
        <ScrollArea :heightPercentage="80">
          <ContentContainer>
            <h1 style="text-align: left;">{{t('adding-funds-from-budget')}}...</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend velit id euismod dictum. Cras est
              augue, tincidunt in ex a.</p>
            <AppFormField name="newFundsAmount" :label="t('funds-amount')" v-model.number="addFundsForm.newFundsAmount"
              type="number" rules="required|min_value:0|max_value:999999999" />
            <h2>Select budget</h2>
            <AppCard :hasArrow="true" @click="addFund({budgetId: budget._id, amount: addFundsForm.newFundsAmount})"
              v-for="budget in user.budgets" :key="budget._id">
              <h2>{{ budget.name}}</h2>
              <div style="margin-top:10px; display:flex;">
                <h4 style="padding: 3px 5px 0px 0px;">Avaiable:</h4>
                <h3>
                  <AppCurrencyNumber :amount="budget.calculatedTotalAmount - budget.calculatedLendedAmount"
                    :currency="user.currency" :locale="user.language" />
                </h3>
              </div>
            </AppCard>
          </ContentContainer>
        </ScrollArea>
      </div>
      <div v-show="popupState.isLoading">
        <AppLoading />
        <h1 style="text-align: center;">{{t('creating-new-loan')}}...</h1>
      </div>
      <div v-if="popupState.isSuccess">
        <h1 style="text-align: center;">{{t('loan-created')}}</h1>
        <AppButton style="margin-top:20px;" @click="openNewLoan">{{t('open-new-loan')}}</AppButton>
      </div>
      <div v-if="popupState.isError">
        <h1 style="text-align: center;">{{popupState.errorMessage}}</h1>
        <AppButton styleType="empty" style="margin-top:20px;" @click="closePopup">{{t('try-again')}}</AppButton>
      </div>
    </AppPopup>
  </main>
</template>