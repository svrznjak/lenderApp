<script setup lang="ts">
import { add, addMonths } from 'date-fns';
import TheHeaderEdit from '@/views/parts/TheHeaderEdit.vue';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
import AppPopup from '@/components/AppPopup.vue';
import AppCard from '@/components/AppCard.vue';
import AppCurrencyNumber from '@/components/AppCurrencyNumber.vue';
import AppDate from '@/components/AppDate.vue';
import AppLoading from '@/components/AppLoading.vue';
import router from '@/router';
import ScrollArea from '../parts/ScrollArea.vue';
import { dateToString } from '@/helpers/dateToString.js';

import messages from './LoanAddView.i18n.json';
import { useI18n } from 'vue-i18n';
import AppInfoBadge from '@/components/AppInfoBadge.vue';
import IFund from '@/types/fundInterface';
import { useLoanStore } from '@/stores/loan';
import { useBudgetStore } from '@/stores/budget';
import { IInterestRate, IAmortizationInterval } from '@/types/interestRateInterface';
import { IBudget } from '@/types/budgetInterface';
import calculateExpectedAmortization from '@/helpers/calculateExpectedAmortization';
const { t } = useI18n({
  messages
});
const userStore = useUserStore();
const loanStore = useLoanStore();
const budgetStore = useBudgetStore();

onMounted(async () => {
  await budgetStore.syncBudgets();
});

locale.value = userStore.user!.language;



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
  funds: [] as IFund[]
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
  const openedDate = new Date(form.openedDate + 'T00:00');
  let newClosesDate = new Date(form.closesDate + 'T00:00');
  if (form.loanDurationType === "DAYS")
    newClosesDate = add(openedDate, { days: form.loanDuration });
  else if (form.loanDurationType === "WEEKS")
    newClosesDate = add(openedDate, { weeks: form.loanDuration });
  else if (form.loanDurationType === "MONTHS") {
    newClosesDate = addMonths(openedDate, form.loanDuration);
  } else if (form.loanDurationType === "YEARS")
    newClosesDate = add(openedDate, { years: form.loanDuration });
  form.closesDate = dateToString(newClosesDate);
}
recalculateClosesDate();

function addFund(): void {
  const ALREADY_ENTERED_FUND_INDEX = form.funds.findIndex((fund) => {
    if (fund.budgetId === pickedBudgetId.value) return true;
  });
  console.log(ALREADY_ENTERED_FUND_INDEX);
  if (ALREADY_ENTERED_FUND_INDEX < 0) {
    const newFund: IFund = {
      budgetId: pickedBudgetId.value,
      amount: addFundsForm.newFundsAmount,
    }
    form.funds.push(newFund);
  } else {
    form.funds[ALREADY_ENTERED_FUND_INDEX].amount = addFundsForm.newFundsAmount;
  }
  addFundsForm.newFundsAmount = 0;
  closePopup();
}

const formTotalFunds = computed(() => {
  const total = form.funds.reduce(function (total, fund) {
    return total + fund.amount
  }, 0);
  console.log(total);
  return total;
});


const popupState = reactive({
  isDisplayed: false,
  isSelectBudget: false,
  isEnterFunds: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  isFundOptions: false,
  fundOptionsBudgetId: '',
  errorMessage: ''
});

const searchFieldText = ref('');

const filteredBudgets = computed(() => {
  let budgets: IBudget[] = Object.entries(budgetStore.budgets).map(
    (entry) => entry[1]
  );

  budgets.filter((budget) => {
    form.funds.forEach(fund => {
      if (fund.budgetId === budget._id) return false;
    });
    return true;
  });

  if (searchFieldText.value === "")
    return budgets.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

  return budgets
    .filter((budget) => {
      return budget.name
        .toLowerCase()
        .includes(searchFieldText.value.toLowerCase());
    })
    .sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
});
const pickedBudgetId = ref('');

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
      openedTimestamp: new Date(form.openedDate + 'T00:00').getTime(),
      closesTimestamp: new Date(form.closesDate + 'T00:00').getTime(),
      interestRate: {
        type: form.typeOfInterestRate,
        duration: form.duration,
        expectedPayments: form.expectedPayments,
        amount: amount,
        isCompounding: (form.isCompounding === 'YES' ? true : false)
      } as Pick<IInterestRate, "type" | "duration" | "expectedPayments" | "amount" | "isCompounding">,
      initialTransactionDescription: t('initial-transaction-description'),
      funds: form.funds,
    }
    createdLoan = await loanStore.createLoan(data);
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

function pickBudget({ budgetId }: { budgetId: string }) {
  clearPopup();
  pickedBudgetId.value = budgetId;
  popupState.isSelectBudget = false;
  popupState.isEnterFunds = true;

  form.funds.forEach((fund) => {
    if (fund.budgetId === budgetId)
      addFundsForm.newFundsAmount = fund.amount;
  });

}

function openNewLoan() {
  router.replace({ name: 'loan', params: { id: createdLoan._id } });
}

