<script setup lang="ts">
import MenuMobile from '@/views/parts/TheMenuMobile.vue';
import HeaderEdit from '@/views/parts/TheHeaderEdit.vue';
</script>

<template>
  <HeaderEdit>New budget</HeaderEdit>
  <main style="padding:2%; max-width: 800px;margin:auto;">
    <MenuMobile />
    <h1>This is h1 text</h1>
    <h2>This is h2 text</h2>
    <h3>This is h3 text</h3>
    <h4>This is h4 text</h4>
    <p>This is paragraph.
      And this is new line in paragraph!
    </p>
    <label for="my-input">This is text input</label>
    <input type="text" id="my-input" name="my-input" />

    <label for="my-textarea">This is textarea input</label>
    <textarea id="my-textarea" name="my-textarea" rows="4"></textarea>

    <label for="my-date">This is date input</label>
    <input type="date" id="my-date" name="my-date" :value="new Date().toISOString().slice(0,10)" />

    <label for="select">This is select</label>
    <select name="select" id="select">
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="mercedes">Mercedes</option>
      <option value="audi">Audi</option>
    </select>

    <AppButton>My Button</AppButton>
    <AppButton styleType="empty">My Button</AppButton>
    <AppButton styleType="clean">My Button</AppButton>
    
  </main>
</template>

<style lang="postcss" scoped>
  * {
    margin-bottom: 25px;
  }

</style>