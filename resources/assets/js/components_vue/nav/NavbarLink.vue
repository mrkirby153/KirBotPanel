<template>
    <li class="nav-item"><a class="nav-link" :href="href"><slot></slot></a></li>
</template>

<script>
    export default {
        name: "NavbarItem",
        props: {
            href: {
                required: true,
                type: String
            }
        },
        data() {
            return {
                id: ""
            }
        },
        mounted() {
            this.onMount()
        },
        methods: {
            onMount() {
                this.id = "navItem-" + Math.random().toString(36).substr(7)
            }
        }
    }
</script>

<style scoped>

</style>