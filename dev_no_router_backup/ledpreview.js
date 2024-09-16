"use strict";
const ledpreview = (() => {
    // src/led.ts
    var LedStrip = class {
        constructor(length) {
            this.length = length;
            this.currentEffectId = null;
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
            if (this.currentEffectId) {
                clearInterval(this.currentEffectId);
                this.currentEffectId = null;
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
        createEffectButtons(ledStrip2, divId) {
            const controls = document.getElementById(divId);
            if (!controls) {
                return;
            }
            var button = document.createElement("button");
            button.textContent = "KITT";
            button.addEventListener("click", (event) => {
                this.redDotBackForthEffect(ledStrip2);
            });
            controls.appendChild(button);
            var button = document.createElement("button");
            button.textContent = "Outward Effect";
            button.addEventListener("click", (event) => {
                this.redDotOutwardEffect(ledStrip2);
            });
            controls.appendChild(button);
            var button = document.createElement("button");
            button.textContent = "Inward Effect";
            button.addEventListener("click", (event) => {
                this.redDotInwardEffect(ledStrip2);
            });
            controls.appendChild(button);
            var button = document.createElement("button");
            button.textContent = "Clear effect";
            button.addEventListener("click", (event) => {
                this.clearEffect(ledStrip2);
            });
            controls.appendChild(button);
        }
        rainbowEffect(ledStrip2) {
            const interval = 100;
            let i = 0;
            this.currentEffectId = setInterval(() => {
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
        // Move a red dot through the strip
        redDotToRightEffect(ledStrip2) {
            const interval = 1e3;
            const startingIndex = ledStrip2.length / 2;
            let i = startingIndex;
            this.currentEffectId = setInterval(() => {
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
        // Move a red dot through the strip
        redDotToLeftEffect(ledStrip2) {
            const interval = 1e3;
            const startingIndex = ledStrip2.length / 2;
            let i = startingIndex;
            this.currentEffectId = setInterval(() => {
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
        /*     // Move a red dot through the strip back and forth
            redDotBackForthEffect(ledStrip: LedStripInterface): void {
                const interval = 100;
                let i = 0;
                let direction = 1;
                this.currentEffectId = setInterval(() => {
                    for (let j = 0; j < ledStrip.length; j++) {
                        this.setLed(j, { red: 0, green: 0, blue: 0 });
                    }
                    this.setLed(i, { red: 255, green: 0, blue: 0 });
                    this.showLedStrip(ledStrip, 'ledCanvas');
                    i += direction;
                    if (i === ledStrip.length - 1 || i === 0) {
                        direction *= -1;
                    }
                }, interval);
            } */
        redDotBackForthEffect(ledStrip2) {
            const interval = 100;
            let i = 0;
            let direction = 1;
            let ledIntensities = new Array(ledStrip2.length).fill(0);
            const decayRate = 50;
            this.currentEffectId = setInterval(() => {
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
        redDotOutwardEffect(ledStrip2) {
            const interval = 1e3;
            const startingIndex = ledStrip2.length / 2 - 1;
            let left = startingIndex;
            let right = startingIndex + 1;
            this.currentEffectId = setInterval(() => {
                this.setLed(right, { red: 255, green: 0, blue: 0 });
                right = Math.floor((right + 1) % ledStrip2.length);
                this.setLed(left, { red: 255, green: 0, blue: 0 });
                this.showLedStrip(ledStrip2, "ledCanvas");
                left = Math.floor((left - 1 + ledStrip2.length) % ledStrip2.length);
                console.log("right " + right, " left " + left);
                if (left === ledStrip2.length - 1 && right === 0) {
                    console.log("reset");
                    left = startingIndex;
                    right = startingIndex + 1;
                    this.resetLedStrip(ledStrip2);
                }
            }, interval);
        }
        redDotInwardEffect(ledStrip2) {
            const interval = 1e3;
            const startingIndex = ledStrip2.length / 2 - 1;
            let left = 0;
            let right = ledStrip2.length - 1;
            let middle = Math.floor(ledStrip2.length / 2);
            console.log(middle + " middle");
            this.currentEffectId = setInterval(() => {
                this.setLed(right, { red: 255, green: 0, blue: 0 });
                right -= 1;
                this.setLed(left, { red: 255, green: 0, blue: 0 });
                this.showLedStrip(ledStrip2, "ledCanvas");
                left += 1;
                console.log("right " + right, " left " + left);
                if (left === middle && right === middle - 1) {
                    console.log("reset");
                    left = 0;
                    right = ledStrip2.length - 1;
                    this.resetLedStrip(ledStrip2);
                }
            }, interval);
        }
    };

    // src/app.ts
    var ledStrip = new LedEffects(20);
    ledStrip.showLedStrip(ledStrip, "ledCanvas");
    ledStrip.createLedControls(ledStrip);
    ledStrip.createEffectButtons(ledStrip, "effectControls");
})();
export default ledpreview;