<template>
    <select class="ui fluid dropdown">
        <option disabled selected value>{{prompt}}</option>
        <option v-for="(v, k) in options" :key="k" :v="v">{{k}}</option>
        <slot></slot>
    </select>
</template>

<script>
    export default {
        name: "dropdown",
        props: {
            value: {
                required: false
            },
            prompt: {
                required: false,
                type: String,
                default: ""
            },
            options: {
                required: false,
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                emit: true,
                ready: false,
            }
        },
        mounted() {
            let vm = this;
            $(document).ready(() => {
                vm.ready = true;
                $(this.$el).dropdown().on('change', event => {
                    if (vm.emit) {
                        vm.$emit('input', $(vm.$el).val());
                        vm.$emit('change', event);
                    }
                });
                this.emit = false;
                $(this.$el).dropdown('set selected', this.value);
                this.emit = true;
            });
        },
        watch: {
            value(newVal, oldVal) {
                if (!this.ready)
                    return;
                if(newVal === "" || newVal === undefined || newVal === null){
                    this.emit = false;
                    $(this.$el).dropdown('clear');
                    this.emit = true;
                    return;
                }
                this.emit = false;
                let toAdd = _.filter(newVal, v => _.indexOf(oldVal, v) === -1);
                let toRemove = _.filter(oldVal, v => _.indexOf(newVal, v) === -1);
                $(this.$el).dropdown('set selected', toAdd);
                $(this.$el).dropdown('remove selected', toRemove);
                this.emit = true;
            }
        }
    }
</script>

<style scoped>

</style>