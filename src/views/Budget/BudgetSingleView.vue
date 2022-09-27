<script setup lang="ts">
import TheHeaderDetails from '@/views/parts/TheHeaderDetails.vue';
import { useUserStore } from '@/stores/user';
import router from '@/router';
import ContentContainer from '../parts/ContentContainer.vue';
import AppButton from '@/components/AppButton.vue';

import messages from './BudgetAddView.i18n.json';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
const { t, locale } = useI18n({
  messages
});
const { user } = useUserStore();
locale.value = user.language;
const currentRoute = router.currentRoute.value;
const currentBudget = user.budgets.find((budget) => budget._id === currentRoute.params.id);

type displayedScreenType = 'budget-info' | 'budget-transactions'



const displayedScreen = ref<displayedScreenType>('budget-info');
const budgetInfoButtonStyle = ref('regular');
const budgetTransactionsButtonStyle = ref('empty');
function setDisplayedScreen(newValue: displayedScreenType): void {
  if (newValue === 'budget-info') {
    displayedScreen.value = 'budget-info';
    budgetInfoButtonStyle.value = 'regular';
    budgetTransactionsButtonStyle.value = 'empty';
  } else if (newValue === 'budget-transactions') {
    displayedScreen.value = 'budget-transactions';
    budgetInfoButtonStyle.value = 'empty';
    budgetTransactionsButtonStyle.value = 'regular';
  }
}

</script>

<template>
  <main>
    <TheHeaderDetails @click="router.back()">{{ currentBudget.name }}</TheHeaderDetails>
    <ContentContainer>
      <div>
        <AppButton class="custom-button" @click="setDisplayedScreen('budget-info')"
          style="width:50%; margin:0; border-radius: 5px 0 0 5px;" :styleType="budgetInfoButtonStyle">
          {{t('info')}}</AppButton>
        <AppButton class="custom-button" @click="setDisplayedScreen('budget-transactions')"
          style="width:50%; margin:0; border-radius: 0 5px 5px 0;" :styleType="budgetTransactionsButtonStyle">
          {{t('transactions')}}
        </AppButton>
      </div>
      <div id="budget-info" class="local-container" v-show="displayedScreen==='budget-info'">
        <p>{{currentBudget.description}}</p>
        <AppButton>{{t('add-funds-to-budget')}}</AppButton>
        <AppButton>{{t('withdraw-funds-to-budget')}}</AppButton>
        <AppButton styleType="empty">{{t('edit-budget')}}</AppButton>
      </div>
      <div id="budget-transaction" class="local-container" v-if="displayedScreen==='budget-transactions'">
        <AppButton>{{t('add-funds-to-budget')}}</AppButton>
        <AppButton>{{t('withdraw-funds-to-budget')}}</AppButton>
        <p>asdsad</p>
        <p>asdsad</p>
        <p>asdsad</p>
        <p>asdsad</p>
      </div>
    </ContentContainer>
  </main>
</template>
<style scoped>
.local-container>* {
  margin-bottom: 20px;
}

button.regular.custom-button {
  &:hover {
    border-color: var(--primaryColor);
    background-color: var(--primaryColor);
  }
}
</style>