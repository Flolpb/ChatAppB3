<template>
  <v-container fill-height fluid class="container">
    <v-row align="center" justify="center" class="row">
      <v-col cols="4">
        <h1> Testeeeeee </h1>
      </v-col>
      <v-col cols="8">
        <h1> Testeeeeee </h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "auth",
  middleware: 'connect'
}
</script>

<style scoped lang="scss">
  .container {
    width: 80vw;
  }
  .row {
    min-height: 90vh;
    background: #EDE3E8;
    box-sizing: border-box;
    border-radius: 90px;
  }
</style>
