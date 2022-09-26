<script setup lang="ts">
import TheHeaderEdit from '@/views/parts/TheHeaderEdit.vue';
import messages from './BudgetAddView.i18n.json';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import ContentContainer from '../parts/ContentContainer.vue';
import { reactive } from 'vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
const { t, locale } = useI18n({
  messages
});
const userStore = useUserStore();
locale.value = userStore.user.language;

const form = reactive({
  name: '',
  description: '',
  typeOfInterestRate: 'percentage-per-duration',
  percentage: 5,
  duration: 'YEAR',
  initialFunds: 0
})


function createNewBudget() {
  console.log(form);
}

</script>

<template>
  <main>
    <TheHeaderEdit :closeText="t('are-you-sure')">{{ t('creating-new-budget')}}</TheHeaderEdit>
    <ContentContainer>
      <VeeForm @submit="createNewBudget">
        <h2>{{t('info-about-new-budget')}}</h2>
        <AppFormField name="name" :label="t('name')" v-model="form.name" type="text" rules="required" />
        <AppFormField as="textarea" name="description" :label="t('description')" v-model="form.description" type="text"
          rules="required" />
        <h2>{{t('define-default-interest-rate')}}</h2>
        <AppFormField as="select" name="typeOfInterestRate" :label="t('typeOfInterestRate')"
          v-model="form.typeOfInterestRate" rules="required">
          <option value="percentage-per-duration">Percentage per duration</option>
          <option value="fixed-per-duration">Fixed per duration</option>
        </AppFormField>
        <AppFormField name="percentage" :label="t('percentage')" v-model.number="form.percentage" type="number"
          rules="required" />
        <AppFormField as="select" name="duration" :label="t('duration')" v-model="form.duration" rules="required">
          <option value="DAY">Day</option>
          <option value="WEEK">Week</option>
          <option value="MONTH">Month</option>
          <option value="YEAR">Year</option>
          <option value="FULL_DURATION">Full duration</option>
        </AppFormField>
        <h2>{{t('set-initial-funds-for-this-budget')}}</h2>
        <AppFormField name="initial-funds" :label="t('initial-funds')" v-model.number="form.initialFunds" type="number"
          rules="required" />
        <AppButton type="submit">{{t('create-new-budget')}}</AppButton>
      </VeeForm>

    </ContentContainer>
  </main>
</template>