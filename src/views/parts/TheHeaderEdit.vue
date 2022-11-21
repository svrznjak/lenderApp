<script setup lang="ts">
import closeIcon from '@/assets/icons/close.svg';
import router from '@/router';
import AppPopup from '@/components/AppPopup.vue';
import { reactive } from 'vue';
import AppButton from '@/components/AppButton.vue';
import ContentContainer from '../parts/ContentContainer.vue';
import messages from './TheHeaderEdit.i18n.json';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({
  messages
});

defineProps({
  closeText: {
    type: String,
  },
});


const popupState = reactive({
  isDisplayed: false,
});


function openClosePopup() {
  popupState.isDisplayed = true;
}
function closeClosePopup() {
  popupState.isDisplayed = false;
}

function closeView() {
  router.back()
}


</script>

<template>
  <AppPopup :isOpen="popupState.isDisplayed">
    <ContentContainer>
      <h1 style="text-align: center;">{{ closeText }}</h1>
      <AppButton @click="closeView">{{ t('yes') }}</AppButton>
      <AppButton @click="closeClosePopup" styleType="empty">{{ t('no') }}</AppButton>
    </ContentContainer>
  </AppPopup>

  <div id="header-edit">
    <div id="header-back-button" @click="openClosePopup">
      <img :src="closeIcon" alt="+" style="margin-right: 28px; width: 25px; height: 25px; margin-top:1px;" />
      <h1>
        <slot></slot>
      </h1>
    </div>
  </div>
</template>

<style scoped>
#header-edit {
  background-color: var(--primaryColor);
  color: #fff;
}

#header-back-button {
  width: fit-content;
  padding: 0px 30px;
  min-height: 107px;
  display: flex;
  cursor: pointer;
  align-items: center;
}
</style>
