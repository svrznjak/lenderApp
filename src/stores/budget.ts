import { IBudget } from "./../types/budgetInterface";
import { acceptHMRUpdate, defineStore } from "pinia";
import { gql } from "graphql-request";
import requestBackend from "./helpers/requestBackend";
import { IInterestRate } from "@/types/interestRateInterface";

interface IBudgets {
  [key: string]: IBudget;
}

export const useBudgetStore = defineStore("BudgetStore", {
  state: () => ({ budgets: {} as IBudgets, isFetching: false as boolean }),
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
              isArchived
              calculatedTotalInvestedAmount
              calculatedTotalWithdrawnAmount
              calculatedTotalAvailableAmount
            }
          }
        }
      `;
      try {
        this.isFetching = true;
        const budget = (await requestBackend({ gql: query, variables })).Budget.budget;
        this.budgets[budget._id] = budget;

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
              isArchived
              calculatedTotalInvestedAmount
              calculatedTotalWithdrawnAmount
              calculatedTotalAvailableAmount
            }
          }
        }
      `;
      try {
        this.isFetching = true;
        const budgets: IBudget[] = (await requestBackend({ gql: query })).Budget.budgets;
        budgets.forEach((budget) => {
          this.budgets[budget._id] = budget;
        });
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
              isArchived
              calculatedTotalInvestedAmount
              calculatedTotalWithdrawnAmount
              calculatedTotalAvailableAmount
            }
          }
        }
      `;
      const createdBudget = (await requestBackend({ gql: query, variables })).Budget.createBudget;
      this.budgets[createdBudget._id] = createdBudget;
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
              isArchived
              calculatedTotalInvestedAmount
              calculatedTotalWithdrawnAmount
              calculatedTotalAvailableAmount
            }
          }
        }
      `;
      const updatedBudget = (await requestBackend({ gql: query, variables })).Budget.addFundsToBudget;
      console.log(updatedBudget);
      this.budgets[updatedBudget._id] = updatedBudget;
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
              isArchived
              calculatedTotalInvestedAmount
              calculatedTotalWithdrawnAmount
              calculatedTotalAvailableAmount
            }
          }
        }
      `;
      const updatedBudget = (await requestBackend({ gql: query, variables })).Budget.withdrawFundsFromBudget;
      console.log(updatedBudget);
      this.budgets[updatedBudget._id] = updatedBudget;

      return updatedBudget;
    },
    async archiveBudget({ budgetId }: { budgetId: string }): Promise<IBudget> {
      const variables = {
        budgetId,
      };

      const query = gql`
        mutation ($budgetId: ID!) {
          Budget {
            archiveBudget(budgetId: $budgetId) {
              _id
              name
              description
              defaultInterestRate {
                type
                duration
                amount
                entryTimestamp
              }
              isArchived
              calculatedTotalInvestedAmount
              calculatedTotalWithdrawnAmount
              calculatedTotalAvailableAmount
            }
          }
        }
      `;
      const updatedBudget = (await requestBackend({ gql: query, variables })).Budget.archiveBudget;
      console.log(updatedBudget);
      this.budgets[updatedBudget._id] = updatedBudget;
      return updatedBudget;
    },
    async unarchiveBudget({ budgetId }: { budgetId: string }): Promise<IBudget> {
      const variables = {
        budgetId,
      };

      const query = gql`
        mutation ($budgetId: ID!) {
          Budget {
            unarchiveBudget(budgetId: $budgetId) {
              _id
              name
              description
              defaultInterestRate {
                type
                duration
                amount
                entryTimestamp
              }
              isArchived
              calculatedTotalInvestedAmount
              calculatedTotalWithdrawnAmount
              calculatedTotalAvailableAmount
            }
          }
        }
      `;
      const updatedBudget = (await requestBackend({ gql: query, variables })).Budget.unarchiveBudget;
      console.log(updatedBudget);
      this.budgets[updatedBudget._id] = updatedBudget;
      return updatedBudget;
    },
    getBudgetById(budgetId: string) {
      return this.budgets.find((budget) => budgetId === budget._id);
    },
    getArchivedBudgets(): IBudget[] {
      console.log(
        Object.entries(this.budgets)
          .map((entry) => entry[1])
          .find((budget) => budget.isArchived)
      );
      const archivedBudgets = Object.entries(this.budgets)
        .map((entry) => entry[1])
        .filter((budget) => budget.isArchived);
      return archivedBudgets;
    },
    getUnarchivedBudgets(): IBudget[] {
      const archivedBudgets = Object.entries(this.budgets)
        .map((entry) => entry[1])
        .filter((budget) => !budget.isArchived);
      return archivedBudgets;
    },
  },
  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBudgetStore, import.meta.hot));
}
