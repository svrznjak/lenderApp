<script setup lang="ts">
import TheHeaderEdit from "@/views/parts/TheHeaderEdit.vue";
import { useUserStore } from "@/stores/user";
import ContentContainer from "../parts/ContentContainer.vue";
import { reactive } from "vue";
import AppFormField from "@/components/AppFormField.vue";
import AppButton from "@/components/AppButton.vue";
import AppPopup from "@/components/AppPopup.vue";
import AppLoading from "@/components/AppLoading.vue";
import router from "@/router";
import messages from "./BudgetAddView.i18n.json";
import { useI18n } from "vue-i18n";
import ScrollArea from "../parts/ScrollArea.vue";
import { setLocale } from "@vee-validate/i18n";
import { useBudgetStore } from "@/stores/budget";
import { IInterestRate } from "@/types/interestRateInterface";
import { IBudget } from "@/types/budgetInterface";
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const { t, locale } = useI18n({
  messages,
});
const userStore = useUserStore();
const budgetStore = useBudgetStore();
locale.value = userStore.user!.language;
setLocale(userStore.user!.language);

const form = reactive({
  name: budgetStore.budgets[props.id].name,
  description: budgetStore.budgets[props.id].description,
  typeOfInterestRate: budgetStore.budgets[props.id].defaultInterestRate.type,
  percentage: budgetStore.budgets[props.id].defaultInterestRate.amount,
  fixedAmount: budgetStore.budgets[props.id].defaultInterestRate.amount,
  duration: budgetStore.budgets[props.id].defaultInterestRate.duration,
  isCompounding: (budgetStore.budgets[props.id].defaultInterestRate.isCompounding ? "YES" : "NO"),
});

const popupState = reactive({
  isDisplayed: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
});

let editedBudget: IBudget | null = null;

async function submitBudget() {
  console.log(form);
  popupState.isDisplayed = true;
  popupState.isLoading = true;
  try {
    let amount = 0;
    form.typeOfInterestRate === "PERCENTAGE_PER_DURATION"
      ? (amount = form.percentage)
      : (amount = form.fixedAmount);
    const data = {
      budgetId: props.id,
      name: form.name,
      description: form.description,
      defaultInterestRate: {
        type: form.typeOfInterestRate,
        duration: form.duration,
        expectedPayments: "ONE_TIME",
        amount: amount,
        isCompounding: form.isCompounding === "YES" ? true : false,
      } as Pick<
        IInterestRate,
        "type" | "duration" | "expectedPayments" | "amount" | "isCompounding"
      >,
    };
    editedBudget = await budgetStore.editMyBudget(data);
    popupState.isLoading = false;
    popupState.isSuccess = true;
  } catch (err: any) {
    console.log(err);
    popupState.isLoading = false;
    popupState.isError = true;
    popupState.errorMessage = t("budget-saving-failed");
  }
}

function openNewBudget() {
  if (editedBudget !== null)
    router.replace({ name: "budget", params: { id: editedBudget._id } });
}

function closePopup() {
  popupState.isDisplayed = false;
  popupState.isLoading = false;
  popupState.isSuccess = false;
  popupState.isError = false;
  popupState.errorMessage = "";
}
</script>

<template>
  <main>
    <TheHeaderEdit :closeText="t('are-you-sure')">{{
    t("editing-budget")
    }}</TheHeaderEdit>
    <ScrollArea>
      <ContentContainer>
        <VeeForm @submit="submitBudget">
          <h2>{{ t("info-about-budget") }}</h2>
          <AppFormField name="name" :label="t('name')" v-model="form.name" type="text" rules="required" />
          <AppFormField as="textarea" name="description" :label="t('description')" v-model="form.description"
            type="text" rules="required" />
          <h2>{{ t("define-default-interest-rate") }}</h2>
          <AppFormField as="select" name="typeOfInterestRate" :label="t('type-of-interest-rate')"
            v-model="form.typeOfInterestRate" rules="required">
            <option value="PERCENTAGE_PER_DURATION">
              {{ t("percentage-per-duration") }}
            </option>
            <option value="FIXED_PER_DURATION">
              {{ t("fixed-per-duration") }}
            </option>
          </AppFormField>
          <AppFormField name="percentage" :label="t('percentage')"
            v-if="form.typeOfInterestRate === 'PERCENTAGE_PER_DURATION'" v-model.number="form.percentage" type="number"
            rules="required|min_value:0|max_value:1000000" />
          <AppFormField name="fixed-amount" :label="t('fixed-amount')"
            v-if="form.typeOfInterestRate === 'FIXED_PER_DURATION'" v-model.number="form.fixedAmount" type="number"
            rules="required|min_value:0|max_value:999999999" />
          <AppFormField as="select" name="duration" :label="t('duration')" v-model="form.duration" rules="required">
            <option value="DAY">{{ t("day") }}</option>
            <option value="WEEK">{{ t("week") }}</option>
            <option value="MONTH">{{ t("month") }}</option>
            <option value="YEAR">{{ t("year") }}</option>
            <option value="FULL_DURATION">{{ t("full-duration") }}</option>
          </AppFormField>
          <AppFormField as="select" name="isCompounding" :label="t('compounding')" v-model="form.isCompounding"
            rules="required">
            <option value="YES">{{ t("yes") }}</option>
            <option value="NO">{{ t("no") }}</option>
          </AppFormField>
          <AppButton type="submit">{{ t("saving-budget") }}</AppButton>
        </VeeForm>
      </ContentContainer>
    </ScrollArea>
    <AppPopup :isOpen="popupState.isDisplayed">
      <div v-show="popupState.isLoading">
        <AppLoading />
        <h1 style="text-align: center">{{ t("saving-edited-budget") }}...</h1>
      </div>
      <div v-if="popupState.isSuccess">
        <h1 style="text-align: center">{{ t("budget-saved") }}</h1>
        <AppButton style="margin-top: 20px" @click="openNewBudget">{{
        t("open-budget")
        }}</AppButton>
      </div>
      <div v-if="popupState.isError">
        <h1 style="text-align: center">{{ popupState.errorMessage }}</h1>
        <AppButton styleType="empty" style="margin-top: 20px" @click="closePopup">{{ t("try-again") }}</AppButton>
      </div>
    </AppPopup>
  </main>
</template>
