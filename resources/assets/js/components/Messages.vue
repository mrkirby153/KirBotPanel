<template>
    <div>
        <div class="ui success message">
            <div class="header">{{successHeader}}</div>
            <p>{{successBody}}</p>
        </div>
        <div class="ui error message">
            <div class="header">The following errors were found:</div>
            <ul>
                <li v-for="error in errorArray">
                    {{ error }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['success-header', 'success-body', 'error-array']
    }
</script>