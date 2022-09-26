<script setup lang="ts">
import MenuMobile from '@/views/parts/TheMenuMobile.vue';
import HeaderMain from '@/views/parts/TheHeaderMain.vue';
import { useI18n } from 'vue-i18n';
import messages from './BudgetsView.i18n.json';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
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

      <p>Budgets View</p>
    </ContentContainer>
  </main>
</template>