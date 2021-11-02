<template>
  <h1 id="title">{{ title }}</h1>
</template>

<script>
export default {
  name: "CustomTitle",
  props: ['title']
}
</script>

<style scoped lang="scss">
  #title {
    color: black;
    font-family: 'HelveticaNowText-Medium', sans-serif;
    font-size: 5rem;
    margin-bottom: 4rem;
  }
</style>
