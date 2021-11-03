<template>
      <v-icon
        large
        @click="home"
      >
        mdi-chevron-left
      </v-icon>
</template>

<script>
  export default {
    methods: {
      home () {
        this.$router.push("/planets");
      },
    },
  }
</script>