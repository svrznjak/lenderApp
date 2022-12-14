import { createRouter, createWebHistory, RouteLocationNormalized } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import BudgetsView from "@/views/Budget/BudgetsView.vue";
import BudgetAddView from "@/views/Budget/BudgetAddView.vue";
import BudgetSingleView from "@/views/Budget/BudgetSingleView.vue";
import LoansView from "@/views/Loan/LoansView.vue";
import LoanAddView from "@/views/Loan/LoanAddView.vue";
import LoanSingleView from "@/views/Loan/LoanSingleView.vue";
import AnalyticsView from "@/views/Analytics/AnalyticsView.vue";
import MyProfileView from "@/views/MyProfile/MyProfileView.vue";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/web/login" },
    {
      path: "/login",
      name: "login",
      component: LoginView,
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
      name: "budgetAdd",
      component: BudgetAddView,
      meta: { requiresAuth: true },
    },
    {
      path: "/budgets/:id",
      name: "budget",
      component: BudgetSingleView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/budgets/:id/edit",
      name: "budgetEdit",
      component: () => import("@/views/Budget/BudgetEditView.vue"),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/budgets/:id/addFunds",
      name: "budgetAddFunds",
      props: true,
      component: () => import("@/views/Budget/BudgetAddFundsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/budgets/:id/withdrawFunds",
      name: "budgetWithdrawFunds",
      props: true,
      component: () => import("@/views/Budget/BudgetWithdrawFundsView.vue"),
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
      name: "loanAdd",
      component: LoanAddView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/loans/:id",
      name: "loan",
      component: LoanSingleView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/loans/:id/addPayment",
      name: "loanAddPayment",
      props: true,
      component: () => import("@/views/Loan/LoanAddPaymentView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/loans/:id/add-manual-interest",
      name: "loanAddManualInterest",
      props: true,
      component: () => import("@/views/Loan/LoanAddManualInterestView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/loans/:id/edit",
      name: "loanEdit",
      props: true,
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
    {
      path: "/transaction/:id/edit",
      name: "transactionEdit",
      props: true,
      component: () => import("@/views/Transaction/EditTransactionView.vue"),
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior(to): any {
    const scroll: any = {};
    //if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = "smooth";
    return scroll;
  },
});

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  to.meta.transition = generateTransitionName(from, to);
  if (to.meta.requiresAuth && userStore.user === undefined) {
    return { name: "login", query: { redirectTo: to.path } };
  }
});

function generateTransitionName(from: RouteLocationNormalized, to: RouteLocationNormalized) {
  // console.log(from);
  // console.log(to);
  if (from.name === "budgets" && to.name === "budget") return "slide-left";
  else if (from.name === "budget" && to.name === "budgets") return "slide-right";
  else if (from.name === "budgets" && to.name === "budgetAdd") return "slide-up";
  else if (from.name === "budgetAdd" && to.name === "budgets") return "slide-down";
  else if (from.name === "budget" && to.name === "budgetEdit") return "slide-up";
  else if (from.name === "budgetEdit" && to.name === "budget") return "slide-down";
  else if (from.name === "budget" && to.name === "budgetAddFunds") return "slide-up";
  else if (from.name === "budgetAddFunds" && to.name === "budget") return "slide-down";
  else if (from.name === "budget" && to.name === "budgetWithdrawFunds") return "slide-up";
  else if (from.name === "budgetWithdrawFunds" && to.name === "budget") return "slide-down";
  else if (from.name === "loans" && to.name === "loanAdd") return "slide-up";
  else if (from.name === "loanAdd" && to.name === "loans") return "slide-down";
  else if (from.name === "loans" && to.name === "loan") return "slide-left";
  else if (from.name === "loan" && to.name === "loans") return "slide-right";
  else if (from.name === "loan" && to.name === "loanAddPayment") return "slide-up";
  else if (from.name === "loanAddPayment" && to.name === "loan") return "slide-down";
  else if (from.name === "loan" && to.name === "loanAddManualInterest") return "slide-up";
  else if (from.name === "loanAddManualInterest" && to.name === "loan") return "slide-down";
  else return "fade";
}

export default router;
