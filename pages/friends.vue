<template>
    <div>
      <v-icon
        large
        @click="home"
      >
        mdi-chevron-left
      </v-icon>
      <v-form>
        <v-flex xs6>
          <v-autocomplete
            v-model="searchString"
            :disabled="isUpdating"
            :items="search"
            solo
            chips
            label="Rechercher..."
            item-text="displayName"
            item-value="displayName"
            multiple
            clearable
            >
            <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title>
                  ...Chercher de nouveaux amis
                </v-list-tile-title>
              </v-list-tile>
            </template>
             <template>         
            <div v-for="(s, i) in search"
              :key="i"
              exact>
              <SearchBar :username="s.displayName" :photoURL="s.photoURL"/>
            </div>
            </template>
          </v-autocomplete>
        </v-flex>
      </v-form>
      <v-progress-circular
            v-if="spinner"
            color="#272753"
          ></v-progress-circular>
      <CustomButton v-else :title="'Ajouter des amis'" :button-click="addFriends"/>
    <div>
      <v-card
        elevation="12"
        width="1000"
      >
        <v-navigation-drawer
          color="deep-purple lighten-5"
          width="1000"
          floating
          permanent
        >
          <v-list
            dense
            rounded
          >
            <v-list-item v-for="(f, i) in friends"
              :key="i"
              exact>
                <FriendsList :username="f.displayName" :photoURL="f.photoURL"/>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-card>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      friends: [],
      search: [],
      userRef: null,
      spinner: false,
    }),
    methods: {
      home () {
        this.$router.push("/planets");
      },
      async getSearch(){
        console.log("debut getSearch")
        const usersRef = await this.$fire.firestore.collection("users");
        const snap = await usersRef.get();
        snap.forEach(doc => {
          const user = doc.data();
          if(user != null){
            let i = this.search.length;
              if(i != 0){
                const id = this.search.find((s) => {
                  return s.id == user.id;
                });
                if(id != undefined){
                  this.search.push(user);
                  i++;
                }
              }else{
                  this.search.push(user);
                  i++;
              }
          }
        });
      },

      async getFriends(){
        console.log("debut getFriends")
        const snap = await this.userRef.get();
        const data = snap.data();
          if(data != null){
            let i = this.friends.length;
            if (data.friends != null){
            console.log(data.friends)
            data.friends.forEach((fr) => {
              if (i != 0){
                const id = this.friends.find((f) => {
                  return f.id == fr.id;
                });
                if(id != undefined){
                  this.friends.push(fr);
                  i++;
                }
                }else{
                  this.friends.push(fr);
                  i++;
              }
            })                
          }        
          }
      },
      async addFriends(){
            this.spinner = true;
            try {
              this.search.forEach(friend => {
                console.log(friend);
                const value={
                  friendvalue:{
                    displayName: friend.displayName,
                    photoURL: friend.photoURL
                  }
                }   
                console.log(value)
                const data={
                  friends:[value]
                }
                  console.log(data)
                  const unionRes = this.userRef.update(arrayUnion(data));
              })
            } catch (e) {
             this.spinner = false;
            }
          },
    },
        async mounted() {
          this.userRef = this.$fire.firestore.collection("users").doc(this.$store.state.auth.user.uid);
          await this.getFriends();
          await this.getSearch();
        }
    
  }
</script>

<style scoped>
    .v-card,.v-toolbar{
        margin-left: auto;
        margin-right: auto;
        margin-top: 5%;
}
    .colonne{
      column-count: 1;
    }

    .v-form{
    margin-left: 33%;
    margin-right: auto;
    margin-top: 5%;
}

    .v-select.v-select--is-menu-active .v-input__icon--append .v-icon {
    transform: none;
}
</style>