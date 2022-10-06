<script setup lang="ts">
import TheHeaderMain from './parts/TheHeaderMain.vue';
import AppButton from '@/components/AppButton.vue';
import AppFormField from '@/components/AppFormField.vue';
import { reactive, ref } from 'vue';

import { useUserStore } from "@/stores/user";

import ContentContainer from './parts/ContentContainer.vue';
import AppPopup from '@/components/AppPopup.vue';
import AppLoading from '@/components/AppLoading.vue';
import ScrollArea from './parts/ScrollArea.vue';
import router from '@/router';
import { useI18n } from 'vue-i18n';
import messages from './LoginView.i18n.json';
const { t, locale } = useI18n({
  messages
});

const userStore = useUserStore();


const form = reactive({
  email: '',
  password: '',

})
const showPopup = ref(false);
const isLoading = ref(false);
const isSuccess = ref(false);
const loginError = ref('');
const userName = ref('');
async function login() {
  //isSuccess.value = true;
  showPopup.value = true;
  isLoading.value = true;

  try {
    const result = await userStore.loginWithEmailAndPassword(form.email, form.password);
    console.log(result);
    await userStore.getUserData();
    locale.value = userStore.user!.language;
    isLoading.value = false;
    isSuccess.value = true;
    userName.value = userStore.user!.name;

  } catch (err: any) {
    isLoading.value = false;
    console.log(JSON.stringify(err));
    if (err.code === "auth/wrong-password") loginError.value = t("incorrect-password");
    else if (err.code === "auth/user-not-found") loginError.value = t("incorrect-password");
    else if (err.code === "auth/network-request-failed") loginError.value = t("network-error");
    else if (err.code === "auth/too-many-requests") loginError.value = t("too-many-requests");
    else loginError.value = t("login-failed");
  }
}

function closePopup() {
  showPopup.value = false;
  isLoading.value = false;
  isSuccess.value = false;
  loginError.value = '';
}


function enterApp() {
  if (router.currentRoute.value.query.redirectTo) router.push({ path: router.currentRoute.value.query.redirectTo as string });
  else router.push({ name: 'budgets' });
}

</script>

<template>
  <main>
    <AppPopup :isOpen="showPopup">
      <ContentContainer>
        <div v-show=" isLoading">
          <AppLoading />
          <h1 style="text-align: center;">{{t('logging-in')}}</h1>
        </div>
        <div v-if="isSuccess">
          <h1 style="text-align: center;">{{t('welcome-back')}}, {{userName}}!</h1>
          <AppButton style="margin-top:20px;" @click="enterApp">{{t('open-app')}}</AppButton>
        </div>
        <div v-if="loginError">
          <h1 style="text-align: center;">{{loginError}}</h1>
          <AppButton styleType="empty" style="margin-top:20px;" @click="closePopup">{{t('try-again')}}</AppButton>
        </div>
      </ContentContainer>
    </AppPopup>
    <ScrollArea>
      <ContentContainer>
        <TheHeaderMain style="text-align:center; margin-bottom: 40px;">{{t('login')}}</TheHeaderMain>
        <VeeForm @submit="login">
          <AppFormField name="email" :label="t('e-mail')" v-model="form.email" type="e-mail" autocomplete="e-mail"
            rules="required|email" />
          <AppFormField name="password" :label="t('password')" v-model="form.password" type="password"
            autocomplete="password" rules="required" />
          <AppButton type="submit">{{t('login')}}</AppButton>

        </VeeForm>
        <AppButton @click="router.push({name: 'Register'})" styleType="empty">
          {{t('create-account')}}</AppButton>
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