<script setup lang="ts">
import MenuMobile from "@/views/parts/TheMenuMobile.vue";
import HeaderMain from "@/views/parts/TheHeaderMain.vue";
import { useI18n } from "vue-i18n";
import messages from "./BudgetsView.i18n.json";
import { useUserStore } from "@/stores/user";
import ContentContainer from "../parts/ContentContainer.vue";
import AppCard from "@/components/AppCard.vue";
import AppButton from "@/components/AppButton.vue";
import AppCurrencyNumber from "@/components/AppCurrencyNumber.vue";
import ScrollArea from "../parts/ScrollArea.vue";
import router from "@/router";
import { useBudgetStore } from "@/stores/budget";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { computed } from "@vue/reactivity";
import { IBudget } from "@/types/budgetInterface";
import AppInfoBadge from "../../components/AppInfoBadge.vue";
import { useAppStateStore } from "@/stores/appState";
const { t, locale } = useI18n({
  messages,
});
const { user } = storeToRefs(useUserStore());
const appStateStore = useAppStateStore();
locale.value = user.value!.language;

const budgetStore = useBudgetStore();

onMounted(async () => {
  await budgetStore.syncBudgets();
});

function toggleHideArchived() {
  appStateStore.budgetsViewState.hideArcived =
    !appStateStore.budgetsViewState.hideArcived;
}

const filteredBudgets = computed(() => {
  let budgets: IBudget[] = Object.entries(budgetStore.budgets).map(
    (entry) => entry[1]
  );

  if (appStateStore.budgetsViewState.hideArcived)
    budgets = budgets.filter((budget) => budget.isArchived === false);
  if (appStateStore.budgetsViewState.searchFieldText === "")
    return budgets.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

  return budgets
    .filter((budget) => {
      return budget.name
        .toLowerCase()
        .includes(appStateStore.budgetsViewState.searchFieldText.toLowerCase());
    })
    .sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
});
</script>

<template>
  <main id="budgets-view">
    <HeaderMain>{{ t("budgets") }}</HeaderMain>
    <ScrollArea :saveScrollTop="true">
      <ContentContainer>
        <div>
          <label for="search">{{ t("search-budgets") }}:</label>
          <input name="search" v-model="appStateStore.budgetsViewState.searchFieldText" type="text" />
        </div>
        <AppButton @click="toggleHideArchived" :styleType="
  appStateStore.budgetsViewState.hideArcived ? 'empty' : 'regular'
">{{ t("show-archived-budgets") }}</AppButton>

        <AppCard :hasArrow="true" @click="
  () => router.push({ name: 'budget', params: { id: budget._id } })
" v-for="budget in filteredBudgets" :key="budget._id">
          <h2>{{ budget.name }}</h2>
          <div style="margin-top: 20px; display: flex">
            <h4 style="padding: 0px 5px 0px 0px">{{ t("invested") }}:</h4>
            <h3>
              <AppCurrencyNumber :amount="budget.calculatedTotalInvestedAmount" :currency="user!.currency"
                :locale="user!.language" />
            </h3>
          </div>
          <div style="margin-top: 10px; display: flex">
            <h4 style="padding: 0px 5px 0px 0px">{{ t("withdrawn") }}:</h4>
            <h3>
              <AppCurrencyNumber :amount="budget.calculatedTotalWithdrawnAmount" :currency="user!.currency"
                :locale="user!.language" />
            </h3>
          </div>
          <div style="margin-top: 10px; display: flex">
            <h4 style="padding: 0px 5px 0px 0px">{{ t("lended") }}:</h4>
            <h3>
              <AppCurrencyNumber :amount="-1" :currency="user!.currency" :locale="user!.language" />
            </h3>
          </div>
          <div style="margin-top: 10px; display: flex">
            <h4 style="padding: 0px 5px 0px 0px">{{ t("avaiable") }}:</h4>
            <h3>
              <AppCurrencyNumber :amount="budget.calculatedTotalAvailableAmount" :currency="user!.currency"
                :locale="user!.language" />
            </h3>
          </div>
          <div v-if="budget.isArchived" style="margin-top: 20px; display: flex">
            <AppInfoBadge color="yellow">{{ t("archived") }}</AppInfoBadge>
          </div>
        </AppCard>
      </ContentContainer>
    </ScrollArea>
    <MenuMobile :newButtonText="t('new-budget')" newButtonRouteName="budgetAdd" />
  </main>
</template>
