<template>
    <div id="slider-control">
        <label>{{label}}</label>
        <Slider :range="range" :showIncrements="true" :increments="increments" @valueChanged="valueChanged"/>
    </div>
</template>

<script>
import Slider from './Slider.vue'

export default {
    name: 'SliderControl',
    components: {
        Slider
    },
    props: {
        label: String,
        range: Array,
        increments: Number
    },
    data: () => ({

    }),
    methods: {
        valueChanged(value) {
            this.$emit('valueChanged', value);
        }
    }
}
</script>

<style>
#slider-control {
    margin-bottom: 20px;
}

#slider-control label {
    font-weight: 300;
    color: #8f94ba;
}
</style>