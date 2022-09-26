<script setup lang="ts">
defineProps({
  styleType:{
    type: String,
    default: 'regular',
    validator(value:string) {
      // The value must match one of these strings
      return ['regular', 'empty', 'clean'].includes(value)
    }
  },
})
</script>

<template>
<button :class=styleType><slot></slot></button>
</template>

<style scoped>
button {
  width: 100%;
  border: none;
  background-color: unset;
  height: 50px;
}
button.regular, button.empty {
  border-radius: 5px;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  transition: all 0.2s;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  &:active{
    width:99%;
    margin-left:0.5%;
  }
}

@media only screen and (max-width: 768px)  {

button.regular, button.empty {
  &:hover{
    width:99%;
    margin-left:0.5%;
  }
}


}
button.regular{
  background-color: var(--primaryColor);
  color: #fff;


 &:hover{
  background-color: var(--primaryColorHover) ;
 }
}
button.empty{
  border: 2px solid var(--primaryColor);
  color: var(--primaryColor);
  &:hover{
    color: var(--primaryColorHover);
    border-color: var(--primaryColorHover);
  }
}

button.clean{
  color: var(--primaryColor);
  font-size: 14px;
  font-weight: 400;
  text-decoration-line: underline;
  &:hover{
    color: var(--primaryColorHover);
  }
}
</style>