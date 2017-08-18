<template>
    <div>
        <form class="ui form" :class="{'loading': form.busy, 'success': form.successful, 'error': form.errors.hasErrors()}"
                @keydown="resetFormState($event.target.name)" @change="resetFormState($event.target.name)">
            <div class="ui success message" style="margin-top: 15px">
                <div class="header">
                    <slot name="successHeader">Success!</slot>
                </div>
                <p>
                    <slot name="success">Settings have been saved</slot>
                </p>
            </div>
            <slot name="inputs"></slot>
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
        }
    }
</script>