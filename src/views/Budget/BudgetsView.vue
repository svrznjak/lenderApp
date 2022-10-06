<script setup lang="ts">
import MenuMobile from '@/views/parts/TheMenuMobile.vue';
import HeaderMain from '@/views/parts/TheHeaderMain.vue';
import { useI18n } from 'vue-i18n';
import messages from './BudgetsView.i18n.json';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import AppCard from '@/components/AppCard.vue';
import AppCurrencyNumber from '@/components/AppCurrencyNumber.vue';
import ScrollArea from '../parts/ScrollArea.vue';
import router from '@/router';
import { useBudgetStore } from '@/stores/budget';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
const { t, locale } = useI18n({
  messages
});
const { user } = storeToRefs(useUserStore());
locale.value = user.value!.language;

const budgetStore = useBudgetStore();

onMounted(async () => await budgetStore.syncBudgets())



</script>

<template>
  <main id="budgets-view">
    <HeaderMain>{{t('budgets')}}</HeaderMain>
    <ScrollArea :saveScrollTop="true">
      <ContentContainer>
        <AppCard :hasArrow="true" @click="()=>router.push({name: 'budget', params:{id: budget._id} })"
          v-for="budget in budgetStore.budgets" :key="budget._id">
          <h2>{{ budget.name}}</h2>
          <div style="margin-top:20px; display:flex;">
            <h4 style="padding: 3px 5px 0px 0px;">{{t('total')}}:</h4>
            <h3>
              <AppCurrencyNumber :amount="budget.calculatedTotalAmount" :currency="user!.currency"
                :locale="user!.language" />
            </h3>
          </div>
          <div style="margin-top:10px; display:flex;">
            <h4 style="padding: 3px 5px 0px 0px;">{{t('lended')}}:</h4>
            <h3>
              <AppCurrencyNumber :amount="budget.calculatedLendedAmount" :currency="user!.currency"
                :locale="user!.language" />
            </h3>
          </div>
          <div style="margin-top:10px; display:flex;">
            <h4 style="padding: 3px 5px 0px 0px;">{{t('avaiable')}}:</h4>
            <h3>
              <AppCurrencyNumber :amount="budget.calculatedTotalAmount - budget.calculatedLendedAmount"
                :currency="user!.currency" :locale="user!.language" />
            </h3>
          </div>
        </AppCard>
      </ContentContainer>
    </ScrollArea>
    <MenuMobile :newButtonText="t('new-budget')" newButtonRouteName="budgetAdd" />
  </main>
</template>
