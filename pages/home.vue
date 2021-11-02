<template>
    <v-card
      elevation="12"
      width="200"
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
            :to="item.route"
            link
            >
            <v-list-item-content>
            <span class= "black--text">
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
    data () {
      return {
        items: [
          { title: 'Profil', route:'/profile' },
          { title: 'Planètes', route:'/planets' },
          { title: 'Amis', route:'/friends' },
          { title: 'Paramètres', route:'/parameter' },
        ],
      }
    },
  }
</script>

