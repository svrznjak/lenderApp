import { acceptHMRUpdate, defineStore } from "pinia";
import { gql } from "graphql-request";
import requestBackend from "./helpers/requestBackend";
import { ITransaction } from "@/types/transactionInterface";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Improves rendering since it does not load alot of dom elements at once
async function populateGradually(values: any[], destination: any[]) {
  for (let i = 0; i < values.length; i++) {
    destination.push(values[i]);
    await delay(1);
  }
}

export const useTransactionStore = defineStore("TransactionStore", {
  state: () => ({ transactions: [] as ITransaction[], isFetching: false as boolean }),
  actions: {
    async getTransaction(variables: { transactionId: string }): Promise<ITransaction> {
      const query = gql`
        query ($transactionId: ID!) {
          Transaction {
            transaction(transactionId: $transactionId) {
              _id
              transactionTimestamp
              description
              from {
                datatype
                addressId
              }
              to {
                datatype
                addressId
              }
              amount
              entryTimestamp
            }
          }
        }
      `;
      try {
        const transaction = (await requestBackend({ gql: query, variables })).Transaction.transaction;
        return transaction;
      } catch (err: any) {
        console.log(err);
        throw new Error(err);
      }
    },
    async getBudgetTransactions({ budgetId }: { budgetId: string }) {
      this.isFetching = true;
      const variables = {
        budgetId,
      };
      const query = gql`
        query ($budgetId: ID!) {
          Budget {
            transactions(budgetId: $budgetId) {
              _id
              transactionTimestamp
              description
              from {
                datatype
                addressId
              }
              to {
                datatype
                addressId
              }
              amount
              entryTimestamp
            }
          }
        }
      `;
      try {
        this.transactions = [];
        const transactions = (await requestBackend({ gql: query, variables })).Budget.transactions;
        this.isFetching = false;
        populateGradually(transactions, this.transactions);
      } catch (err: any) {
        console.log(err);
        throw new Error(err);
      }
    },
    async getLoanTransactions({ loanId }: { loanId: string }) {
      this.isFetching = true;
      const variables = {
        loanId,
      };
      const query = gql`
        query ($loanId: ID!) {
          Loan {
            transactions(loanId: $loanId) {
              _id
              transactionTimestamp
              description
              from {
                datatype
                addressId
              }
              to {
                datatype
                addressId
              }
              amount
              entryTimestamp
            }
          }
        }
      `;
      try {
        this.transactions = (await requestBackend({ gql: query, variables })).Loan.transactions;
        this.isFetching = false;
      } catch (err: any) {
        console.log(err);
        throw new Error(err);
      }
    },
    async updateTransaction(variables: {
      transactionId: string;
      transactionTimestamp: number;
      description: string;
      amount: number;
    }): Promise<ITransaction> {
      const mutation = gql`
        mutation ($transactionId: ID!, $transactionTimestamp: Float!, $description: String!, $amount: Float!) {
          Transaction {
            edit(
              transactionId: $transactionId
              transactionTimestamp: $transactionTimestamp
              description: $description
              amount: $amount
            ) {
              _id
              transactionTimestamp
              description
              from {
                datatype
                addressId
              }
              to {
                datatype
                addressId
              }
              amount
              entryTimestamp
            }
          }
        }
      `;
      try {
        const transaction = (await requestBackend({ gql: mutation, variables })).Transaction.transaction;
        return transaction;
      } catch (err: any) {
        console.log(err);
        throw new Error(err);
      }
    },
    async deleteTransaction(variables: { transactionId: string }): Promise<ITransaction> {
      const mutation = gql`
        mutation ($transactionId: ID!) {
          Transaction {
            delete(transactionId: $transactionId)
          }
        }
      `;
      try {
        const transaction = (await requestBackend({ gql: mutation, variables })).Transaction.delete;
        if (transaction) {
          const indexOfDeletedTransaction = this.transactions.findIndex(
            (transaction: ITransaction) => transaction._id === variables.transactionId
          );
          this.transactions.splice(indexOfDeletedTransaction, 1);
        }
        return transaction;
      } catch (err: any) {
        console.log(err);
        throw new Error(err);
      }
    },
  },
  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTransactionStore, import.meta.hot));
}
