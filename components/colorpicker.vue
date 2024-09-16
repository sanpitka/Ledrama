<template>
    <div id="app">
        <ColorPicker :gradient="gradient" :key="key" :isGradient="true"
            :onStartChange="color => onChange(color, 'start')" :onChange="color => onChange(color, 'change')"
            :onEndChange="color => onChange(color, 'end')" />
    </div>
</template>

<script>
    import { ColorPicker } from './colorpicker.mjs';

export default {
    components: {
        ColorPicker
    },

    data() {
        return {
            hsv_gradient: [ 0, 170, 255, 255, 255, 0, 255, 255],
            key: 0,
            length: 2,
        }
    },
    props: {
        gradient: {
            type: Object,
            default: () => ({
                type: 'linear',
                points: [
                { 
                    left: 0,
                    red: 0,
                    green: 0,
                    blue: 255,
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
            })
        }
    },
    watch: {
        gradient: {
            handler(newVal, oldVal) {
                //console.log("[colorpicker.vue] new gradient: ", newVal); 
                if (newVal !== oldVal) {
                    try {
                        this.gradient = newVal;
                        this.key++;
                    } catch (error) {
                        console.log(error)
                    }
                }                                    
            },
            deep: true
        }
    },
    methods: {
        onChange(attrs, name) {

            // Check that there are no more than 16 points
            if (attrs.points && name === 'change' && attrs.points.length > 16) {
                attrs.points = attrs.points.slice(0,16);
                this.gradient.points = attrs.points;
                this.key++;
            }

            this.hsv_gradient = this.convToHsv(attrs); // convert to HSV
            //console.log("[colorpicker.vue] Child HSV: ", this.hsv_gradient);
            this.$emit('change', this.hsv_gradient) // send hsv-array to parent component
        },
        // Vectorama LED lights require HSV colors for effects
        convToHsv(input) {
            // make a shallow copy to arrange the items without messing the color picker
            var attrs = { ...input }
            if (attrs.points && attrs.points.length >= 2) {
                let hsv_array = [];
                let color = null;

                // sort points so that gradient items are in the right order
                attrs.points.sort((a, b) => a.left - b.left);

                // convert every gradient array point into HSV, [start1, hue1, sat1, value1, start2, hue2, sat2, value2, ...]
                attrs.points.forEach((point) => {
                    if (point.left === 0) {
                        hsv_array.push(0);
                    } else {
                        hsv_array.push(Math.round(255 * (point.left / 100))); // starting point of the color
                    };
                    color = this.rgb2hsv(point.red, point.green, point.blue); // calculate hsv
                    hsv_array.push(color.h); // calculate hue
                    hsv_array.push(color.s); // calculate saturation
                    hsv_array.push(color.v); // calculate value
                });
                return hsv_array;
            }
        },
        rgb2hsv(r, g, b) {
            let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
            rabs = r / 255;
            gabs = g / 255;
            babs = b / 255;
            v = Math.max(rabs, gabs, babs),
            diff = v - Math.min(rabs, gabs, babs);
            diffc = c => (v - c) / 6 / diff + 1 / 2;
            percentRoundFn = num => Math.round(num * 255);
            if (diff == 0) {
                h = s = 0;
            } else {
                s = diff / v;
                rr = diffc(rabs);
                gg = diffc(gabs);
                bb = diffc(babs);
            
                if (rabs === v) {
                    h = bb - gg;
                } else if (gabs === v) {
                    h = (1 / 3) + rr - bb;
                } else if (babs === v) {
                    h = (2 / 3) + gg - rr;
                }
                if (h < 0) {
                    h +=1;
                } else if (h> 1) {
                    h -= 1;
                }
            }
            
            return {
                h: Math.round(h * 255), // Convert to 0-255 range
                s: Math.round(s * 255), // Convert to 0-255 range
                v: Math.round(v * 255) // Convert to 0-255 range
            };
        },

    },
}
</script>

<style>
    @import './css/colorpicker.css';
</style>