export default {
    data() {
        return {
            ledStrip: new LedEffects(20),
        };
    },
    props: {
        effect: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        effect: {
            handler(newVal, oldVal) {
                //console.log("[ledpreview.mjs] effect changed to ", newVal, " from ", oldVal);
                this.ledStrip.createEffect(newVal);
                if (this.ledStrip.baseEffectId !== null) {
                    // effect preview is on, reset efect after changes
                    //console.log("[ledpreview] Resetting effect");
                    this.ledStrip.clearEffect(this.ledStrip);
                    this.ledStrip.viewEffect(this.ledStrip);
                }
            },
            deep: true
        }
    },
    template:
        `
        <div>   
            <div class="led-preview">
                <canvas id="ledCanvas" style="width:25px;height:500px; border:1px solid gray" width="25" height="500"></canvas>
            </div>
            <div id="effectControls" class="led-preview-controls"></div>
        </div> 
    `,

    methods: {

    },
    mounted() {
        //console.log(this.ledStrip);
        this.ledStrip.showLedStrip(this.ledStrip, "ledCanvas");
        this.ledStrip.createEffectButtons(this.ledStrip, "effectControls");
    },
};

/** NB! Do not modify lines after this,
 * modify the original TS project, build it and paste the
 * altered code here according to instructions.
 */

// src/led.ts
var LedStrip = class {
    constructor(length) {
        this.length = length;
        this.baseEffectId = null;
        this.noiseEffectId = null;
        this.leds = Array.from({ length }, () => ({ red: 0, green: 0, blue: 0 }));
    }
    createLedStrip(length) {
        return {
            leds: Array.from({ length }, () => ({ red: 0, green: 0, blue: 0 })),
            length
        };
    }
    setLed(ledIndex, color) {
        this.leds[ledIndex] = color;
    }
    getLed(ledIndex) {
        return this.leds[ledIndex];
    }
    showLedStrip(ledStrip2, canvasId) {
        const canvas = document.getElementById(canvasId);
        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }
        for (let i = 0; i < ledStrip2.length; i++) {
            const { red, green, blue } = ledStrip2.leds[i];
            context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            context.fillRect(0, i * 25, 25, 25);
        }
    }
    clearCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    clearEffect(ledStrip2) {
        if (this.baseEffectId) {
            clearInterval(this.baseEffectId);
            this.baseEffectId = null;
            this.resetLedStrip(ledStrip2);
            this.showLedStrip(ledStrip2, "ledCanvas");
        }
        if (this.noiseEffectId) {
            clearInterval(this.noiseEffectId);
            this.noiseEffectId = null;
            this.resetLedStrip(ledStrip2);
            this.showLedStrip(ledStrip2, "ledCanvas");
        }
    }
    resetLedStrip(ledStrip2) {
        ledStrip2.leds = Array.from({ length: ledStrip2.length }, () => ({ red: 0, green: 0, blue: 0 }));
    }
    createLedControls(ledStrip2) {
        const controls = document.getElementById("controls");
        if (!controls) {
            return;
        }
        const label = document.createElement("label");
        label.textContent = "Number of LEDs";
        controls.appendChild(label);
        const input = document.createElement("input");
        input.type = "number";
        input.value = ledStrip2.length.toString();
        let effects = this.createEffectControls(ledStrip2);
        input.addEventListener("input", () => {
            ledStrip2.length = parseInt(input.value);
            ledStrip2.leds = Array.from({ length: ledStrip2.length }, () => ({ red: 0, green: 0, blue: 0 }));
            controls.removeChild(effects);
            this.clearCanvas("ledCanvas");
            this.showLedStrip(ledStrip2, "ledCanvas");
            effects = this.createEffectControls(ledStrip2);
            controls.appendChild(effects);
        });
        controls.appendChild(input);
        const br = document.createElement("br");
        controls.appendChild(br);
        controls.appendChild(effects);
    }
    createEffectControls(ledStrip2) {
        var effects = document.createElement("div");
        for (let i = 0; i < ledStrip2.length; i++) {
            const input = document.createElement("input");
            input.type = "color";
            input.value = `#${ledStrip2.leds[i].red.toString(16).padStart(2, "0")}${ledStrip2.leds[i].green.toString(16).padStart(2, "0")}${ledStrip2.leds[i].blue.toString(16).padStart(2, "0")}`;
            input.addEventListener("input", () => {
                const [red, green, blue] = input.value.slice(1).match(/.{1,2}/g).map((value) => parseInt(value, 16));
                this.setLed(i, { red, green, blue });
                this.showLedStrip(ledStrip2, "ledCanvas");
            });
            effects.appendChild(input);
        }
        return effects;
    }
};

