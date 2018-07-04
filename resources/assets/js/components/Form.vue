<template>
    <div>
        <form @keydown="resetFormState($event.target.name)" @change="resetFormState($event.target.name)" @submit.prevent="submit"
            :class="{'busy': form.busy}">
            <slot></slot>
        </form>
    </div>
</template>

<script>
    export default {
        props: ['form'],

        methods: {
            resetFormState(element) {
                this.form.busy = false;
                this.form.errors.clear(element);
                this.form.successful = false;
            },
            submit() {
                this.$emit('submit');
            }
        }
    }
</script>