<template>
    <div class="switch">
        <input type="checkbox" class="switch" :id="id" @change="onChange($event)" v-model="val" v-bind="$attrs"/>
        <label :for="id">{{label}}</label>
    </div>
</template>

<script>
    export default {
        name: "Input-Switch",

        inheritAttrs: false,

        props: {
            value: {
                required: false,
                default: false
            },
            label: {
                required: false,
                type: String,
                default: ""
            }
        },

        data() {
            return {
                id: "",
                val: "",
                emit: true
            }
        },

        mounted() {
            this.id = "sw-" + Math.random().toString(36).substr(7);
            this.emit = false;
            this.val = this.value;
            this.emit = true;
        },

        methods: {
            onChange(evt) {
                if (!this.emit)
                    return;
                this.$emit('input', this.val);
                this.$emit('change', evt)
            }
        },

        watch: {
            value(newVal) {
                this.emit = false;
                this.val = newVal;
                this.emit = true;
            }
        }
    }
</script>

<style scoped>

</style>