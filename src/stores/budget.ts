import { IBudget } from "./../types/budgetInterface";
import { acceptHMRUpdate, defineStore } from "pinia";
import { gql } from "graphql-request";
import requestBackend from "./helpers/requestBackend";
import { IInterestRate } from "@/types/interestRateInterface";

export const useBudgetStore = defineStore("BudgetStore", {
  state: () => ({ budgets: [] as IBudget[], isFetching: false as boolean }),
  actions: {
    async syncBudget(variables: { budgetId: string }) {
      const query = gql`
        query ($budgetId: ID!) {
          Budget {
            budget(budgetId: $budgetId) {
              _id
              name
              description
              defaultInterestRate {
                type
                duration
                amount
                entryTimestamp
              }
              calculatedTotalAmount
              calculatedLendedAmount
            }
          }
        }
      `;
      try {
        this.isFetching = true;
        const budget = (await requestBackend({ gql: query, variables })).Budget.budget;

        const budgetIndexInState = this.budgets.findIndex((stateBudget) => stateBudget._id === budget._id);
        if (budgetIndexInState > -1) this.budgets[budgetIndexInState] = budget;
        else this.budgets.push(budget);

        this.isFetching = false;
      } catch (err: any) {
        console.log(err);
        throw new Error(err);
      }
    },
    async syncBudgets() {
      const query = gql`
        query {
          Budget {
            budgets {
              _id
              name
              description
              defaultInterestRate {
                type
                duration
                amount
                entryTimestamp
              }
              calculatedTotalAmount
              calculatedLendedAmount
            }
          }
        }
      `;
      try {
        this.isFetching = true;
        this.budgets = (await requestBackend({ gql: query })).Budget.budgets;
        this.isFetching = false;
      } catch (err: any) {
        console.log(err);
        throw new Error(err);
      }
    },
    async createBudget({
      name,
      description,
      defaultInterestRate,
      initialTransactionDescription,
      initialAmount,
    }: {
      name: string;
      description: string;
      defaultInterestRate: Pick<IInterestRate, "type" | "duration" | "expectedPayments" | "amount" | "isCompounding">;
      initialTransactionDescription: string;
      initialAmount: number;
    }): Promise<IBudget> {
      const variables = {
        name,
        description,
        type: defaultInterestRate.type,
        duration: defaultInterestRate.duration,
        expectedPayments: defaultInterestRate.expectedPayments,
        amount: defaultInterestRate.amount,
        isCompounding: defaultInterestRate.isCompounding,
        initialTransactionDescription,
        initialAmount,
      };

      const query = gql`
        mutation (
          $name: String!
          $description: String!
          $type: DurationTypeInput!
          $duration: DurationInput!
          $expectedPayments: expectedPaymentsInputType!
          $amount: Int!
          $isCompounding: Boolean!
          $initialAmount: Int!
          $initialTransactionDescription: String!
        ) {
          Budget {
            createBudget(
              name: $name
              description: $description
              defaultInterestRate: {
                type: $type
                duration: $duration
                expectedPayments: $expectedPayments
                amount: $amount
                isCompounding: $isCompounding
              }
              initialAmount: $initialAmount
              initialTransactionDescription: $initialTransactionDescription
            ) {
              _id
              name
              description
              defaultInterestRate {
                type
                duration
                expectedPayments
                amount
                isCompounding
                entryTimestamp
              }
              calculatedTotalAmount
              calculatedLendedAmount
            }
          }
        }
      `;
      const createdBudget = (await requestBackend({ gql: query, variables })).Budget.createBudget;
      this.budgets.push(createdBudget);
      return createdBudget;
    },
    async addFundsToBudget({
      budgetId,
      description,
      transactionTimestamp,
      amount,
    }: {
      budgetId: string;
      description: string;
      transactionTimestamp: number;
      amount: number;
    }): Promise<IBudget> {
      const variables = {
        budgetId,
        description,
        transactionTimestamp,
        amount,
      };
      const query = gql`
        mutation ($budgetId: ID!, $description: String!, $transactionTimestamp: Float!, $amount: Float!) {
          Budget {
            addFundsToBudget(
              budgetId: $budgetId
              description: $description
              transactionTimestamp: $transactionTimestamp
              amount: $amount
            ) {
              _id
              name
              description
              defaultInterestRate {
                type
                duration
                amount
                entryTimestamp
              }
              calculatedTotalAmount
              calculatedLendedAmount
            }
          }
        }
      `;
      const updatedBudget = (await requestBackend({ gql: query, variables })).Budget.addFundsToBudget;
      console.log(updatedBudget);
      for (let i = 0; i < this.budgets.length; i++) {
        if (this.budgets[i]._id === updatedBudget._id) {
          this.budgets[i] = updatedBudget;
        }
      }
      return updatedBudget;
    },
    async withdrawFundsFromBudget({
      budgetId,
      description,
      transactionTimestamp,
      amount,
    }: {
      budgetId: string;
      description: string;
      transactionTimestamp: number;
      amount: number;
    }): Promise<IBudget> {
      const variables = {
        budgetId,
        description,
        transactionTimestamp,
        amount,
      };

      const query = gql`
        mutation ($budgetId: ID!, $description: String!, $transactionTimestamp: Float!, $amount: Float!) {
          Budget {
            withdrawFundsFromBudget(
              budgetId: $budgetId
              description: $description
              transactionTimestamp: $transactionTimestamp
              amount: $amount
            ) {
              _id
              name
              description
              defaultInterestRate {
                type
                duration
                amount
                entryTimestamp
              }
              calculatedTotalAmount
              calculatedLendedAmount
            }
          }
        }
      `;
      const updatedBudget = (await requestBackend({ gql: query, variables })).Budget.withdrawFundsFromBudget;
      console.log(updatedBudget);
      for (let i = 0; i < this.budgets.length; i++) {
        if (this.budgets[i]._id === updatedBudget._id) {
          this.budgets[i] = updatedBudget;
        }
      }
      return updatedBudget;
    },
    getBudgetById(budgetId: string) {
      return this.budgets.find((budget) => budgetId === budget._id);
    },
  },
  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBudgetStore, import.meta.hot));
}
