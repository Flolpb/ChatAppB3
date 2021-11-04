<template>
  <div>
    <h1 id="title">

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-if="backIconClick"
            v-bind="attrs"
            v-on="on"
            id="icon"
            @click="backIconClick"
            color="black"
            x-large
          >mdi-keyboard-backspace
          </v-icon>
        </template>
        <span>{{ backMessage }}</span>
      </v-tooltip>
      {{ title }}
    </h1>
  </div>
</template>

<script>
export default {
  name: "CustomTitle",
  props: ['title', 'backIconClick', 'backMessage']
}
</script>

<style scoped lang="scss">
  #title {
    color: black;
    font-family: 'HelveticaNowText-Medium', sans-serif;
    font-size: 5rem;
    margin-bottom: 4rem;
  }
  #icon {
    margin-right: 2em;
    transition: 0.3s;
  }
  #icon:hover {
    transform: translateX(-20%);
  }
</style>
