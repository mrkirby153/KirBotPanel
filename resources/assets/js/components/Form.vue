<template>
    <div>
        <form class="ui form" :class="{'loading': form.busy, 'success': form.successful, 'error': form.errors.hasErrors()}" @change="resetFormState()">
            <div class="ui success message" style="margin-top: 15px">
                <div class="header">
                    <slot name="successHeader">Success!</slot>
                </div>
                <p>
                    <slot name="success">Setetings have been saved</slot>
                </p>
            </div>
            <div class="ui error message">
                <div class="header">
                    <slot name="errorHeader">The following errors were found:</slot>
                </div>
                <slot name="errors">
                    <ul>
                        <li v-for="error in form.errors.flatten()">
                            {{ error }}
                        </li>
                    </ul>
                </slot>
            </div>
            <slot name="inputs"></slot>
        </form>
    </div>
</template>

<script>
    export default {
        props: ['form'],

        methods: {
            resetFormState() {
                this.form.busy = false;
                this.form.errors.forget();
                this.form.successful = false;
            },
        }
    }
</script>