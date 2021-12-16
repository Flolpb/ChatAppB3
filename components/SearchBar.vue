<template> 
  <div>
    <v-list-tile-avatar>
      <img style="margin-left: 4px; margin-right: 4px; margin-top: 4px;border-radius: 50%; height: 2rem;" :src="photoURL">
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>{{username}}</v-list-tile-title>
    </v-list-tile-content>
  </div>
</template>

<script>
export default ({
    props: [
        "username",
        "photoURL",
    ],
})

</script>


<style scoped>

</style>