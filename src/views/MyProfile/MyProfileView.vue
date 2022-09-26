<script setup lang="ts">
import MenuMobile from '@/views/parts/TheMenuMobile.vue';
import HeaderMain from '@/views/parts/TheHeaderMain.vue';
import { useUserStore } from '@/stores/user';
import AppButton from '@/components/AppButton.vue';

const userStore = useUserStore();
</script>

<template>
  <main>
    <MenuMobile />
    <HeaderMain>My Profile</HeaderMain>
    <AppButton @click="userStore.logout()">Log out</AppButton>
    <p>About View</p>
  </main>
</template>