// src/ledEffects.ts
var LedEffects = class extends LedStrip {
    constructor() {
        super(...arguments);
        this.effect = {
            bpm: 0,
            fxSpeed: 0,
            nVal: 0,
            nHue: 0,
            nSat: 255,
            nScaleX: 100,
            nScaleY: 100,
            nContrast: 4,
            //gDef: [0, 0, 0, 255, 255, 0, 255, 255],
            gDef: [
                0,
                0,
                0,
                255,
                65,
                90,
                255,
                255,
                165,
                0,
                255,
                255,
                255,
                0,
                255,
                255
            ],
            gMapMode: 0,
            gScale: 100,
            sEffect: 2
        };
        this.gradient = [];
    }
    // gradient colors as objects
    // Load an external effect
    createEffect(extEffect) {
        if (extEffect && "payload" in extEffect) {
            this.effect = { ...extEffect.payload };
            this.effect.sEffect = Number(this.effect.sEffect);
            if ("gMapMode" in this.effect) {
                this.effect.gMapMode = Number(this.effect.gMapMode);
            }
        }
    }
    createEffectButtons(ledStrip2, divId) {
        const controls = document.getElementById(divId);
        if (!controls) {
            return;
        }
        //controls.style.display = "flex";
        //controls.style.flexDirection = "column";
        // controls.style.alignItems = "center";
        controls.style.width = "50%";
        var buttonGroup = document.createElement("button-group");
        buttonGroup.className = "btn-group-vertical btn-group-led-preview";
        var button = document.createElement("button");
        button.textContent = "Preview effect";
        button.className = "btn btn-primary btn-led-preview";
        button.addEventListener("click", (event) => {
            this.viewEffect(ledStrip2);
        });
        buttonGroup.appendChild(button);
        var button = document.createElement("button");
        button.textContent = "Stop effect";
        button.className = "btn btn-primary btn-led-preview";
        button.addEventListener("click", (event) => {
            this.clearEffect(ledStrip2);
        });
        buttonGroup.appendChild(button);
        controls.appendChild(buttonGroup);
    }
    viewEffect(ledStrip2) {
        if (this.effect && this.effect.sEffect >= 0 && ledStrip2.length > 0) {
            if (this.effect.sEffect > 0 && this.effect.sEffect < 4) {
                if (this.effect.gDef.length > 0 && this.effect.gDef.length % 4 === 0) {
                    this.gradient = this.gDefToGradient(this.effect.gDef);
                    //console.log("[ledpreview] Gradient created: ", this.gradient);
                } else {
                    //console.log("[ledpreview] Error in gradient, breaking out...");
                    return;
                }
            }
            if (this.effect.sEffect === 0) {
                //console.log("BPM effect");
                this.effectBpmCyclingHue(ledStrip2);
            } else if (this.effect.sEffect === 1) {
                //console.log("BPM2 effect");
                this.effectBpmAlongGradient(ledStrip2);
            } else if (this.effect.sEffect === 2) {
                //console.log("BPM3 effect");
                this.effectBpmTravelingGradient(ledStrip2);
            } else if (this.effect.sEffect === 3) {
                //console.log("Gradient effect");
                this.effectGradient(ledStrip2);
            } else {
                console.log("Unexpected sEffect value ", this.effect.sEffect);
            }
            if (this.effect.nVal > 0) {
                //console.log("Noise effect active");
                this.effectNoise(ledStrip2);
            }
        }
    }
    // Rainbow effect, by samettipallo
    rainbowEffect(ledStrip2) {
        const interval = 100;
        let i = 0;
        this.baseEffectId = setInterval(() => {
            const red = Math.round(Math.sin(0.3 * i + 0) * 127 + 128);
            const green = Math.round(Math.sin(0.3 * i + 2) * 127 + 128);
            const blue = Math.round(Math.sin(0.3 * i + 4) * 127 + 128);
            for (let j = 0; j < ledStrip2.length; j++) {
                this.setLed(j, { red, green, blue });
            }
            this.showLedStrip(ledStrip2, "ledCanvas");
            i++;
        }, interval);
    }
    // Move a red dot through the strip, by samettipallo
    redDotToRightEffect(ledStrip2) {
        const interval = 1e3;
        const startingIndex = ledStrip2.length / 2;
        let i = startingIndex;
        this.baseEffectId = setInterval(() => {
            for (let j = 0; j < ledStrip2.length; j++) {
                this.setLed(j, { red: 0, green: 0, blue: 0 });
            }
            this.setLed(i, { red: 255, green: 0, blue: 0 });
            this.showLedStrip(ledStrip2, "ledCanvas");
            i = Math.floor((i + 1) % ledStrip2.length);
            if (i === ledStrip2.length - 1) {
                i = startingIndex;
            }
        }, interval);
    }
    // Move a red dot through the strip, by samettipallo
    redDotToLeftEffect(ledStrip2) {
        const interval = 1e3;
        const startingIndex = ledStrip2.length / 2;
        let i = startingIndex;
        this.baseEffectId = setInterval(() => {
            for (let j = 0; j < ledStrip2.length; j++) {
                this.setLed(j, { red: 0, green: 0, blue: 0 });
            }
            this.setLed(i, { red: 255, green: 0, blue: 0 });
            this.showLedStrip(ledStrip2, "ledCanvas");
            i = Math.floor((i - 1 + ledStrip2.length) % ledStrip2.length);
            if (i === 0) {
                i = startingIndex;
            }
        }, interval);
    }
    // Move a red dot back and forth through the strip, by samettipallo
    redDotBackForthEffect(ledStrip2) {
        const interval = 100;
        let i = 0;
        let direction = 1;
        let ledIntensities = new Array(ledStrip2.length).fill(0);
        const decayRate = 50;
        this.clearEffect(ledStrip2);
        this.baseEffectId = setInterval(() => {
            for (let j = 0; j < ledStrip2.length; j++) {
                ledIntensities[j] = Math.max(0, ledIntensities[j] - decayRate);
                this.setLed(j, { red: ledIntensities[j], green: 0, blue: 0 });
            }
            ledIntensities[i] = 255;
            this.setLed(i, { red: 255, green: 0, blue: 0 });
            this.showLedStrip(ledStrip2, "ledCanvas");
            i += direction;
            if (i === ledStrip2.length - 1 || i === 0) {
                direction *= -1;
            }
        }, interval);
    }
    // Move a red dot back and forth through the strip, by samettipallo
    redDotOutwardEffect(ledStrip2) {
        this.clearEffect(ledStrip2);
        const interval = 1e3;
        const startingIndex = ledStrip2.length / 2 - 1;
        let left = startingIndex;
        let right = startingIndex + 1;
        this.baseEffectId = setInterval(() => {
            this.setLed(right, { red: 255, green: 0, blue: 0 });
            right = Math.floor((right + 1) % ledStrip2.length);
            this.setLed(left, { red: 255, green: 0, blue: 0 });
            this.showLedStrip(ledStrip2, "ledCanvas");
            left = Math.floor((left - 1 + ledStrip2.length) % ledStrip2.length);
            if (left === ledStrip2.length - 1 && right === 0) {
                left = startingIndex;
                right = startingIndex + 1;
                this.resetLedStrip(ledStrip2);
            }
        }, interval);
    }
    // Move a red dot back and forth through the strip, by samettipallo
    redDotInwardEffect(ledStrip2) {
        this.clearEffect(ledStrip2);
        const interval = 1e3;
        const startingIndex = ledStrip2.length / 2 - 1;
        let left = 0;
        let right = ledStrip2.length - 1;
        let middle = Math.floor(ledStrip2.length / 2);
        this.baseEffectId = setInterval(() => {
            this.setLed(right, { red: 255, green: 0, blue: 0 });
            right -= 1;
            this.setLed(left, { red: 255, green: 0, blue: 0 });
            this.showLedStrip(ledStrip2, "ledCanvas");
            left += 1;
            if (left === middle && right === middle - 1) {
                left = 0;
                right = ledStrip2.length - 1;
                this.resetLedStrip(ledStrip2);
            }
        }, interval);
    }
    /** 
     * Cycling hue effect, sEffect 0.
     * Cycles through hue values at the speed of fxSpeed, and cycles through brightness
     * at the speed of bpm, changing all the leds at the same time.
     * */
    effectBpmCyclingHue(ledStrip2) {
        if (this.effect && this.effect.bpm >= 0 && this.effect.fxSpeed >= 0) {
            this.clearEffect(ledStrip2);
            const interval = 10;
            let i = 0;
            this.baseEffectId = setInterval(() => {
                const fxdivider = 1e3;
                const bpmdivider = 6e3;
                let fxDist = this.effect.fxSpeed * Date.now() / fxdivider % 256;
                let beat = 0;
                if (this.effect.bpm > 0) {
                    beat = Math.round((Math.sin(this.effect.bpm * Date.now() / bpmdivider) + 1) * 127.5);
                }
                for (let j = 0; j < ledStrip2.length; j++) {
                    this.setLed(j, this.hsvToRgb(fxDist, 255, beat));
                }
                this.showLedStrip(ledStrip2, "ledCanvas");
                i++;
            }, interval);
        }
    }
    /**
     * BPM2-effect, sEffect 1.
     * Cycles through colors in gradient array at the speed of bpm, changing all the leds at the same time.
     * bpm === 0 means the first color of the gradient is displayed.
     * */
    effectBpmAlongGradient(ledStrip2) {
        if (this.effect && this.effect.bpm >= 0 && this.effect.gDef.length > 0) {
            this.clearEffect(ledStrip2);
            let interval = 50;
            const tweaker = 0.99;
            let direction = "up";
            let intervalsPerBeat = 1;
            if (this.effect.bpm > 0) {
                intervalsPerBeat = 6e4 / this.effect.bpm / interval * tweaker;
            }
            let colorSteps = this.gradientSteps(this.gradient, intervalsPerBeat);
            if (colorSteps.length === 0) {
                console.log("Error in gradient steps, breaking out...");
                this.clearEffect(ledStrip2);
                return;
            }
            let step = 0;
            this.baseEffectId = setInterval(() => {
                if (colorSteps.length === 1)
                    interval = 1e3;
                if (direction === "up") {
                    for (let j = 0; j < ledStrip2.length; j++) {
                        this.setLed(j, this.hsvToRgb(colorSteps[step].hue, colorSteps[step].saturation, colorSteps[step].value));
                    }
                } else if (direction === "down") {
                    const end = colorSteps.length - 1;
                    for (let j = 0; j < ledStrip2.length; j++) {
                        this.setLed(j, this.hsvToRgb(colorSteps[end - step].hue, colorSteps[end - step].saturation, colorSteps[end - step].value));
                    }
                }
                this.showLedStrip(ledStrip2, "ledCanvas");
                if (step === colorSteps.length - 1) {
                    step = 0;
                    direction === "up" ? direction = "down" : direction = "up";
                } else {
                    step++;
                }
            }, interval);
        }
    }
    /**
     * BPM3-effect, sEffect 2.
     * Moves the colors in the gradient array through the strip at the speed of fxSpeed, flashes the leds at the speed of bpm if larger than 0.
     * The relative distance between the colors is determined by the starting point of each color, see Gradient effect.
     * fxSpeed === 0 means the gradient is stationary.
     */
    effectBpmTravelingGradient(ledStrip2) {
        if (this.effect && this.effect.bpm >= 0 && this.effect.fxSpeed >= 0 && this.effect.gDef.length > 0) {
            this.clearEffect(ledStrip2);
            const tweaker = 3.33;
            let interval = 1e3;
            if (this.effect.fxSpeed > 0) {
                interval = 6e4 / this.effect.fxSpeed / ledStrip2.length * tweaker;
            }
            ;
            let colorSteps = this.gradientSteps(this.gradient, ledStrip2.length);
            //console.log("colorSteps: ", colorSteps);
            if (colorSteps.length === 0) {
                console.log("Error in gradient steps, breaking out...");
                this.clearEffect(ledStrip2);
                return;
            }
            const bpminterval = 50;
            this.baseEffectId = setInterval(() => {
                if (colorSteps.length === 1) {
                    interval = 1e3;
                }
                const bpmdivider = 6e3;
                let beat = 255;
                if (this.effect.bpm > 0) {
                    beat = Math.round((Math.sin(this.effect.bpm * Date.now() / bpmdivider) + 1) * 127.5);
                }
                for (let j = ledStrip2.length - 1, i = 0; j >= 0 && i < colorSteps.length; j--, i++) {
                    this.setLed(j, this.hsvToRgb(colorSteps[i].hue, colorSteps[i].saturation, beat));
                }
                this.showLedStrip(ledStrip2, "ledCanvas");
            }, bpminterval);
            setInterval(() => {
                if (this.effect.fxSpeed > 0) {
                    let lastElement = colorSteps.pop();
                    if (lastElement !== void 0) {
                        colorSteps.unshift(lastElement);
                    }
                }
            }, interval);
        }
    }
    /** 
     * Gradient effect, sEffect 3.
     * Moves the colors in the gradient array through the strip at the speed of fxSpeed.
     * The relative distance between the colors is determined by the starting point of each color,
     * passed as first element of each /4 element in the array.
     * E.g. [0, 255, 255, 255, 
     *     160, 180, 255, 255] where first starting point is pixel 0, second starting point is pixel 160 out of 255.
     * The movement direction is determined by gMapMode: 0 is top to bottom, 1 is bottom to top, 2 is outwards from center, 3 is inwards to center.
     * fxSpeed === 0 means the gradient is stationary
     * */
    effectGradient(ledStrip2) {
        if (this.effect && this.effect.fxSpeed >= 0 && this.effect.gDef.length > 0 && this.effect.gMapMode >= 0 && this.effect.gScale > 0) {
            let firstToLast2 = function (array) {
                let first = array.shift();
                if (first !== void 0) {
                    array.push(first);
                }
            }, lastToFirst2 = function (array) {
                let last = array.pop();
                if (last !== void 0) {
                    array.unshift(last);
                }
            };
            var firstToLast = firstToLast2, lastToFirst = lastToFirst2;
            this.clearEffect(ledStrip2);
            let length = ledStrip2.length * (100 / this.effect.gScale);
            const tweaker = 3.3;
            let interval = 10;
            if (this.effect.fxSpeed > 0) {
                interval = 6e4 / this.effect.fxSpeed / ledStrip2.length * tweaker;
            }
            ;
            if (this.effect.gMapMode === 0 || this.effect.gMapMode === 1) {
                let colorSteps = this.gradientSteps(this.gradient, length);
                if (colorSteps.length === 0) {
                    console.log("Error in gradient steps, breaking out...");
                    this.clearEffect(ledStrip2);
                    return;
                }
                if (colorSteps.length < ledStrip2.length) {
                    let diff = ledStrip2.length - colorSteps.length;
                    for (let i = 0; i < diff; i++) {
                        colorSteps.push(colorSteps[i]);
                    }
                }
                this.baseEffectId = setInterval(() => {
                    if (this.effect.fxSpeed === 0)
                        interval = 1e3;
                    if (this.effect.gMapMode === 0) {
                        for (let j = ledStrip2.length - 1, i = 0; j >= 0; j--, i++) {
                            this.setLed(j, this.hsvToRgb(colorSteps[i].hue, colorSteps[i].saturation, colorSteps[i].value));
                        }
                    } else if (this.effect.gMapMode === 1) {
                        for (let j = 0; j < ledStrip2.length; j++) {
                            this.setLed(j, this.hsvToRgb(colorSteps[j].hue, colorSteps[j].saturation, colorSteps[j].value));
                        }
                    }
                    this.showLedStrip(ledStrip2, "ledCanvas");
                    if (this.effect.fxSpeed > 0) {
                        firstToLast2(colorSteps);
                    }
                }, interval);
            } else if (this.effect.gMapMode >= 2 || this.effect.gMapMode === 3) {
                let colorSteps = this.gradientSteps(this.gradient, Math.round(length / 2));
                if (colorSteps.length === 0) {
                    console.log("Error in gradient steps, breaking out...");
                    this.clearEffect(ledStrip2);
                    return;
                }
                if (colorSteps.length < Math.round(ledStrip2.length / 2)) {
                    let diff = Math.round(ledStrip2.length / 2) - colorSteps.length;
                    for (let i = 0; i < diff; i++) {
                        colorSteps.push(colorSteps[i]);
                    }
                }
                let top = Math.round(ledStrip2.length / 2) - 1;
                let bottom = top + 1;
                this.baseEffectId = setInterval(() => {
                    if (this.effect.fxSpeed === 0)
                        interval = 1e4;
                    if (this.effect.gMapMode === 3) {
                        for (let i = top, j = 0; i >= 0; i--, j++) {
                            this.setLed(top - j, this.hsvToRgb(colorSteps[j].hue, colorSteps[j].saturation, colorSteps[j].value));
                        }
                        for (let i = bottom, j = 0; i < ledStrip2.length; i++, j++) {
                            this.setLed(bottom + j, this.hsvToRgb(colorSteps[j].hue, colorSteps[j].saturation, colorSteps[j].value));
                        }
                    } else if (this.effect.gMapMode >= 2) {
                        for (let i = 0, j = 0; i <= top; i++, j++) {
                            this.setLed(i, this.hsvToRgb(colorSteps[j].hue, colorSteps[j].saturation, colorSteps[j].value));
                        }
                        for (let i = ledStrip2.length - 1, j = 0; i >= bottom; i--, j++) {
                            this.setLed(i, this.hsvToRgb(colorSteps[j].hue, colorSteps[j].saturation, colorSteps[j].value));
                        }
                    }
                    if (this.effect.fxSpeed > 0) {
                        firstToLast2(colorSteps);
                    }
                    this.showLedStrip(ledStrip2, "ledCanvas");
                }, interval * 2);
            } else {
                console.log("Unexpected gMapMode value ", this.effect.gMapMode);
            }
        }
    }
    /**
     * Create noise over the current effect
     *  */
    effectNoise(ledStrip2) {
        if (this.effect && this.effect.nVal > 0 && this.effect.nHue >= 0 && this.effect.nSat >= 0 && this.effect.nContrast >= 0 && this.effect.nScaleX > 0 && this.effect.nScaleY > 0) {
            const interval = 6e4 / this.effect.nScaleY;
            let size = 1;
            if (this.effect.nScaleX >= 50 && this.effect.nScaleX < 100) {
                size = 2;
            } else if (this.effect.nScaleX < 50 && this.effect.nScaleX > 0) {
                size = 3;
            }
            const amount = Math.max(Math.round(this.effect.nVal / 255 * (ledStrip2.length / 3)), Math.round(ledStrip2.length / 3));
            const contrast = Math.min(Math.round(this.effect.nContrast * 32), 255);
            this.noiseEffectId = setInterval(() => {
                let indexes = new Array();
                for (let i = 0; i < amount; i++) {
                    let index = Math.floor(Math.random() * ledStrip2.length);
                    if (!indexes.includes(index)) {
                        indexes.push(index);
                    } else {
                        i--;
                    }
                }
                indexes.forEach((index) => {
                    this.setLed(index, this.hsvToRgb(this.effect.nHue, this.effect.nSat, contrast));
                    if (size > 1) {
                        if (index - 1 >= 0) {
                            this.setLed(index - 1, this.hsvToRgb(this.effect.nHue, this.effect.nSat, contrast));
                        }
                        if (size === 3 && index + 1 < ledStrip2.length) {
                            this.setLed(index + 1, this.hsvToRgb(this.effect.nHue, this.effect.nSat, contrast));
                        }
                    }
                });
                this.showLedStrip(ledStrip2, "ledCanvas");
            }, interval);
        }
    }
    /* --- HELPER FUNCTIONS --- */
    /**
     * Change rgb values to HSV values. Accepts 0-255 values in HSV
     *  */
    hsvToRgb(h, s, v) {
        let r, g, b;
        let i;
        let f, p, q, t;
        h = h / 255 * 360;
        s = s / 255;
        v = v / 255;
        if (s === 0) {
            r = g = b = v;
            return { red: Math.round(r * 255), green: Math.round(g * 255), blue: Math.round(b * 255) };
        }
        h /= 60;
        i = Math.floor(h);
        f = h - i;
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));
        switch (i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            default:
                r = v;
                g = p;
                b = q;
                break;
        }
        return { red: Math.round(r * 255), green: Math.round(g * 255), blue: Math.round(b * 255) };
    }
    /**
     * Calculates a linear interpolation between two input colors based on a given factor.
     * @param color1 - start color
     * @param color2 - end color
     * @param {number} factor - Interpolation factor between two colors, i.e. how much of each color to blend together
     * in order to create a smooth transition between them. A `factor` of 0 would result in the first
     * color. A `factor` of 1 would result in the second color. A `factor` of 0.5 would result in a
     * color that is halfway between the two input colors.
     * @returns returns a HSV color object
     */
    lerpColor(color1, color2, factor) {
        let result = { hue: 0, saturation: 0, value: 0 };
        result.hue = Math.round(color1.hue + factor * (color2.hue - color1.hue));
        result.saturation = Math.round(color1.saturation + factor * (color2.saturation - color1.saturation));
        result.value = Math.round(color1.value + factor * (color2.value - color1.value));
        return result;
    }
    /** Create objects from each gDef array color for easier handling */
    gDefToGradient(gDef) {
        if (gDef.length % 4 !== 0) {
            return [];
        }
        let gradient = [];
        for (let i = 0; i < gDef.length; i += 4) {
            gradient.push({ start: gDef[i], hue: gDef[i + 1], saturation: gDef[i + 2], value: gDef[i + 3] });
        }
        gradient.sort((a, b) => a.start - b.start);
        return gradient;
    }
    /**
     * Calculates color steps between gradient colors based on the
     * specified length.
     * @param {any[]} gradient - an array containing objects that represent colors in a gradient. 
     * Each object in the array has a `start` property that represents the starting point of the color in the gradient.
     * @param {number} length - The `length` parameter in the `gradientSteps` function represents the
     * total number of steps or intervals you want to divide the gradient into. This parameter
     * determines how many intermediate colors will be generated between each pair of colors in the
     * gradient.
     * @returns returns an array of color steps based on the input gradient and length parameters.
     *  Each color step is calculated by interpolating between two adjacent colors in the gradient array.
     */
    gradientSteps(gradient, length) {
        let colorSteps = [];
        for (let i = 0; i < gradient.length - 1; i++) {
            let steps = 0;
            if (i === gradient.length - 1) {
                if (gradient[i].start !== 255) {
                    steps = Math.abs(Math.round((gradient[0].start - gradient[i].start) / 255 * length));
                }
            } else {
                steps = Math.round((gradient[i + 1].start - gradient[i].start) / 255 * length);
            }
            for (let j = 0; j < steps; j++) {
                const factor = j / steps;
                if (i === gradient.length - 1 && gradient[i].start === 255) {
                } else {
                    let nextColor = i < gradient.length - 1 ? gradient[i + 1] : gradient[0];
                    colorSteps.push(this.lerpColor(gradient[i], nextColor, factor));
                }
            }
        }
        return colorSteps;
    }
};

/** out.js import stops here */