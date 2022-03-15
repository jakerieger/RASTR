<template>
    <div class="slider-container">
        <input id="slider" type="range" :min="range[0]" :max="range[1]" v-model="value" @change="$emit('valueChanged', value)"/>
        <div v-show="showIncrements">
            <div v-for="i in incrementArray" :key="i.id">
                {{i.value}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Slider',
    props: {
        range: Array,
        showIncrements: Boolean,
        increments: Number
    },
    data: () => ({
        value: 0,
        incrementArray: []
    }),
    beforeMount() {
        // this.value = this.range[0];
    }
}
</script>

<style scoped>
.slider-container {
    width: 100%;
}

#slider {
    width: 100%;
    appearance: none;
    height: 2px;
    border-radius: 10px;
    background: #1a1c29;
}

#slider::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background:#8f94ba;
}
</style>