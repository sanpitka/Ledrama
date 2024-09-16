<template>
    <div id="app">
        <ColorPicker :gradient="gradient" :key="key" :isGradient="true"
            :onStartChange="color => onChange(color, 'start')" :onChange="color => onChange(color, 'change')"
            :onEndChange="color => onChange(color, 'end')" />
    </div>
</template>

<script>
    import { ColorPicker } from 'https://cdn.jsdelivr.net/npm/vue3-color-gradient-picker@1.0.2/dist/index.js.mjs';

export default {
    components: {
        ColorPicker
    },

    data() {
        return {
            gradient: {
                type: 'linear',
                points: [
                {
                    left: 0,
                    red: 0,
                    green: 0,
                    blue: 0,
                    alpha: 1
                },
                {
                    left: 100,
                    red: 255,
                    green: 0,
                    blue: 0,
                    alpha: 1
                }
                ]
            },
            hsv_gradient: [ 0, 0, 0, 0, 255, 85, 100, 0],
            key: 0,
        }
    },
    props: {
        newgradient: Object
    },
    watch: {
        newgradient: {
            handler(newVal) {
                console.log("New Gradient: ", newVal);
                if (!_.isEqual(newVal, this.gradient.points)) {
                    //console.log("New Gradient: ", JSON.parse(JSON.stringify(newVal)));
                    this.gradient = JSON.parse(JSON.stringify(newVal));
                    this.key++;
                }
        },
        deep: true
        }
    },
    methods: {
        onChange(attrs, name) {
            console.log(attrs, name);

            // Check that there are no more than 16 points
            if (attrs.points && name === 'change' && attrs.points.length > 16) {
                attrs.points = attrs.points.slice(0,16);
                this.gradient.points = attrs.points;
                this.key++;
            }

            this.hsv_gradient = this.convToHsv(attrs); // convert to HSV
            //console.log("Child HSV: ", this.hsv_gradient);
            this.$emit('change', this.hsv_gradient) // send hsv-array to parent component
        },
        // Vectorama LED lights require HSV colors for effects
        convToHsv(attrs) {
            if (attrs.points && attrs.points.length >= 2) {
                let hsv_array = [];
            
                // convert every gradient array point into HSV, [start1, hue1, sat1, value1, start2, hue2, sat2, value2, ...]
                attrs.points.forEach((point) => {
                if (point.left === 0) {
                    hsv_array.push(0);
                } else {
                    hsv_array.push(Math.round(255 * (point.left / 100))); // starting point of the color
                };
                hsv_array.push(Math.round((point.red + point.green + point.blue) / 3)); // calculate hue
                hsv_array.push(Math.round((Math.max(point.red, point.green, point.blue) / 255) * 100)); // calculate saturation
                hsv_array.push(Math.round((Math.min(point.red, point.green, point.blue) / 255) * 100)); // calculate value
                });
            
                return hsv_array;
            }
        
        },  

    },
}
</script>

