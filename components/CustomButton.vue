<template>
  <button type="button" id="button" @click="buttonClick" :disabled="disabled">{{ title }}</button>
</template>

<script>
export default {
  name: "CustomButton",
  props: ['title', 'buttonClick', 'disabled'],
}
</script>

<style scoped lang="scss">
  #button {
    background: #272753;
    padding: 1em;
    font-family: 'HelveticaNowText-Medium', sans-serif;
    font-size: 1.5rem;
    border-radius: 40px;
    transition: 0.3s;
  }
  #button:hover:enabled {
    background: rgba(39,39,83,0.8);
    transform: translateY(-5%);
  }
  #button:disabled {
    background-color: gray;
  }
</style>
