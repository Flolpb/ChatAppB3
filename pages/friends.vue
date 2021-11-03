<template>
    <div>
      <v-icon
        large
        @click="home"
      >
        mdi-chevron-left
      </v-icon>
    <v-toolbar
      color="black"
      width="400"
      dense
    >
      <v-text-field
        append-icon="mdi-magnify"
        label="Rechercher..."
        single-line
        color="white"
        hide-details
      ></v-text-field>
    </v-toolbar>
    <div>
    <p v-if="$fetchState.pending">Fetching Friends...</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
      <ul>
        <li v-for="(f, i) in friends"
          :key="i"
          exact>
            <FriendsList :uid="f.userId" :fid="f.friendId"/>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  export default {
    data: () => ({
      friend: {
        id: "",
        friendId: "",
        userId: "",
      },
      friends: [],
      friendRef: null,
    }),
    methods: {
      home () {
        this.$router.push("/planets");
      },
      async getFriends(){
        const friendRef = await this.$fire.firestore.collection("usersFriends").doc(this.$store.state.auth.user.id);
        const observer = friendRef.onSnapshot((doc) => {
          const data = doc.data();
          if(data != null){
            let i = this.friends.length;
            data.friends.forEach((fr) => {
              if(i != 0){
                const id = this.friends.find((f) => {
                  return f.id == fr.id;
                });
                if(id == undefined){
                  this.friends.push(fr);
                  i++;
                }
                }else{
                  this.friends.push(fr);
                  i++;
                }
              })                
            }
          })        
        },

        async mounted() {
          this.friend.userId = this.$store.state.auth.user.id;
          await this.getFriends();


        },
        async fetch() {
          await this.getFriends();
        },
    },
  }
</script>

<style scoped>
    .v-card,.v-navigation-drawer{
        margin-left: auto;
        margin-right: auto;
        margin-top: 5%;
}
    .colonne{
      column-count: 1;
      width: auto;
      margin-top: 3%;
    }
</style>