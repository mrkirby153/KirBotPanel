<template>
    <div class="form-group" :class="{'is-invalid': form.errors.get(name), 'is-valid' : success && form.successful}">
        <slot></slot>
        <small class="form-text text-muted">{{help}}</small>
        <div class="invalid-feedback">{{form.errors.get(name)}}</div>
        <div class="valid-feedback">
            <slot name="valid-feedback"></slot>
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
            },
            help: {
                required: false,
                default: ""
            },
            showSuccess: {
                required: false,
                default: "false"
            }
        },

        computed: {
            success(){
                if(this.showSuccess === true){
                    return this.showSuccess;
                } else {
                    return this.showSuccess === "true";
                }
            }
        }
    }
</script>