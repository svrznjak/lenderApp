import { IInterestRate } from "./../types/interestRateInterface";
import { acceptHMRUpdate, defineStore } from "pinia";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { gql } from "graphql-request";
import requestBackend from "./helpers/requestBackend";
import { IBudget } from "@/types/budgetInterface";

export const useUserStore = defineStore("UserStore", {
  state: () => ({ user: undefined as Object | undefined }),
  actions: {
    async createAccount(variables: {
      name: string;
      email: string;
      password: string;
      currency: string;
      language: string;
    }) {
      const mutation = gql`
        mutation ($name: String!, $email: String!, $password: String!, $currency: String!, $language: String!) {
          User {
            createUser(name: $name, email: $email, password: $password, currency: $currency, language: $language) {
              _id
              name
            }
          }
        }
      `;
      return await requestBackend({ gql: mutation, variables });
    },
    async loginWithEmailAndPassword(email: string, password: string) {
      const auth: any = getAuth();
      return await signInWithEmailAndPassword(auth, email, password);
    },
    async logout() {
      const auth: any = getAuth();
      await signOut(auth);
    },
    async getUserData(accessToken: string) {
      const query = gql`
        query {
          User {
            user {
              _id
              name
              email
              authId
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
              currency
              language
              subscription {
                revenuecatId
                type
              }
            }
          }
        }
      `;
      try {
        const response = (await requestBackend({ gql: query })).User.user;
        this.user = {
          _id: response._id,
          name: response.name,
          email: response.email,
          authId: response.authId,
          currency: response.currency,
          language: response.language,
          subscription: response.subscription,
          budgets: response.budgets,
          loans: response.loans,
        };
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
      defaultInterestRate: Pick<IInterestRate, "type" | "duration" | "amount">;
      initialTransactionDescription: string;
      initialAmount: number;
    }): Promise<IBudget> {
      const variables = {
        name,
        description,
        type: defaultInterestRate.type,
        duration: defaultInterestRate.duration,
        amount: defaultInterestRate.amount,
        initialTransactionDescription,
        initialAmount,
      };

      const query = gql`
        mutation (
          $name: String!
          $description: String!
          $type: DurationTypeInput!
          $duration: DurationInput!
          $amount: Int!
          $initialAmount: Int!
          $initialTransactionDescription: String!
        ) {
          User {
            createBudget(
              name: $name
              description: $description
              defaultInterestRate: { type: $type, duration: $duration, amount: $amount }
              initialAmount: $initialAmount
              initialTransactionDescription: $initialTransactionDescription
            ) {
              _id
              name
              description
            }
          }
        }
      `;
      return await requestBackend({ gql: query, variables });
    },
  },
  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
