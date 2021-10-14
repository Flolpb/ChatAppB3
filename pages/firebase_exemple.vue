<template>

<v-btn @click="getData">GetData</v-btn>

</template>
<script>
export default {
    methods: {
        async getData() {
            const ref = await this.$fire.firestore.collection("test").doc("a4i0czW8SAsmuBtqpt2r");
            const snapshot = await ref.get();
            const doc = snapshot.data();
            console.log(doc.name);
        }
    }
    
}
</script>