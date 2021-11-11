<template>
  <v-container
    class="px-0"
    fluid
  >
    <v-row class="sub-row" align="center">
      <v-switch
        v-model="value"
        inset
      ></v-switch>
      <p class="custom-text">{{ label }}</p>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CustomSwitch",
  props: ['name', 'initialValue', 'label'],
  computed: {
    value: {
      get() {
        return this.initialValue
      },
      set(value) {
        this.$emit('update', this.name, value)
      }
    }
  },
}
</script>

<style scoped lang="scss">
  .sub-row {
    min-height: 0;
  }
  .custom-text {
    color: black;
    font-family: 'HelveticaNowText-Medium', sans-serif;
    font-size: 1.5rem;
    margin: 0;
  }
</style>
