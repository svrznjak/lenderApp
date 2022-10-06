import { acceptHMRUpdate, defineStore } from "pinia";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { gql } from "graphql-request";
import requestBackend from "./helpers/requestBackend";
import { IUser } from "@/types/userInterface";

export const useUserStore = defineStore("UserStore", {
  state: () => ({ user: undefined as IUser | undefined }),
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
    async getUserData() {
      const query = gql`
        query {
          User {
            user {
              _id
              name
              email
              authId
              language
              currency
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
        };
      } catch (err: any) {
        console.log(err);
        throw new Error(err);
      }
    },
  },
  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
