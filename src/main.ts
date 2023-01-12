import { useUserStore } from "@/stores/user";
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "@/config/firebaseConfig.js";

import { isNative } from "./helpers/deviceInfo.js";
import nativeAppBoot from "./nativeAppBoot.js";
(async () => {
  if (await isNative()) nativeAppBoot();
})();

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
logEvent(analytics, "App started");

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import "./main.css";

// Stores
// Plugins
import VeeValidatePlugin from "./plugins/VeeValidatePlugin";

// Components
import AppButton from "./components/AppButton.vue";

const app = createApp(App);
const pinia = createPinia();

app.component("AppButton", AppButton);
app.use(pinia);
const userStore = useUserStore();
//const user = await new Promise((resolve) => {
const auth = getAuth();
onAuthStateChanged(auth, async function (user: any) {
  if (user) {
    //if (router.currentRoute.value.query.redirectTo) router.push({ path: router.currentRoute.value.query.redirectTo });
    //else {
    //  router.push({ name: "budgets" });
    //}
    //resolve(user);
  } else {
    userStore.user = undefined;
    if (router.currentRoute.value.name !== "login") router.push({ name: "login" });
    //resolve(null);
  }
});
//});

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: "en", // set locale
  fallbackLocale: "en", // set fallback locale
  fallbackWarn: false,
  missingWarn: false,
  messages: {
    // global translations
    sl: {
      app_name: "Lender App",
    },
  },
  numberFormats: {
    en: {
      currency: {
        style: "currency",
        currency: "USD",
      },
    },
    "lv-LV": {
      currency: {
        style: "currency",
        currency: "eur",
      },
    },
    sl: {
      currency: {
        style: "currency",
        currency: "EUR",
      },
    },
  },
});
app.use(i18n);
app.use(VeeValidatePlugin);
app.use(router);
app.mount("#app");
