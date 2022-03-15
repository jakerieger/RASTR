<template>
    <div class="toolbar">
        <div class="tool-container" v-for="tool in tools" :key="tool.id">
            <button :class="tool.id === activeTool ? 'toolbar-button-active' : 'toolbar-button'" @click="selectedToolChanged(tool.id)">
                <i :class="`mdi mdi-${tool.icon}`"/>
            </button>
        </div>
        <div class="seperator"/>
        <input type="color" id="color-picker" v-model="color" @change="selectedColorChanged"/>
    </div>
</template>

<script>
export default {
    name: 'Toolbar',
    props: {
        //
    },
    data: () => ({
        tools: [
            { id: 0, name: 'Move', icon: 'cursor-move' },
            { id: 1, name: 'Select', icon: 'select-drag' },
            { id: 2, name: 'Paintbrush', icon: 'brush' },
            { id: 3, name: 'Paint Bucket', icon: 'format-color-fill' },
            { id: 4, name: 'Crop', icon: 'crop' },
            { id: 5, name: 'Eraser', icon: 'eraser' },
            { id: 6, name: 'Pen', icon: 'fountain-pen-tip' },
            { id: 7, name: 'Shape', icon: 'shape' },
            { id: 8, name: 'Text', icon: 'format-text' }
        ],
        activeTool: 0,
        color: '#ffffff'
    }),
    methods: {
        selectedToolChanged(id) {
            this.activeTool = id;
            this.$emit('toolChanged', id);
        },
        selectedColorChanged() {
            this.$emit('colorChanged', this.color);
        }
    }
}
</script>

<style>
.toolbar {
    width: 60px;
    background: #08090d;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    padding-top: 40px;
}

.toolbar-button {
    width: 48px;
    height: 48px;
    outline: none;
    border: none;
    background: none;
    font-size: 16pt;
}

.toolbar-button-active {
    width: 48px;
    height: 48px;
    outline: none;
    border: 2px solid #8f94ba;
    background: #1a1c29;
    font-size: 16pt;
    border-radius: 8px;
}

.seperator {
    margin-top: 10px;
    margin-bottom: 10px;
    border-top: 1px solid #2a2d42;
    height: 10px;
    width: 48px;
}

#color-picker {
    width: 32px;
    height: 32px;
}

#color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
}

#color-picker::-webkit-color-swatch {
    border: none !important;
    outline: none;
    color: red;
}
</style>