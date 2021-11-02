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
    background: $main-purple;
    padding: 1em;
    font-family: 'HelveticaNowText-Medium', sans-serif;
    font-size: 1.5rem;
    border-radius: 40px;
    transition: 0.3s;
  }
  #button:hover:enabled {
    background: $main-purple-on-hover;
    transform: translateY(-5%);
  }
  #button:disabled {
    background-color: gray;
  }
</style>
