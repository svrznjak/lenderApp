<script setup lang="ts">
import ContentContainer from './ContentContainer.vue';
import AppTransactionCard from '@/components/AppTransactionCard.vue';
import AppLoading from '@/components/AppLoading.vue';
import { useUserStore } from '@/stores/user';
import { useTransactionStore } from '@/stores/transaction';
import { onMounted, ref } from 'vue';
import { useBudgetStore } from '@/stores/budget';
import { useLoanStore } from '@/stores/loan';

const props = defineProps({
  displayAs: {
    type: String,
    required: true,
    validator(value: string) {
      // The value must match one of these strings
      return ['budget-transactions', 'loan-transaction'].includes(value)
    }
  },
});


const userStore = useUserStore();
const budgetStore = useBudgetStore();
const loanStore = useLoanStore();
const transactionStore = useTransactionStore();

const transactions = ref<any>([]);

onMounted(async () => {
  // refresh budgets and loans
  await budgetStore.syncBudgets();
  await loanStore.syncLoans();

  // generate transactions array
  for (let i = 0; i < transactionStore.transactions.length; i++) {
    const storeTransaction = transactionStore.transactions[i];

    let transaction = {
      id: storeTransaction._id,
      dateTimestamp: storeTransaction.transactionTimestamp,
      amount: storeTransaction.amount,
      description: storeTransaction.description,
      type: '',
      additionalDescription: '',
    };
    if (props.displayAs === 'budget-transactions') {
      // set transaction type
      if (storeTransaction.from.datatype === 'BUDGET') {
        transaction.type = 'from';

        // set transaction additionalDescription
        transaction.additionalDescription = 'TO-' + storeTransaction.to.datatype;

        if (storeTransaction.to.datatype == 'LOAN')
          transaction.additionalDescription += ': ' + loanStore.getLoanById(storeTransaction.to.addressId)?.name;
      } else if (storeTransaction.to.datatype === 'BUDGET') {
        transaction.type = 'to';

        // set transaction additionalDescription
        transaction.additionalDescription = 'FROM-' + storeTransaction.from.datatype;

        if (storeTransaction.from.datatype == 'LOAN')
          transaction.additionalDescription += ': ' + loanStore.getLoanById(storeTransaction.from.addressId)?.name;
      }
    } else if (props.displayAs === 'loan-transactions') {
      // set transaction type
      if (storeTransaction.from.datatype === 'LOAN') {
        transaction.type = 'from';

        // set transaction additionalDescription
        transaction.additionalDescription = 'TO-' + storeTransaction.to.datatype;
        if (storeTransaction.to.datatype == 'BUDGET')
          transaction.additionalDescription += ': ' + budgetStore.getBudgetById(storeTransaction.to.addressId)?.name;
      } else if (storeTransaction.to.datatype === 'LOAN') {
        transaction.type = 'to';

        // set transaction additionalDescription
        transaction.additionalDescription = 'FROM-' + storeTransaction.from.datatype;
        if (storeTransaction.from.datatype == 'BUDGET')
          transaction.additionalDescription += ': ' + budgetStore.getBudgetById(storeTransaction.from.addressId)?.name;
      }
    }

    transactions.value.push(transaction)
  }
});

</script>
<template>
  <AppLoading v-if="transactionStore.isFetching" />
  <ContentContainer>

    <AppTransactionCard v-if="!transactionStore.isFetching" v-for="transaction in transactions" :key="transaction.id"
      :transactionId="transaction.id" :type="transaction.type" :currency="userStore.user?.currency || 'USD'"
      :locale="userStore.user?.language || 'en'" :dateTimestamp="transaction.dateTimestamp" :amount="transaction.amount"
      :description="transaction.description" :additionalDescription="transaction.additionalDescription" />
  </ContentContainer>
</template>
<style scoped>

</style>

