<template> 
    <div>
      <v-toolbar>
        <v-toolbar-avatar>
        <img style="margin-left: 4px; margin-right: 4px; margin-top: 4px;border-radius: 50%; height: 2rem;" :src="photoURL" />
        </v-toolbar-avatar>
        <v-toolbar-title>
          <div>{{username}}</div>
          <div style="width: 2rem;"></div>
        </v-toolbar-title>
      </v-toolbar>
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