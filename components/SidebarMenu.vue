<template>
  <v-card
    elevation="12"
    width="200"
    class="custom-card"
  >
    <v-navigation-drawer
      color="deep-purple lighten-5"
      floating
      permanent
    >
      <v-list
        dense
        rounded
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.route && (item.route)"
          @click="item.click() && (item.click())"
          link
          class="text-left custom-list-item"
        >
          <v-list-item-content>
            <span v-bind:class = "(item.class_color) ? item.class_color : 'black--text'">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: "SidebarMenu",
  props: ['items',],
  mounted() {
    console.log(this.items)
  }
}
</script>

<style lang="scss">
  .custom-card {
    position: fixed;
    left: 1em;
    top: 1em
  }
  .custom-list-item {
    transition: 0.3s;
  }
  .custom-list-item:hover {
    background-color: snow;
  }
</style>
