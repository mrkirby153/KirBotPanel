<template>
    <select class="ui fluid dropdown" v-model="data" @change="onChange($event)">
        <slot></slot>
    </select>
</template>

<script>
    export default {
        name: "dropdown",
        props: {
            value: {
                required: false
            }
        },
        mounted() {
            $(document).ready(() => {
                this.emit = false;
                $(this.$el).dropdown('set selected', this.value);
                this.emit = true;
            });
            this.data = this.value;
        },
        data() {
            return {
                data: "",
                emit: true,
            }
        },
        methods: {
            onChange(event) {
                if (this.emit) {
                    this.$emit('input', this.data);
                    this.$emit('change', event);
                }
            }
        }
    }
</script>

<style scoped>

</style>