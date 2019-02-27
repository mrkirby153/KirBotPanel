<template>
    <div class="ui dropdown">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "dropdown-menu",

        mounted() {
            $(document).ready(() => {
                $(this.$el).dropdown();
            })
        }
    }
</script>

<style scoped>

</style>