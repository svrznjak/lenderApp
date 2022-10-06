<script setup lang="ts">
import ContentContainer from './ContentContainer.vue';
import AppTransactionCard from '@/components/AppTransactionCard.vue';
import AppLoading from '@/components/AppLoading.vue';
import { useUserStore } from '@/stores/user';
import { useTransactionStore } from '@/stores/transaction';

const userStore = useUserStore();
const transactionStore = useTransactionStore();


</script>
<template>
  <AppLoading v-if="transactionStore.isFetching" />
  <ContentContainer>

    <AppTransactionCard v-if="!transactionStore.isFetching" v-for="transaction in transactionStore.transactions"
      :key="transaction._id" :transactionId="transaction._id"
      :type="transaction.from.datatype === 'OUTSIDE' ? 'to' : 'from'" :currency="userStore.user?.currency || 'USD'"
      :locale="userStore.user?.language || 'en'" :dateTimestamp="transaction.transactionTimestamp"
      :amount="transaction.amount" :description="transaction.description" />
  </ContentContainer>
</template>
<style scoped>

</style>

