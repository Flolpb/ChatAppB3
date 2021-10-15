<template>
  <v-container fill-height fluid class="container">
    <v-row align="center" justify="center" class="row fill-height ">
      <v-col cols="5" class="col-left">
        <img id="img" src="/images/space-background.png"  alt="Space background" />
      </v-col>
      <v-col cols="7">
        <v-row>
          <v-col cols="12" class="col-right">
            <h1 id="title">Space Chat</h1>
            <p id="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus iusto laboriosam magnam maiores, placeat quasi quis quos rem repellat repellendus? Dolorem explicabo optio placeat provident. </p>
          </v-col>
          <v-col cols="12" align="center">
            <button id="button">Connexion avec Google</button>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "auth"
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
  #title {
    color: black;
    font-family: 'HelveticaNowText-Medium', sans-serif;
    font-size: 5rem;
    margin-bottom: 4rem;
  }
  #text {
    color: black;
    font-family: 'HelveticaNowText-Light', sans-serif;
    font-size: 1.4rem;
  }
  #button {
    background: #272753;
    padding: 1em;
    font-family: 'HelveticaNowText-Medium', sans-serif;
    font-size: 1.5rem;
    border-radius: 40px;
    transition: 0.3s;
  }
  #button:hover {
    background: rgba(39,39,83,0.8);
    transform: translateY(-5%);
  }
  #img {
    box-sizing: border-box;
    border-radius: 90px 0 0 90px;
    overflow: hidden;
    height: 100%;
    width: 100%;
    object-fit: cover;
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
</style>
