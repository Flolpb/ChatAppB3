<template>
  <v-container fill-height fluid class="container">
    <v-row align="center" justify="center" class="row fill-height">
      <v-col cols="5" class="col-left">
        <img id="img" src="/images/space-background.png"  alt="Space background" />
      </v-col>
      <v-col cols="7">
        <v-row>
          <v-col cols="12" class="col-right">
            <CustomTitle :title="'Space chat'" />
            <p id="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus iusto laboriosam magnam maiores, placeat quasi quis quos rem repellat repellendus? Dolorem explicabo optio placeat provident. </p>
          </v-col>
          <v-col cols="12" align="center">
            <v-progress-circular
              v-if="spinner"
              indeterminate
              color="#272753"
            ></v-progress-circular>
            <CustomButton v-else :title="'Connexion avec Google'" :button-click="login" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomButton from "../components/CustomButton";
import CustomTitle from "../components/CustomTitle";
import {ACTIONS} from "../store/auth";

export default {
  name: "auth",
  components: {CustomTitle, CustomButton},
  middleware: 'connect',
  data: () => ({
    spinner: false,
  }),
  methods: {
    async login(){
      this.spinner = true;
      try {
        this.provider = new this.$fireModule.auth.GoogleAuthProvider();
        this.$fireModule.auth().signInWithPopup(this.provider).then(result => {
          const newUser = {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            uid: result.user.uid
          };
          const userRef = this.$fire.firestore.collection("users").doc(newUser.uid);
          userRef.set({
              displayName: newUser.displayName,
              email: newUser.email,
              photoURL: newUser.photoURL,
          });
          this.$store.dispatch(ACTIONS.LOGIN, newUser).then(() => {
            this.$cookies.set('uid', newUser.uid, {
              path: '/',
              maxAge: 60 * 60 * 24 * 7
            });
            this.$router.push('/planets');

            // Ligne commentée car on ne réinitialise pas le spinner au moment de la redirection (plus propre visuellement)
            //this.spinner = false;
          });

        });
      } catch (e) {
        this.spinner = false;
      }
    },
  }
}
</script>

<style scoped lang="scss">
  .container {
    width: 80vw;
  }
  .row {
    min-height: 80vh;
    background: #EDE3E8;
    box-sizing: border-box;
    border-radius: 90px;
    margin: 0;
  }
  .col-left {
    height: 100%;
    padding: 0;
    margin: 0;
  }
  .col-right {
    padding-right: 1em;
    padding-left: 3em
  }
  #text {
    color: black;
    font-family: 'HelveticaNowText-Light', sans-serif;
    font-size: 1.4rem;
  }
  #img {
    box-sizing: border-box;
    border-radius: 90px 0 0 90px;
    overflow: hidden;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
</style>
