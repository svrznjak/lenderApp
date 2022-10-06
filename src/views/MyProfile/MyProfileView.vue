<script setup lang="ts">
import MenuMobile from '@/views/parts/TheMenuMobile.vue';
import HeaderMain from '@/views/parts/TheHeaderMain.vue';
import { useI18n } from 'vue-i18n';
import messages from './MyProfileView.i18n.json';
import { useUserStore } from '@/stores/user';
import AppButton from '@/components/AppButton.vue';
import ScrollArea from '../parts/ScrollArea.vue';
import ContentContainer from '../parts/ContentContainer.vue';
const { t, locale } = useI18n({
  messages
});
const userStore = useUserStore();
</script>

<template>
  <main>
    <HeaderMain>My Profile</HeaderMain>
    <ScrollArea :saveScrollTop="true">
      <ContentContainer>
        <AppButton @click="userStore.logout()">Log out</AppButton>
      </ContentContainer>
    </ScrollArea>
    <MenuMobile :newButtonText="t('new-budget')" newButtonRouteName="budgetAdd" />
  </main>
</template>