<style>
    .input-field {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        flex-direction: column
    }

    .input-field .label {
        font-size: 12px;
        line-height: 15px;
        font-weight: 600;
        margin-top: 6px;
        margin-bottom: 0;
        color: #1f2667
    }

    .input-field .input-container {
        display: flex;
        align-items: center;
        position: relative;
        width: 100%;
        border-radius: 6px;
        color: #28314d
    }

    .input-field .input-container .input {
        width: 100%;
        outline: 0;
        color: #1f2667;
        background: #FFFFFF;
        border-radius: inherit;
        border: 1px solid #bbbfc5;
        height: 24px;
        font-size: 12px;
        font-weight: 600;
        padding: 0 6px
    }

    * {
        box-sizing: border-box
    }

    .ui-color-picker {
        margin: 8px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        width: 280px;
        -webkit-user-select: none;
        user-select: none
    }

    .ui-color-picker .gradient-controls {
        display: none
    }

    .ui-color-picker .picker-area {
        display: flex;
        flex-direction: column;
        padding: 0 16px
    }

    .ui-color-picker .picker-area.gradient-tab .picking-area {
        margin-bottom: 10px
    }

    .ui-color-picker .picker-area .picking-area {
        width: 100%;
        height: 160px;
        margin-bottom: 16px;
        position: relative;
        border-radius: 8px
    }

    .ui-color-picker .picker-area .picking-area:hover {
        cursor: default
    }

    .ui-color-picker .picker-area .picking-area .picking-area-overlay1 {
        height: 100%;
        width: 100%;
        background: linear-gradient(to right, white 0%, rgba(255, 255, 255, 0) 100%);
        border-radius: 3px
    }

    .ui-color-picker .picker-area .picking-area .picking-area-overlay1 .picking-area-overlay2 {
        height: 100%;
        width: 100%;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, black 100%);
        border-radius: 8px
    }

    .ui-color-picker .picker-area .preview {
        display: flex;
        flex-direction: row;
        margin-bottom: 16px
    }

    .ui-color-picker .picker-area .preview .preview-box {
        box-sizing: border-box;
        height: 36px;
        width: 36px;
        border-radius: 8px;
        border: 1px solid #EBEDF5
    }

    .ui-color-picker .picker-area .preview .color-hue-alpha {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-left: 6px
    }

    .ui-color-picker .picker-area .preview .color-hue-alpha .hue {
        width: 100%;
        position: relative;
        border-radius: 10px;
        margin-bottom: 8px;
        padding: 0 7px;
        background-color: red;
        cursor: pointer
    }

    .ui-color-picker .picker-area .preview .color-hue-alpha .hue .hue-area {
        position: relative;
        height: 14px;
        background: -webkit-linear-gradient(left, #ff0000, #ff0080, #ff00ff, #8000ff, #0000ff, #0080ff, #00ffff, #00ff80, #00ff00, #80ff00, #ffff00, #ff8000, #ff0000);
        background: -o-linear-gradient(left, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000);
        background: -ms-linear-gradient(left, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000);
        background: -moz-linear-gradient(left, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000);
        background: linear-gradient(to right, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000)
    }

    .ui-color-picker .picker-area .preview .color-hue-alpha .alpha {
        display: none
    }

    .ui-color-picker .picker-area .gradient {
        width: 100%;
        height: 14px;
        position: relative;
        cursor: pointer;
        border-radius: 10px;
        margin-bottom: 8px;
        padding: 0 7px
    }

    .ui-color-picker .picker-area .gradient .gradient-slider-container {
        height: 100%;
        width: 100%;
        position: relative
    }

    .ui-color-picker .picker-area .picker-pointer {
        position: absolute;
        top: 1px;
        height: 12px;
        width: 12px;
        border: 1px solid #FFFFFF;
        background: transparent;
        border-radius: 50%;
        box-shadow: 0 0 4px #0000004d
    }

    .ui-color-picker .picker-area .picker-pointer .child-point {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 3px;
        width: 3px;
        background: #FFFFFF;
        border-radius: 50%;
        opacity: 0;
        transition: opacity .33s
    }

    .ui-color-picker .picker-area .picker-pointer .child-point.active {
        opacity: 1
    }

    .ui-color-picker .color-preview-area {
        margin-bottom: 8px;
        padding: 0 16px
    }

    .ui-color-picker .color-preview-area .input-group {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between
    }

    .ui-color-picker .color-preview-area .input-group .uc-field-group:not(:last-child) {
        margin-right: 7px
    }

    .ui-color-picker .color-preview-area .hex {
        width: 65px
    }

    .ui-color-picker .color-preview-area .rgb {
        width: 40px
    }

    .ui-color-picker .colors {
        padding: 3px 16px 0
    }

    .ui-color-picker .colors .colors-label {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        cursor: pointer
    }

    .ui-color-picker .colors .colors-label .uc-icon {
        margin-right: 8px;
        transition: transform .3s
    }

    .ui-color-picker .colors .colors-label .tp-text {
        text-transform: uppercase
    }

    .ui-color-picker .colors .colors-label.show+.colors-item-container {
        max-height: 80px;
        padding-bottom: 16px
    }

    .ui-color-picker .colors .colors-label.show .uc-icon {
        transform: rotate(-90deg)
    }

    .ui-color-picker .colors .template {
        display: flex;
        flex-direction: column
    }

    .ui-color-picker .colors .global {
        display: flex;
        flex-direction: column;
        align-items: flex-start
    }

    .ui-color-picker .colors .colors-item-container {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        transition: max-height .3s, padding-bottom .3s;
        max-height: 0;
        overflow: hidden
    }

    .ui-color-picker .colors .colors-item-container .colors-item {
        height: 24px;
        width: 24px;
        border-radius: 50%;
        background-color: #ebedf5;
        cursor: pointer;
        position: relative;
        margin-top: 4px;
        flex-shrink: 0
    }

    .ui-color-picker .colors .colors-item-container .colors-item:not(.plus) {
        border: 1px solid #EBEDF5
    }

    .ui-color-picker .colors .colors-item-container .colors-item.empty {
        display: flex;
        align-items: center;
        justify-content: center
    }

    .ui-color-picker .colors .colors-item-container .colors-item.empty .line {
        width: 2px;
        height: 16px;
        background-color: #8892b3;
        border-radius: 1px;
        transform: rotate(45deg)
    }

    .ui-color-picker .colors .colors-item-container .colors-item.plus {
        margin-bottom: 4px
    }

    .ui-color-picker .colors .colors-item-container .colors-item.plus .uc-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 1
    }

    .ui-color-picker .colors .colors-item-container .colors-item:not(:first-child):not(:nth-child(9)) {
        margin-left: 8px
    }

    .ui-color-picker .colors .colors-item-container .colors-item .uc-icon {
        position: absolute;
        right: -8px;
        top: -3px;
        opacity: 0;
        transition: opacity .3s
    }

    .ui-color-picker .colors .colors-item-container .colors-item:hover .uc-icon {
        opacity: 1
    }

    .ui-color-picker .colors .colors-item-container .colors-item.active:after {
        content: "";
        display: block;
        position: absolute;
        top: -3px;
        bottom: -3px;
        left: -3px;
        right: -3px;
        border: 2px solid #8892B3;
        border-radius: 50%
    }
</style>