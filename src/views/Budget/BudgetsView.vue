<script setup lang="ts">
import MenuMobile from '@/views/parts/TheMenuMobile.vue';
import HeaderMain from '@/views/parts/TheHeaderMain.vue';
import { useI18n } from 'vue-i18n';
import messages from './BudgetsView.i18n.json';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import AppCard from '@/components/AppCard.vue';
import router from '@/router';
const { t, locale } = useI18n({
  messages
});
console.log(locale);
const userStore = useUserStore();
locale.value = userStore.user.language;
</script>

<template>
  <main>
    <MenuMobile :newButtonText="t('new-budget')" newButtonRouteName="budget-add" />
    <HeaderMain>{{t('budgets')}}</HeaderMain>
    <ContentContainer>
      <AppCard @click="()=>router.push({name: 'budget', params:{id: budget._id}})"
        v-for="budget in userStore.user.budgets" :key="budget._id">
        <h2>{{ budget.name}}</h2>
        <div style="margin-top:20px; display:flex;">
          <h4 style="padding: 3px 5px 0px 0px;">Total:</h4>
          <h3>3.000,00</h3>
        </div>
        <div style="margin-top:10px; display:flex;">
          <h4 style="padding: 3px 5px 0px 0px;">Lended:</h4>
          <h3>3.000,00</h3>
        </div>
        <div style="margin-top:10px; display:flex;">
          <h4 style="padding: 3px 5px 0px 0px;">Avaiable:</h4>
          <h3>3.000,00</h3>
        </div>
      </AppCard>
    </ContentContainer>
  </main>
</template>