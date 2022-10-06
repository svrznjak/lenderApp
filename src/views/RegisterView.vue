<script setup lang="ts">
import { setLocale } from "@vee-validate/i18n";
import { useI18n } from 'vue-i18n';
import TheHeaderMain from './parts/TheHeaderMain.vue';
import AppButton from '@/components/AppButton.vue';
import AppFormField from '@/components/AppFormField.vue';
import AppLoading from "@/components/AppLoading.vue";
import AppPopup from "@/components/AppPopup.vue";
import { reactive, watch } from 'vue';
import ContentContainer from "./parts/ContentContainer.vue";
import ScrollArea from './parts/ScrollArea.vue';
import router from '@/router';
import { useUserStore } from "@/stores/user";

import currencies from '@/data/currencies.json';
import locales from '@/data/locales.json';

import messages from './RegisterView.i18n.json';
const { t, locale } = useI18n({
  messages
});

const userStore = useUserStore();

const popupState = reactive({
  showPopup: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessageForRegistration: '',
  errorMessageForLogin: ''
});

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordRepeat: '',
  currency: 'USD',
  language: 'en-US',
})
watch(
  () => form.language,
  (language) => {
    setLocale(language);
    locale.value = language;
  }
);

async function register() {
  console.log(form);
  popupState.showPopup = true;
  popupState.isLoading = true;

  try {
    const createAccountResponse = await userStore.createAccount({ ...form });
    popupState.errorMessageForRegistration = t("account-created");

    try {
      const loginResponse = await userStore.loginWithEmailAndPassword(form.email, form.password);
      await userStore.getUserData(loginResponse.user.accessToken);

      popupState.isLoading = false;
      popupState.isSuccess = true;

    } catch (err: any) {
      popupState.isLoading = false;
      popupState.isError = true;
      console.log(err);
      if (err.code === "auth/wrong-password") popupState.errorMessageForLogin = t("incorrect-password");
      else if (err.code === "auth/network-request-failed") popupState.errorMessageForLogin = t("network-error");
      else if (err.code === "auth/too-many-requests") popupState.errorMessageForLogin = t("too-many-requests");
      else popupState.errorMessageForLogin = t("login-failed");
    }
  } catch (err: any) {
    popupState.isLoading = false;
    popupState.isError = true;
    console.log(err.message);
    if (err.message === "Error: The email address is already in use by another account.") popupState.errorMessageForRegistration = t("already-exists");
    else popupState.errorMessageForRegistration = t("registration-failed");
  }
}

function closePopup() {
  // If account was created but login failed
  if (popupState.errorMessageForRegistration !== '' && popupState.errorMessageForLogin !== '') {
    router.push({ name: 'login' });
  }

  // Default popup
  popupState.showPopup = false;
  popupState.isLoading = false;
  popupState.isSuccess = false;
  popupState.isError = false;
  popupState.errorMessageForLogin = '';
  popupState.errorMessageForRegistration = ''
}

function enterApp() {
  router.push({ name: 'budgets' });
}

</script>

<template>
  <main>
    <AppPopup :isOpen="popupState.showPopup">
      <div v-show="popupState.isLoading">
        <AppLoading />
        <h1 style="text-align: center;">{{t('creating-account')}}</h1>
      </div>
      <div v-if="popupState.isSuccess">
        <h1 style="text-align: center;">{{t('account-created', [userStore.user.name])}}!</h1>
        <AppButton style="margin-top:20px;" @click="enterApp">{{t('open-app')}}</AppButton>
      </div>
      <div v-if="popupState.isError">
        <h1 style="text-align: center;">{{popupState.errorMessageForRegistration}}</h1>
        <h1 style="text-align: center;">{{popupState.errorMessageForLogin}}</h1>
        <AppButton styleType="empty" style="margin-top:20px;" @click="closePopup">{{t('try-again')}}</AppButton>
      </div>
    </AppPopup>
    <ScrollArea>
      <ContentContainer>
        <TheHeaderMain style="text-align:center; margin-bottom: 40px;">{{t('create-new-account')}}</TheHeaderMain>
        <VeeForm @submit="register">
          <AppFormField name="name" :label="t('name')" v-model="form.name" rules="required" />
          <AppFormField name="email" :label="t('e-mail')" v-model="form.email" type="e-mail" rules="required|email" />
          <AppFormField name="password" :label="t('password')" v-model="form.password" type="password"
            rules="required|min:6" />
          <AppFormField name="password-repeat" :label="t('password-repeat')" v-model="form.passwordRepeat"
            type="password" rules="required|confirmed:@password" />
          <AppFormField as="select" name="currency" :label="t('currency')" v-model="form.currency" rules="required">
            <option v-for="currency,index in currencies" :value="index">{{currency.name}} ({{currency.symbol_native}})
            </option>
          </AppFormField>
          <AppFormField as="select" name="language" :label="t('language')" v-model="form.language" rules="required">
            <option v-for="locale,index in locales" :value="index">{{locale[0]}}</option>
          </AppFormField>

          <AppButton type="submit">{{t('create-account')}}</AppButton>
        </VeeForm>
        <AppButton @click="$router.push({name: 'login'})" styleType="empty">
          {{t('login')}}</AppButton>
      </ContentContainer>
    </ScrollArea>
  </main>
</template>

<style scoped>
main {
  max-width: 600px;
  margin: auto;

  & * {
    margin-bottom: 10px;
  }
}
</style>