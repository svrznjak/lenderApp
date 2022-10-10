import { acceptHMRUpdate, defineStore } from "pinia";
import { gql } from "graphql-request";
import requestBackend from "./helpers/requestBackend";
import { IInterestRate } from "@/types/interestRateInterface";
import { ILoan } from "@/types/loanInterface";
import IFund from "@/types/fundInterface";

export const useLoanStore = defineStore("LoanStore", {
  state: () => ({ loans: [] as ILoan[], isFetching: false as boolean }),
  actions: {
    async syncLoans() {
      const query = gql`
        query {
          Loan {
            loans {
              _id
              name
              description
              notes {
                _id
                content
                entryTimestamp
              }
              openedTimestamp
              closesTimestamp
              interestRate {
                type
                duration
                amount
                entryTimestamp
              }
              initialPrincipal
              status
              calculatedTotalPaidPrincipal
              calculatedChargedInterest
              calculatedPaidInterest
            }
          }
        }
      `;
      try {
        this.isFetching = true;
        this.loans = (await requestBackend({ gql: query })).Loan.loans;
        this.isFetching = false;
      } catch (err: any) {
        console.log(err);
        throw new Error(err);
      }
    },

    async createLoan({
      name,
      description,
      openedTimestamp,
      closesTimestamp,
      interestRate,
      initialTransactionDescription,
      funds,
    }: {
      name: string;
      description: string;
      openedTimestamp: number;
      closesTimestamp: number;
      interestRate: Pick<IInterestRate, "type" | "duration" | "expectedPayments" | "amount" | "isCompounding">;
      initialTransactionDescription: string;
      funds: IFund[];
    }): Promise<ILoan> {
      const variables = {
        name,
        description,
        openedTimestamp,
        closesTimestamp,
        type: interestRate.type,
        duration: interestRate.duration,
        expectedPayments: interestRate.expectedPayments,
        amount: interestRate.amount,
        isCompounding: interestRate.isCompounding,
        initialTransactionDescription,
        funds,
      };

      console.log(variables);
      const query = gql`
        mutation (
          $name: String!
          $description: String!
          $openedTimestamp: Float!
          $closesTimestamp: Float!
          $type: DurationTypeInput!
          $duration: DurationInput!
          $expectedPayments: expectedPaymentsInputType!
          $amount: Int!
          $isCompounding: Boolean!
          $initialTransactionDescription: String!
          $funds: [FundInputType]
        ) {
          Loan {
            createLoan(
              name: $name
              description: $description
              openedTimestamp: $openedTimestamp
              closesTimestamp: $closesTimestamp
              interestRate: {
                type: $type
                duration: $duration
                expectedPayments: $expectedPayments
                amount: $amount
                isCompounding: $isCompounding
              }
              initialTransactionDescription: $initialTransactionDescription
              funds: $funds
            ) {
              _id
              name
              description
              openedTimestamp
              closesTimestamp
              initialPrincipal
              interestRate {
                type
                duration
                expectedPayments
                amount
                isCompounding
                entryTimestamp
              }
              status
              calculatedTotalPaidPrincipal
              calculatedChargedInterest
              calculatedPaidInterest
            }
          }
        }
      `;
      const createdLoan = (await requestBackend({ gql: query, variables })).Loan.createLoan;
      this.loans.push(createdLoan);
      return createdLoan;
    },

    async addPaymentToLoan({
      loanId,
      budgetId,
      description,
      transactionTimestamp,
      amount,
    }: {
      loanId: string;
      budgetId: string;
      description: string;
      transactionTimestamp: number;
      amount: number;
    }): Promise<ILoan> {
      const variables = {
        loanId,
        budgetId,
        description,
        transactionTimestamp,
        amount,
      };
      const query = gql`
        mutation ($loanId: ID!, $budgetId: ID!, $description: String!, $transactionTimestamp: Float!, $amount: Float!) {
          Loan {
            addPayment(
              loanId: $loanId
              budgetId: $budgetId
              description: $description
              transactionTimestamp: $transactionTimestamp
              amount: $amount
            ) {
              _id
            }
          }
        }
      `;
      const updatedLoan = (await requestBackend({ gql: query, variables })).Loan.addPayment;
      console.log(updatedLoan);
      for (let i = 0; i < this.loans.length; i++) {
        if (this.loans[i]._id === updatedLoan._id) {
          this.loans[i] = updatedLoan;
        }
      }
      return updatedLoan;
    },
    async addManualInterestRate({
      loanId,
      description,
      transactionTimestamp,
      amount,
    }: {
      loanId: string;
      description: string;
      transactionTimestamp: number;
      amount: number;
    }): Promise<ILoan> {
      const variables = {
        loanId,
        description,
        transactionTimestamp,
        amount,
      };
      const query = gql`
        mutation ($loanId: ID!, $description: String!, $transactionTimestamp: Float!, $amount: Float!) {
          Loan {
            addManualInterest(
              loanId: $loanId
              description: $description
              transactionTimestamp: $transactionTimestamp
              amount: $amount
            ) {
              _id
            }
          }
        }
      `;
      const newTransaction = (await requestBackend({ gql: query, variables })).Loan.addManualInterest;
      console.log(newTransaction);
      return newTransaction;
    },
    getLoanById(loanId: string) {
      return this.loans.find((loan) => loanId === loan._id);
    },
  },
  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoanStore, import.meta.hot));
}
