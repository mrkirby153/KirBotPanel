<template>
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" :id="id" role="button" data-toggle="dropdown" aria-haspopup="true"
           aria-expanded="false">
            {{name}}
        </a>
        <div class="dropdown-menu" :class="dropDirection" :aria-labelledby="id">
            <slot></slot>
        </div>
    </li>
</template>

<script>
    export default {
        name: "NavbarDropdown",
        props: {
            name: {
                required: true,
                type: String
            },
            direction: {
                required: false,
                type: String,
                default: ""
            }
        },
        computed: {
            dropDirection() {
                if (this.direction === "")
                    return "";
                return "dropdown-menu-" + this.direction;
            }
        },
        data() {
            return {
                id: ""
            }
        },
        methods: {
            onMount() {
                this.id = "navbar-dropdown-" + Math.random().toString(36).substr(7)
            }
        },
        mounted() {
            this.onMount();
        }
    }
</script>

<style scoped>

</style>