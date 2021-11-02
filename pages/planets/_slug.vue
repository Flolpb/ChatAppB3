<template>
    <div>
        <div>Id: {{planet.id}}</div>
        <div>Name: {{planet.name}}</div>
        <div>Theme: {{planet.theme}}</div>
    </div>
</template>

<script>
export default {
    data: () => ({
        planet: {
            id: null,
            name: null,
            theme: null,
        }
    }),
    middleware: 'disconnect',
    methods: {
        async getPlanet(){
            const ref = await this.$fire.firestore.collection("planets").doc(this.planet.id);
            const snapshot = await ref.get();

            const doc = snapshot.data();
            if(doc != null){
                this.planet.name = doc.name;
                this.planet.theme = doc.theme;
            }
            else{
                this.$router.push('/');
            }
        }
    },
    async mounted(){
        this.planet.id = this.$route.params.slug;
        await this.getPlanet();
    }
}
</script>
