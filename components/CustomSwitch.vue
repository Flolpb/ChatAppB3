<template>
  <v-container
    class="px-0"
    fluid
  >
    <v-row class="sub-row" align="center">
      <v-switch
        v-model="value"
        @change="onChange"
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
  data() {
    return {
      value: this.initialValue
    }
  },
  mounted() {
    this.value = this.initialValue
  },
  methods: {
    onChange() {
      this.$emit('update', this.name, this.value)
    }
  }
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