function clearPopup() {
  popupState.isSelectBudget = false;
  popupState.isEnterFunds = false;
  popupState.isLoading = false;
  popupState.isSuccess = false;
  popupState.isError = false;
  popupState.isFundOptions = false;
  popupState.errorMessage = '';
}

function closePopup() {
  popupState.isDisplayed = false;
}

function openSelectFundsPopup() {
  clearPopup();
  popupState.isDisplayed = true;
  popupState.isSelectBudget = true;
}

function openfundOptions(fundId: string) {
  clearPopup();
  popupState.isDisplayed = true;
  popupState.isFundOptions = true;
  popupState.fundOptionsBudgetId = fundId;

}

function removeFund() {
  form.funds = form.funds.filter((fund) => {
    if (fund.budgetId !== popupState.fundOptionsBudgetId) return true;
  });
}

const computedAmortization = computed(() => {
  console.log("recalc");
  let interestAmount = 0;
  ((form.typeOfInterestRate === 'PERCENTAGE_PER_DURATION') ? interestAmount = form.percentage : interestAmount = form.fixedAmount);

  const result: IAmortizationInterval[] = calculateExpectedAmortization({
    openedTimestamp: new Date(form.openedDate + 'T00:00').getTime(),
    closesTimestamp: new Date(form.closesDate + 'T00:00').getTime(),
    interestRate: {
      type: form.typeOfInterestRate,
      duration: form.duration,
      expectedPayments: form.expectedPayments,
      amount: interestAmount,
      isCompounding: (form.isCompounding === 'YES' ? true : false)
    } as Pick<IInterestRate, "type" | "duration" | "expectedPayments" | "amount" | "isCompounding">,
    amount: form.funds.reduce((total, fund) => {
      return total + fund.amount;
    }, 0),
  });
  console.log(result);
  return {
    amortizationTable: result as IAmortizationInterval[],
    totalInterest: result.reduce((total, amortizationInterval) => {
      return total + amortizationInterval.interest
    }, 0)
  };
});

</script>

