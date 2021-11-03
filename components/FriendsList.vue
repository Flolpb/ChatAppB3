<template>
    <div>
        <div>
        <img style="margin-left: 4px; margin-right: 4px; margin-top: 4px;border-radius: 50%; height: 2rem;" :src="photoUrl" />
        </div>
      <div>
        <div>
          <div>{{username}}</div>
          <div style="width: 2rem;"></div>
        </div>
      </div>
    </div>

</template>

<script>

export default ({
    data: () => ({
        username: null,
        //state: null,
        photoUrl: null,
    }),
    props: [
        "uid",
        "fid",
    ],
    metaInfo () {
      return {
        id: this.id,
        uid: this.uid,
        fid: this.fid,
      }
    },
    methods: {
      async getData(){
        const userRef = await this.$fire.firestore.collection("users").doc(this.fid);
        const snapshot = await userRef.get();
        const doc = snapshot.data();
        if(doc != null){
          this.username = doc.displayName;
          this.photoUrl = doc.photoURL;
          }
        }
         
    },
    async mounted () {
      await this.getData();
    },
})
</script>

<style scoped>

</style>