import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import BudgetsView from "@/views/Budget/BudgetsView.vue";
import LoansView from "@/views/Loan/LoansView.vue";
import AnalyticsView from "@/views/Analytics/AnalyticsView.vue";
import MyProfileView from "@/views/MyProfile/MyProfileView.vue";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        console.log(userStore.user);
        if (userStore.user !== undefined) {
          next({
            name: "budgets",
            // preserve existing query and hash
          });
        } else next();
      },
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        if (userStore.user !== undefined) {
          next({
            name: "budgets",
            // preserve existing query and hash
          });
        } else next();
      },
    },
    {
      path: "/budgets",
      name: "budgets",
      component: BudgetsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/budgets/add",
      name: "budget-add",
      component: () => import("@/views/Budget/BudgetAddView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/budgets/:id",
      name: "budget",
      component: () => import("@/views/Budget/BudgetSingleView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/budgets/:id/edit",
      name: "budgetEdit",
      component: () => import("@/views/Budget/BudgetEditView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/loans",
      name: "loans",
      component: LoansView,
      meta: { requiresAuth: true },
    },
    {
      path: "/loans/add",
      name: "loansAdd",
      component: () => import("@/views/Loan/LoanAddView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/loans/:id",
      name: "loan",
      component: () => import("@/views/Loan/LoanSingleView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/loans/:id/edit",
      name: "loanEdit",
      component: () => import("@/views/Loan/LoanEditView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/analytics",
      name: "analytics",
      component: AnalyticsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/my-profile",
      name: "my-profile",
      component: MyProfileView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && userStore.user === undefined) {
    return { name: "login", query: { redirectTo: to.path } };
  }
});

export default router;
