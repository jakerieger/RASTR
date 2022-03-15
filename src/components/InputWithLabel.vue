<template>
    <div class="input-with-label">
        <label>{{label}}</label>
        <input type="text" @change="onTextChange($event)"/>
    </div>
</template>

<script>
export default {
    name: 'InputWithLabel',
    props: {
        label: String
    },
    methods: {
        onTextChange(event) {
            this.$emit('textChanged', event.target.value);
        }
    }
}
</script>

<style>
.input-with-label {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 6px;
}

.input-with-label input {
    background: none;
    border: none;
    outline: none;
    text-indent: 10px;
    font-size: 12pt;
    border: 2px solid #4f526d;
    border-radius: 8px;
    transition: 250ms;
    /* height: 60px; */
    padding-top: 30px;
    padding-bottom: 10px;
    background: #1a1c29;
}

.input-with-label input:hover {
    border: 2px solid #8f94ba;
}

.input-with-label input:focus {
    border: 2px solid #8f94ba;
}

.input-with-label label {
    color: #4f526d;
    font-weight: 400 !important;
    position: absolute;
    margin-left: 14px;
    margin-top: 10px;
    font-size: 11pt;
}
</style>