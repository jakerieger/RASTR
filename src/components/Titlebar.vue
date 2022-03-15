<template>
    <div id="titlebar">
        {{title}}
    </div>
</template>

<script>
export default {
    name: 'Titlebar',
    props: {
        title: String
    }
}
</script>

<style scoped>
#titlebar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 5000;
    text-align: center;
    font-size: 10pt;
    height: 22px;
    background: #08090d;
    line-height: 22px;
    color: #8f94ba;
    -webkit-app-region: drag;
    -webkit-user-select: none;
}
</style>