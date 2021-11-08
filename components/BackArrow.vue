<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        v-if="backIconClick"
        v-bind="attrs"
        v-on="on"
        id="icon"
        @click="backIconClick"
        :color="color ? color: 'black'"
        x-large
      >mdi-keyboard-backspace
      </v-icon>
    </template>
    <span>{{ backMessage }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "BackArrow",
  props: ['backIconClick', 'backMessage', 'color']
}
</script>

<style scoped>
  #icon {
    transition: 0.3s;
  }
  #icon:hover {
    transform: translateX(-20%);
  }
</style>
