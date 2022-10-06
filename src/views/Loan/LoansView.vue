<script setup lang="ts">

import MenuMobile from '@/views/parts/TheMenuMobile.vue';
import HeaderMain from '@/views/parts/TheHeaderMain.vue';
import ScrollArea from '../parts/ScrollArea.vue';
import messages from './LoansView.i18n.json';
import { useUserStore } from '@/stores/user';
import { useI18n } from 'vue-i18n';
import router from '@/router';
import ContentContainer from '../parts/ContentContainer.vue';
import AppCard from '@/components/AppCard.vue';
import AppCurrencyNumber from '@/components/AppCurrencyNumber.vue';
import AppDate from '@/components/AppDate.vue';
import { useLoanStore } from '@/stores/loan';
import { onMounted } from 'vue';
const { t, locale } = useI18n({
  messages
});

const loanStore = useLoanStore();
const userStore = useUserStore();
locale.value = userStore.user!.language;

onMounted(async () => await loanStore.syncLoans())
</script>

<template>
  <main>
    <HeaderMain>{{t('loans')}}</HeaderMain>
    <ScrollArea :saveScrollTop="true">
      <ContentContainer>
        <AppCard :hasArrow="true" @click="()=>router.push({name: 'loan', params:{id: loan._id}})"
          v-for="loan in loanStore.loans" :key="loan._id">
          <h2>{{ loan.name}}</h2>
          <div style="margin-top:20px; display:flex;">
            <h4 style="padding: 3px 5px 0px 0px;">{{t('loan-amount')}}:</h4>
            <h3>
              <AppCurrencyNumber :amount="loan.initialPrincipal" :currency="userStore.user!.currency"
                :locale="userStore.user!.language" />
            </h3>
          </div>
          <div style="margin-top:10px; display:flex;">
            <h4 style="padding: 3px 5px 0px 0px;">{{t('paid-principal')}}:</h4>
            <h3>
              <AppCurrencyNumber :amount="loan.calculatedTotalPaidPrincipal" :currency="userStore.user!.currency"
                :locale="userStore.user!.language" />
            </h3>
          </div>
          <div style="margin-top:10px; display:flex;">
            <h4 style="padding: 3px 5px 0px 0px;">{{t('paid-interest')}}:</h4>
            <h3>
              <AppCurrencyNumber :amount="loan.calculatedPaidInterest" :currency="userStore.user!.currency"
                :locale="userStore.user!.language" />
            </h3>
          </div>
          <div style="margin-top:10px; display:flex;">
            <h4 style="padding: 3px 5px 0px 0px;">{{t('remaining-principal')}}:</h4>
            <h3>
              <AppCurrencyNumber :amount="loan.initialPrincipal - loan.calculatedTotalPaidPrincipal"
                :currency="userStore.user!.currency" :locale="userStore.user!.language" />
            </h3>
          </div>
          <div style="margin-top:10px; display:flex;">
            <h4 style="padding: 3px 5px 0px 0px;">{{t('due-date')}}:</h4>
            <h3>
              <AppDate :timestamp="loan.closesTimestamp" :currency="userStore.user!.currency"
                :locale="userStore.user!.language" />
            </h3>
          </div>
        </AppCard>
      </ContentContainer>
    </ScrollArea>
    <MenuMobile :newButtonText="t('new-loan')" newButtonRouteName="loanAdd" />
  </main>
</template>