<template>
    <div class="ui field" :class="{'error': form.errors.has(name), 'required': required}">
        <slot></slot>
        <div class="form-error">
            {{ form.errors.get(name) }}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            form: {
                required: true
            },
            name: {
                required: true
            },
            required: {
                default: false
            }
        }
    }
</script>