<template>
  <main>
    <TheHeaderEdit :closeText="t('are-you-sure')">{{ t('creating-new-loan') }}</TheHeaderEdit>
    <ScrollArea>
      <ContentContainer>
        <VeeForm @submit="submitLoan">
          <h2>{{ t('info-about-new-loan') }}</h2>
          <AppFormField name="name" :label="t('name')" v-model="form.name" type="text" rules="required" />
          <AppFormField as="textarea" name="description" :label="t('description')" v-model="form.description"
            type="text" rules="required" />
          <h2>{{ t('loan-timeframe') }}</h2>
          <AppFormField name="opened-date" :label="t('loan-start-date')" v-model="form.openedDate" type="date"
            rules="required" />
          <AppFormField as="select" name="loan-duration-type" :label="t('loan-duration-type')"
            v-model="form.loanDurationType" rules="required">
            <option value="DAYS">{{ t('days') }}</option>
            <option value="WEEKS">{{ t('weeks') }}</option>
            <option value="MONTHS">{{ t('months') }}</option>
            <option value="YEARS">{{ t('years') }}</option>
            <option value="PICK_DATE">{{ t('pick-date') }}</option>
          </AppFormField>
          <AppFormField name="loan-duration" :label="t('loan-duration')" v-if="form.loanDurationType !== 'PICK_DATE'"
            v-model.number="form.loanDuration" type="number" min="0" rules="required|min_value:0|max_value:1000000" />
          <AppInfoBadge v-if="form.loanDurationType !== 'PICK_DATE'">{{ t('loan-ends-on') }}:
            <AppDate :timestamp="new Date(form.closesDate + 'T00:00').getTime()" :currency="userStore.user!.currency"
              :locale="userStore.user!.language" />
          </AppInfoBadge>
          <AppFormField v-if="form.loanDurationType === 'PICK_DATE'" name="closes-date" :label="t('loan-ends-on')"
            v-model="form.closesDate" type="date" rules="required" />
          <h2>{{ t('select-funds-for-this-loan') }}</h2>

          <AppCard v-for="fund in form.funds" :key="fund.budgetId" @click="openfundOptions(fund.budgetId)">
            <h2>{{ budgetStore.budgets[fund.budgetId].name }}</h2>
            <div style="margin-top:10px; display:flex;">
              <h4 style="padding: 3px 5px 0px 0px;">{{ t('selected-funds') }}</h4>
              <h3>
                <AppCurrencyNumber :amount="fund.amount" :currency="userStore.user!.currency"
                  :locale="userStore.user!.language" />
              </h3>
            </div>
            <div style="margin-top:10px; display:flex;">
              <h4 style="padding: 3px 5px 0px 0px;">{{ t('avaiable-funds') }}</h4>
              <h3>
                <AppCurrencyNumber :amount="budgetStore.budgets[fund.budgetId].calculatedTotalAvailableAmount"
                  :currency="userStore.user!.currency" :locale="userStore.user!.language" />
              </h3>
            </div>
          </AppCard>
          <AppInfoBadge v-if="form.funds.length > 0">{{ t('total-loan-amount') }}:
            <AppCurrencyNumber :amount="formTotalFunds" :currency="userStore.user!.currency"
              :locale="userStore.user!.language" />
          </AppInfoBadge>
          <AppButton styleType="empty" @click.prevent="openSelectFundsPopup">{{ t('select-funds-from-budget') }}
          </AppButton>
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
          <AppFormField as="select" name="isCompounding" :label="t('compounding')"
            v-show="form.typeOfInterestRate === 'PERCENTAGE_PER_DURATION'" v-model="form.isCompounding"
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
          <AppInfoBadge v-if="form.funds.length > 0">{{ t('calculated-interest') }}:
            <AppCurrencyNumber :amount="computedAmortization.totalInterest" :currency="userStore.user!.currency"
              :locale="userStore.user!.language" />
          </AppInfoBadge>
          <AppButton type="submit">{{ t('create-new-loan') }}</AppButton>
        </VeeForm>

      </ContentContainer>
    </ScrollArea>

    <AppPopup :isOpen="popupState.isDisplayed" @close="closePopup">
      <div v-show="popupState.isSelectBudget">
        <ScrollArea :heightPercentage="80">
          <ContentContainer>
            <h1 style="text-align: left;">{{ t('adding-funds-from-budget') }}...</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend velit id euismod dictum. Cras est
              augue, tincidunt in ex a.</p>
            <h2>Select budget</h2>
            <div>
              <label for="search">{{ t("search-budgets") }}</label>
              <input name="search" v-model="searchFieldText" type="text" />
            </div>
            <AppCard :hasArrow="true" @click="pickBudget({ budgetId: budget._id })" v-for="budget in filteredBudgets"
              :key="budget._id">
              <h2>{{ budget.name }}</h2>
              <div style="margin-top:10px; display:flex;">
                <h4 style="padding: 3px 5px 0px 0px;">Avaiable:</h4>
                <h3>
                  <AppCurrencyNumber :amount="budget.calculatedTotalAvailableAmount"
                    :currency="userStore.user!.currency" :locale="userStore.user!.language" />
                </h3>
              </div>
              <div v-if="form.funds.some((fund) => fund.budgetId === budget._id)"
                style="margin-top: 20px; display: flex">
                <AppInfoBadge color="blue">{{ t("already-included") }}</AppInfoBadge>
              </div>
            </AppCard>
          </ContentContainer>
        </ScrollArea>
      </div>
      <div v-if="popupState.isEnterFunds" style="width:100%;">
        <ContentContainer>
          <AppCard @click="() => { popupState.isSelectBudget = true; popupState.isEnterFunds = false; }">
            <h2>{{ budgetStore.budgets[pickedBudgetId].name }}</h2>
            <div style="margin-top:10px; display:flex;">
              <h4 style="padding: 3px 5px 0px 0px;">{{ t('avaiable-funds') }}</h4>
              <h3>
                <AppCurrencyNumber :amount="budgetStore.budgets[pickedBudgetId].calculatedTotalAvailableAmount"
                  :currency="userStore.user!.currency" :locale="userStore.user!.language" />
              </h3>
            </div>
          </AppCard>
          <h1>{{ t('enter-amount') }}</h1>
          <VeeForm @submit="addFund">
            <AppFormField name="newFundsAmount" :label="t('funds-amount')" v-model.number="addFundsForm.newFundsAmount"
              type="number" :min="0" :max="budgetStore.budgets[pickedBudgetId].calculatedTotalAvailableAmount"
              :rules="'required|min_value:0|max_value:' + budgetStore.budgets[pickedBudgetId].calculatedTotalAvailableAmount" />
            <AppButton type="submit">{{ t('confirm') }}
            </AppButton>
          </VeeForm>
        </ContentContainer>
      </div>
      <div v-show="popupState.isLoading">
        <AppLoading />
        <h1 style="text-align: center;">{{ t('creating-new-loan') }}...</h1>
      </div>
      <div v-if="popupState.isSuccess">
        <h1 style="text-align: center;">{{ t('loan-created') }}</h1>
        <AppButton style="margin-top:20px;" @click="openNewLoan">{{ t('open-new-loan') }}</AppButton>
      </div>
      <div v-if="popupState.isError">
        <h1 style="text-align: center;">{{ popupState.errorMessage }}</h1>
        <AppButton styleType="empty" style="margin-top:20px;" @click="closePopup">{{ t('try-again') }}</AppButton>
      </div>
      <div v-if="popupState.isFundOptions" style="width:100%;">
        <ContentContainer>
          <AppButton styleType="regular" @click="pickBudget({ budgetId: popupState.fundOptionsBudgetId })">
            {{ t('change-amount') }}</AppButton>
          <AppButton styleType="regular" @click="() => { removeFund(); closePopup() }">{{ t('remove-fund') }}
          </AppButton>
        </ContentContainer>
      </div>
    </AppPopup>

  </main>
</template>