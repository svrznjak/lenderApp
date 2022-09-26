<script setup lang="ts">
import plusIcon from '@/assets/icons/plus.svg'
import menuIcon from '@/assets/icons/menu.svg'
import closeMenuIcon from '@/assets/icons/close.svg'
import type { MenuLink } from '@/types/MenuLink.js'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '@/components/AppButton.vue';
const props = defineProps({
  newButtonText: {
    type: String,
    required: true,
  },
  newButtonRouteName: {
    type: String,
    required: true,
  },
});

const router = useRouter()

const currentRouteName = router.currentRoute.value.name?.toString();

const menuLinks: MenuLink[] = [{
  id: 0, text: "Budgets", routeName: "budgets"
}, {
  id: 1, text: "Loans", routeName: "loans"
}, {
  id: 2, text: "Analytics", routeName: "analytics"
}, {
  id: 3, text: "My Profile", routeName: "my-profile"
}];

const isMenuOpen = ref(false);
function toggleMenu() {
  console.log(!isMenuOpen.value)
  isMenuOpen.value = !isMenuOpen.value;
}

const isClicked = ref(false);
function openNew() {
  isClicked.value = true;
  router.push({ name: props.newButtonRouteName });
}


</script>

<template id="menu-mobile">
  <div id="static-bottom-menu">
    <div class="devider"></div>
    <div class="add-new" :class="{ clicked: isClicked }" @click="openNew"><img :src="plusIcon" alt="+"
        style="margin-right: 15px;" />{{ newButtonText }}</div>
    <div class="toggle-menu" @click="toggleMenu"> <img style="width:22px;" :src="isMenuOpen ? closeMenuIcon : menuIcon"
        alt="Open menu" /></div>
  </div>
  <div id="drawer-bottom-menu" :class="{ open: isMenuOpen }">
    <AppButton class="custom-button" :class="currentRouteName===routeName? 'active' : 'inactive'"
      :disabled="currentRouteName===routeName" v-for="{id, text, routeName} in menuLinks" :key="id"
      @click="() => router.push({ name: routeName})">{{text}}</AppButton>
  </div>
</template>

<style scoped>
#static-bottom-menu {
  position: fixed;
  width: 100%;
  left: 0px;
  bottom: 0px;
  z-index: 9999;
  color: #fff;
  height: 60px;
  background-color: var(--primaryColor);
}

.add-new {
  height: 100%;
  float: left;
  display: flex;
  align-items: center;
  max-width: fit-content;
  padding: 0px 30px 0px 20px;
  font-family: BasierCircle;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--primaryColorHover);
  }
}

.add-new.clicked {
  background-color: var(--primaryColorHover);
}

.toggle-menu {
  height: 100%;
  float: right;
  display: flex;
  align-items: center;
  max-width: fit-content;
  padding: 0px 20px 0px 50px;
  font-family: BasierCircle;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

#drawer-bottom-menu {
  position: fixed;
  width: 100%;
  left: 0px;
  bottom: 60px;
  z-index: 9998;
  transition: all 0.6s;
  transform: translate(0px, 100%);
  color: #fff;
  background-color: var(--primaryColor);
}

#drawer-bottom-menu.open {
  transform: translate(0px, 0%) !important;
}

.custom-button {
  text-align: left;
  padding: 20px;
  height: 80px;
  width: 100% !important;
  margin: 0px !important;
  border-radius: 0px !important;

  &.active {
    background-color: var(--primaryColorHover);
  }
}

.devider {
  height: 2px;
  width: calc(100% - 40px);
  margin: auto;
  background-color: #4470A1;
}

/*@media only screen and (min-width: 769px)  {
 *{
  display:none;
 }
}*/
</style>