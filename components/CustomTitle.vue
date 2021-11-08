<template>
  <div>
    <h1 id="title" :style="
      'font-size:'+ (fontSize ? fontSize : 5) + 'rem; ' +
      'margin-bottom:'+ (marginBottom ? marginBottom : 4) + 'rem;'
    ">
      <BackArrow :back-icon-click="backIconClick" :back-message="backMessage" />
      {{ title }}
    </h1>
  </div>
</template>

<script>
import BackArrow from "./BackArrow";
export default {
  name: "CustomTitle",
  components: {BackArrow},
  props: ['title', 'backIconClick', 'backMessage', 'color', 'fontSize', 'marginBottom']
}
</script>

<style scoped lang="scss">
  #title {
    color: black;
    font-family: 'HelveticaNowText-Medium', sans-serif;
  }
  #icon {
    margin-right: 2em;
    transition: 0.3s;
  }
  #icon:hover {
    transform: translateX(-20%);
  }
</style>
