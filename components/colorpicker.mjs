import { openBlock as d, createElementBlock as p, normalizeStyle as b, createElementVNode as u, normalizeClass as P, withModifiers as U, resolveComponent as h, Fragment as S, renderList as Y, createBlock as w, createVNode as g, createCommentVNode as E, toDisplayString as R } from "vue";
function G({ red: e, green: t, blue: n }) {
    let o, r, s, i, a;
    const l = e / 255, f = t / 255, y = n / 255, v = Math.max(l, f, y), I = v - Math.min(l, f, y), k = (j) => (v - j) / 6 / I + 1 / 2;
    return I === 0 ? (i = 0, a = 0) : (a = I / v, o = k(l), r = k(f), s = k(y), l === v ? i = s - r : f === v ? i = 1 / 3 + o - s : y === v && (i = 2 / 3 + r - o), i < 0 ? i += 1 : i > 1 && (i -= 1)), {
        hue: Math.round(i * 360),
        saturation: Math.round(a * 100),
        value: Math.round(v * 100)
    };
}
function W(e) {
    let t = 1;
    const n = e / 60;
    let o = t * (1 - Math.abs(n % 2 - 1));
    const r = 0, s = 255;
    let i = 0, a = 0, l = 0;
    return t = (t + r) * s | 0, o = (o + r) * s | 0, n >= 0 && n < 1 && (i = t | 0, a = o | 0, l = r | 0), n >= 1 && n < 2 && (i = o | 0, a = t | 0, l = r | 0), n >= 2 && n < 3 && (i = r | 0, a = t | 0, l = o | 0), n >= 3 && n < 4 && (i = r | 0, a = o | 0, l = t | 0), n >= 4 && n < 5 && (i = o | 0, a = r | 0, l = t | 0), n >= 5 && n <= 6 && (i = t | 0, a = r | 0, l = o | 0), {
        red: i,
        green: a,
        blue: l
    };
}
function H(e) {
    return typeof e == "number" && Number.isNaN(e) === !1 && e >= 0 && e <= 255;
}
function C(e, t, n, o) {
    if (H(e) && H(t) && H(n)) {
        const r = {
            red: e | 0,
            green: t | 0,
            blue: n | 0
        };
        return H(o) === !0 && (r.alpha = o | 0), r;
    }
}
function D(e, t, n) {
    n /= 100;
    let r = t / 100 * n;
    const s = e / 60;
    let i = r * (1 - Math.abs(s % 2 - 1)), a = n - r;
    const l = 255;
    return r = (r + a) * l | 0, i = (i + a) * l | 0, a = a * l | 0, s >= 1 && s < 2 ? C(i, r, a) : s >= 2 && s < 3 ? C(a, r, i) : s >= 3 && s < 4 ? C(a, i, r) : s >= 4 && s < 5 ? C(i, a, r) : s >= 5 && s <= 6 ? C(r, a, i) : C(r, i, a);
}
function A(e, t, n, o, r) {
    e > o && (e = o), t > n && (t = n), e < 0 && (e = 0), t < 0 && (t = 0);
    const s = 100 - t * 100 / n | 0, i = e * 100 / o | 0;
    return {
        ...D(r, i, s),
        saturation: i,
        value: s
    };
}
function B(e, t, n, o) {
    let r = 360 * e / t | 0;
    return r = r < 0 ? 0 : r > 360 ? 360 : r, {
        ...D(r, n, o),
        hue: r
    };
}
function F(e, t) {
    return e = Number((e / t).toFixed(2)), e > 1 ? 1 : e < 0 ? 0 : e;
}
function V(e, t, n) {
    let o = e.toString(16), r = t.toString(16), s = n.toString(16);
    return e < 16 && (o = `0${o}`), t < 16 && (r = `0${r}`), n < 16 && (s = `0${s}`), o + r + s;
}
const z = /(^#{0,1}[0-9A-F]{6}$)|(^#{0,1}[0-9A-F]{3}$)|(^#{0,1}[0-9A-F]{8}$)/i, q = /([0-9A-F])([0-9A-F])([0-9A-F])/i;
function J(e) {
    if (z.test(e)) {
        e[0] === "#" && (e = e.slice(1, e.length)), e.length === 3 && (e = e.replace(q, "$1$1$2$2$3$3"));
        const n = parseInt(e.substr(0, 2), 16), o = parseInt(e.substr(2, 2), 16), r = parseInt(e.substr(4, 2), 16), s = parseInt(e.substr(6, 2), 16) / 255, i = C(n, o, r, s), a = G({ ...i });
        return {
            ...i,
            ...a
        };
    }
    return !1;
}
function M(e, t) {
    const n = e * 100 / t;
    return n < 0 ? 0 : n > 100 ? 100 : n;
}
function K(e, t, n, o) {
    return Math.atan2(e - n, t - o) * (180 / Math.PI) * -1 + 180;
}
function c(e, t) {
    return !e && e !== 0 ? t : e;
}
function L(e, t, n, o) {
    return `rgba(${e}, ${t}, ${n}, ${o})`;
}
function $(e, t, n) {
    let o = "";
    const r = e.slice();
    return r.sort((s, i) => s.left - i.left), t === "linear" ? o = `linear-gradient(${n}deg,` : o = "radial-gradient(", r.forEach((s, i) => {
        o += `rgba(${s.red}, ${s.green}, ${s.blue}, ${s.alpha}) ${s.left}%`, i !== r.length - 1 && (o += ",");
    }), o += ")", o;
}
function N(e, t, n) {
    return function (r) {
        let s = e(r);
        function i(a) {
            s = t(a, s) || s;
        }
        window.addEventListener("mousemove", i), window.addEventListener("mouseup", (a) => {
            window.removeEventListener("mousemove", i), n && n(a, s);
        }, { once: !0 });
    };
}
const Q = {
    name: "Picker",
    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        hue: Number,
        saturation: Number,
        value: Number,
        updateColor: Function
    },
    data() {
        return {
            width: 0,
            height: 0,
            mouseEvents: () => {
            }
        };
    },
    mounted() {
        const { pickerAreaRef: e } = this.$refs;
        e && (this.width = e.clientWidth, this.height = e.clientHeight), this.mouseEvents = N(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },
    computed: {
        offsetLeft() {
            return (this.saturation * this.width / 100 | 0) - 6;
        },
        offsetTop() {
            return (this.height - this.value * this.height / 100 | 0) - 6;
        },
        pointerStyle() {
            return {
                backgroundColor: `rgb(${this.red}, ${this.green}, ${this.blue})`,
                left: `${this.offsetLeft}px`,
                top: `${this.offsetTop}px`
            };
        },
        pickerStyle() {
            const { red: e, green: t, blue: n } = W(this.hue);
            return { backgroundColor: `rgb(${e}, ${t}, ${n})` };
        }
    },
    methods: {
        mouseDownHandler(e) {
            const { x: t, y: n } = this.$refs.pickerAreaRef.getBoundingClientRect(), o = e.pageX, r = e.pageY, s = o - t, i = r - n, a = A(s, i, this.height, this.width, this.hue);
            return this.updateColor(a, "onStartChange"), {
                startX: o,
                startY: r,
                positionX: s,
                positionY: i
            };
        },
        changeObjectPositions(e, { startX: t, startY: n, positionX: o, positionY: r }) {
            const s = e.pageX - t, i = e.pageY - n;
            o += s, r += i;
            const a = A(o, r, this.height, this.width, this.hue);
            return {
                positions: {
                    positionX: o,
                    positionY: r,
                    startX: e.pageX,
                    startY: e.pageY
                },
                color: a
            };
        },
        mouseMoveHandler(e, { startX: t, startY: n, positionX: o, positionY: r }) {
            const { positions: s, color: i } = this.changeObjectPositions(e, {
                startX: t,
                startY: n,
                positionX: o,
                positionY: r
            });
            return this.updateColor(i, "onChange"), s;
        },
        mouseUpHandler(e, { startX: t, startY: n, positionX: o, positionY: r }) {
            const { positions: s, color: i } = this.changeObjectPositions(e, {
                startX: t,
                startY: n,
                positionX: o,
                positionY: r
            });
            return this.updateColor(i, "onEndChange"), s;
        }
    }
}, m = (e, t) => {
    const n = e.__vccOpts || e;
    for (const [o, r] of t)
        n[o] = r;
    return n;
}, Z = { class: "picking-area-overlay1" }, _ = { class: "picking-area-overlay2" };
function x(e, t, n, o, r, s) {
    return d(), p("div", {
        class: "picking-area",
        ref: "pickerAreaRef",
        style: b(e.pickerStyle),
        onMousedown: t[0] || (t[0] = (...i) => e.mouseEvents && e.mouseEvents(...i))
    }, [
        u("div", Z, [
            u("div", _, [
                u("div", {
                    class: "picker-pointer",
                    style: b(e.pointerStyle)
                }, null, 4)
            ])
        ])
    ], 36);
}
const ee = /* @__PURE__ */ m(Q, [["render", x]]), te = {
    name: "area-preview",
    props: {
        isGradient: Boolean,
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        points: Array,
        gradientDegree: Number,
        gradientType: String
    },
    computed: {
        style() {
            return this.isGradient ? { background: $(this.points, this.gradientType, this.gradientDegree) } : { backgroundColor: L(this.red, this.green, this.blue, this.alpha) };
        }
    }
}, ne = { class: "preview-area" };
function oe(e, t, n, o, r, s) {
    return d(), p("div", ne, [
        u("div", {
            class: "preview-box",
            style: b(e.style)
        }, null, 4)
    ]);
}
const re = /* @__PURE__ */ m(te, [["render", oe]]), ie = {
    name: "hue",
    props: {
        hue: Number,
        saturation: Number,
        value: Number,
        updateColor: Function
    },
    data() {
        return {
            width: 0,
            mouseEvents: () => {
            }
        };
    },
    mounted() {
        const { hueRef: e } = this.$refs;
        e && (this.width = e.clientWidth), this.mouseEvents = N(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },
    computed: {
        offsetLeft() {
            return (this.hue * this.width / 360 | 0) - 6;
        },
        pointerStyle() {
            return {
                left: `${this.offsetLeft}px`
            };
        }
    },
    methods: {
        mouseDownHandler(e) {
            const t = e.currentTarget.getBoundingClientRect().x, n = e.pageX, o = n - t, r = B(o, this.width, this.saturation, this.value);
            return this.updateColor(r, "onStartChange"), {
                startX: n,
                positionX: o
            };
        },
        changeObjectPositions(e, { startX: t, positionX: n }) {
            const o = e.pageX - t;
            n += o;
            const r = n > this.width ? this.width : n <= 0 ? 0 : n, s = B(r, this.width, this.saturation, this.value);
            return {
                positions: {
                    positionX: n,
                    startX: e.pageX
                },
                color: s
            };
        },
        mouseMoveHandler(e, { startX: t, positionX: n }) {
            const { positions: o, color: r } = this.changeObjectPositions(e, { startX: t, positionX: n });
            return this.updateColor(r, "onChange"), o;
        },
        mouseUpHandler(e, { startX: t, positionX: n }) {
            const { positions: o, color: r } = this.changeObjectPositions(e, { startX: t, positionX: n });
            return this.updateColor(r, "onEndChange"), o;
        }
    }
}, se = {
    class: "hue-area",
    ref: "hueRef"
};
function ae(e, t, n, o, r, s) {
    return d(), p("div", {
        class: "hue",
        onMousedown: t[0] || (t[0] = (...i) => e.mouseEvents && e.mouseEvents(...i))
    }, [
        u("div", se, [
            u("div", {
                class: "picker-pointer",
                style: b(e.pointerStyle)
            }, null, 4)
        ], 512)
    ], 32);
}
const le = /* @__PURE__ */ m(ie, [["render", ae]]), ue = {
    name: "alpha",
    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        updateColor: Function
    },
    data() {
        return {
            width: 0,
            mouseEvents: () => {
            }
        };
    },
    mounted() {
        const { alphaMaskRef: e } = this.$refs;
        e && (this.width = e.clientWidth), this.mouseEvents = N(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },
    computed: {
        offsetLeft() {
            return (this.alpha * this.width | 0) - 6;
        },
        pointerStyle() {
            return { left: `${this.offsetLeft}px` };
        },
        style() {
            return {
                background: `linear-gradient(to right, rgba(0, 0, 0, 0), rgb(${this.red}, ${this.green}, ${this.blue}))`
            };
        }
    },
    methods: {
        mouseDownHandler(e) {
            const t = e.currentTarget.getBoundingClientRect().x, n = e.pageX, o = n - t;
            return this.updateColor({ alpha: F(o, this.width) }, "onStartChange"), {
                startX: n,
                positionX: o
            };
        },
        changeObjectPositions(e, { startX: t, positionX: n }) {
            const o = e.pageX - t;
            n += o;
            const r = F(n, this.width);
            return {
                positions: {
                    positionX: n,
                    startX: e.pageX
                },
                alpha: r
            };
        },
        mouseMoveHandler(e, { startX: t, positionX: n }) {
            const { positions: o, alpha: r } = this.changeObjectPositions(e, { startX: t, positionX: n });
            return this.updateColor({ alpha: r }, "onChange"), o;
        },
        mouseUpHandler(e, { startX: t, positionX: n }) {
            const { positions: o, alpha: r } = this.changeObjectPositions(e, { startX: t, positionX: n });
            return this.updateColor({ alpha: r }, "onEndChange"), o;
        }
    }
}, de = { class: "alpha-area" }, he = {
    class: "alpha-mask",
    ref: "alphaMaskRef"
};
function pe(e, t, n, o, r, s) {
    return d(), p("div", {
        onMousedown: t[0] || (t[0] = (...i) => e.mouseEvents && e.mouseEvents(...i)),
        class: "alpha"
    }, [
        u("div", {
            class: "gradient",
            style: b(e.style)
        }, null, 4),
        u("div", de, [
            u("div", he, [
                u("div", {
                    class: "picker-pointer",
                    style: b(e.pointerStyle)
                }, null, 4)
            ], 512)
        ])
    ], 32);
}
const ce = /* @__PURE__ */ m(ue, [["render", pe]]), ge = {
    name: "GradientPoint",
    props: {
        point: Object,
        activePointIndex: Number,
        index: Number,
        width: Number,
        positions: Object,
        changeActivePointIndex: Function,
        updateGradientLeft: Function,
        removePoint: Function
    },
    data() {
        return {
            mouseEvents: () => {
            }
        };
    },
    mounted() {
        this.mouseEvents = N(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },
    computed: {
        activeClassName() {
            return this.activePointIndex === this.index ? " active" : "";
        },
        pointStyle() {
            return { left: `${this.point.left * (this.width / 100) - 6}px` };
        }
    },
    methods: {
        mouseDownHandler(e) {
            this.changeActivePointIndex(this.index);
            const t = e.pageX, n = e.pageY, o = t - this.positions.x;
            return this.updateGradientLeft(this.point.left, this.index, "onStartChange"), {
                startX: t,
                startY: n,
                offsetX: o
            };
        },
        changeObjectPositions(e, { startX: t, offsetX: n }) {
            const o = e.pageX - t;
            n += o;
            const r = M(n, this.width);
            return {
                positions: {
                    offsetX: n,
                    startX: e.pageX
                },
                left: r
            };
        },
        mouseMoveHandler(e, { startX: t, offsetX: n }) {
            const { positions: o, left: r } = this.changeObjectPositions(e, { startX: t, offsetX: n });
            return this.updateGradientLeft(r, this.index, "onChange"), o;
        },
        mouseUpHandler(e, { startX: t, offsetX: n }) {
            const { positions: o, left: r } = this.changeObjectPositions(e, { startX: t, offsetX: n });
            return this.updateGradientLeft(r, this.index, "onEndChange"), o;
        }
    }
};
function me(e, t, n, o, r, s) {
    return d(), p("div", {
        class: P(`picker-pointer${e.activeClassName}`),
        style: b(e.pointStyle),
        onMousedown: t[0] || (t[0] = (...i) => e.mouseEvents && e.mouseEvents(...i)),
        onDblclick: t[1] || (t[1] = () => e.removePoint(e.index)),
        onClick: t[2] || (t[2] = U(() => {
        }, ["stop"]))
    }, [
        u("span", {
            class: P(`child-point${e.activeClassName}`)
        }, null, 2)
    ], 38);
}
const fe = /* @__PURE__ */ m(ge, [["render", me]]), be = {
    name: "index",
    props: {
        points: Array,
        activePointIndex: Number,
        changeActivePointIndex: Function,
        updateGradientLeft: Function,
        addPoint: Function,
        removePoint: Function
    },
    data() {
        return {
            width: 0,
            positions: { x: 0, y: 0 }
        };
    },
    components: {
        GradientPoint: fe
    },
    mounted() {
        const e = this.$refs.pointsContainerRef;
        if (e) {
            this.width = e.clientWidth;
            const t = e.getBoundingClientRect();
            this.positions = { x: t.x, y: t.y };
        }
    },
    computed: {
        pointsStyle() {
            return { background: $(this.points, "linear", 90) };
        }
    },
    methods: {
        pointsContainerClick(e) {
            const t = M(e.pageX - this.positions.x, this.width);
            this.addPoint(t);
        }
    }
}, ve = {
    class: "gradient-slider-container",
    ref: "pointsContainerRef"
};
function Ce(e, t, n, o, r, s) {
    const i = h("GradientPoint");
    return d(), p("div", {
        class: "gradient",
        style: b(e.pointsStyle),
        onClick: t[0] || (t[0] = (...a) => e.pointsContainerClick && e.pointsContainerClick(...a))
    }, [
        u("div", ve, [
            (d(!0), p(S, null, Y(e.points, (a, l) => (d(), w(i, {
                key: l,
                activePointIndex: e.activePointIndex,
                index: l,
                point: a,
                width: e.width,
                positions: e.positions,
                changeActivePointIndex: e.changeActivePointIndex,
                updateGradientLeft: e.updateGradientLeft,
                removePoint: e.removePoint
            }, null, 8, ["activePointIndex", "index", "point", "width", "positions", "changeActivePointIndex", "updateGradientLeft", "removePoint"]))), 128))
        ], 512)
    ], 4);
}
const $e = /* @__PURE__ */ m(be, [["render", Ce]]), ye = {
    name: "Area",
    props: {
        isGradient: Boolean,
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        hue: Number,
        saturation: Number,
        value: Number,
        updateColor: Function,
        points: Array,
        degree: Number,
        type: String,
        activePointIndex: Number,
        changeGradientControl: Function,
        changeActivePointIndex: Function,
        updateGradientLeft: Function,
        addPoint: Function,
        removePoint: Function
    },
    components: {
        Picker: ee,
        GradientPoints: $e,
        Preview: re,
        Hue: le,
        Alpha: ce
    }
}, Pe = { class: "picker-area" }, Ge = { class: "preview" }, we = { class: "color-hue-alpha" };
function Ne(e, t, n, o, r, s) {
    const i = h("Picker"), a = h("GradientPoints"), l = h("Preview"), f = h("Hue"), y = h("Alpha");
    return d(), p("div", Pe, [
        g(i, {
            red: e.red,
            green: e.green,
            blue: e.blue,
            hue: e.hue,
            saturation: e.saturation,
            value: e.value,
            updateColor: e.updateColor
        }, null, 8, ["red", "green", "blue", "hue", "saturation", "value", "updateColor"]),
        e.isGradient ? (d(), w(a, {
            key: 0,
            type: e.type,
            degree: e.degree,
            points: e.points,
            activePointIndex: e.activePointIndex,
            changeActivePointIndex: e.changeActivePointIndex,
            updateGradientLeft: e.updateGradientLeft,
            addPoint: e.addPoint,
            removePoint: e.removePoint
        }, null, 8, ["type", "degree", "points", "activePointIndex", "changeActivePointIndex", "updateGradientLeft", "addPoint", "removePoint"])) : E("", !0),
        u("div", Ge, [
            g(l, {
                red: e.red,
                green: e.green,
                blue: e.blue,
                alpha: e.alpha,
                isGradient: e.isGradient,
                points: e.points,
                gradientDegree: e.degree,
                gradientType: e.type
            }, null, 8, ["red", "green", "blue", "alpha", "isGradient", "points", "gradientDegree", "gradientType"]),
            u("div", we, [
                g(f, {
                    hue: e.hue,
                    saturation: e.saturation,
                    value: e.value,
                    updateColor: e.updateColor
                }, null, 8, ["hue", "saturation", "value", "updateColor"]),
                g(y, {
                    alpha: e.alpha,
                    red: e.red,
                    green: e.green,
                    blue: e.blue,
                    updateColor: e.updateColor
                }, null, 8, ["alpha", "red", "green", "blue", "updateColor"])
            ])
        ])
    ]);
}
const X = /* @__PURE__ */ m(ye, [["render", Ne]]), He = {
    name: "Input",
    props: {
        modelValue: {
            type: [String, Number],
            default: ""
        },
        label: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: "text"
        },
        classes: {
            type: String,
            default: ""
        },
        onFocus: {
            type: Function,
            default: () => {
            }
        },
        onBlur: {
            type: Function,
            default: () => {
            }
        }
    },
    emits: ["update:modelValue"],
    methods: {
        onInput(e) {
            this.$emit("input", e), this.$emit("update:modelValue", e.target.value);
        }
    }
    // model: {
    //   prop: 'value',
    //   event: 'input',
    // },
};
const Se = { class: "input-container" }, Ie = ["value"], ke = { class: "label" };
function Ae(e, t, n, o, r, s) {
    return d(), p("div", {
        class: P(`input-field ${e.classes}`)
    }, [
        u("div", Se, [
            u("input", {
                class: P(`${e.type}-input input`),
                onFocus: t[0] || (t[0] = (...i) => e.onFocus && e.onFocus(...i)),
                onBlur: t[1] || (t[1] = (...i) => e.onBlur && e.onBlur(...i)),
                value: e.modelValue,
                onInput: t[2] || (t[2] = (...i) => e.onInput && e.onInput(...i))
            }, null, 42, Ie)
        ]),
        u("div", ke, R(e.label), 1)
    ], 2);
}
const T = /* @__PURE__ */ m(He, [["render", Ae]]), Be = {
    name: "Preview",
    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        updateColor: Function
    },
    components: {
        Input: T
    },
    data() {
        return {
            inProgress: !1,
            hexValue: V(this.red, this.green, this.blue)
        };
    },
    computed: {
        hex() {
            return V(this.red, this.green, this.blue);
        }
    },
    watch: {
        inProgress: "setHex",
        red: "setHex",
        green: "setHex",
        blue: "setHex"
    },
    methods: {
        setHex() {
            this.inProgress || (this.hexValue = this.hex);
        },
        changeHex(e) {
            const t = J(e.target.value);
            t && this.updateColor(t);
        }
    }
};
function Fe(e, t, n, o, r, s) {
    const i = h("Input");
    return d(), w(i, {
        modelValue: e.hexValue,
        "onUpdate:modelValue": t[0] || (t[0] = (a) => e.hexValue = a),
        label: "hex",
        onInput: e.changeHex,
        onFocus: () => e.inProgress = !0,
        onBlur: () => e.inProgress = !1,
        inProgress: e.inProgress,
        classes: "hex"
    }, null, 8, ["modelValue", "onInput", "onFocus", "onBlur", "inProgress"]);
}
const Ve = /* @__PURE__ */ m(Be, [["render", Fe]]), Ee = {
    name: "RGBItem",
    props: {
        value: String | Number,
        type: String,
        label: String,
        onChange: Function
    },
    components: {
        Input: T
    },
    data() {
        return {
            inputValue: this.value,
            inProgress: !1
        };
    },
    watch: {
        value: "setValue"
    },
    methods: {
        onChangeHandler(e) {
            const t = +e.target.value;
            if (Number.isNaN(t) || t.length > 3 || t < 0 || t > 255) {
                this.inputValue = this.value, this.$forceUpdate();
                return;
            }
            this.inputValue = e.target.value, this.onChange(t);
        },
        onBlur() {
            !this.inputValue && !this.inputValue !== 0 && (this.inputValue = this.value), this.inProgress = !1;
        },
        setValue() {
            this.value !== +this.inputValue && this.inputValue !== "" && (this.inputValue = this.value);
        }
    }
};
function Re(e, t, n, o, r, s) {
    const i = h("Input");
    return d(), p("div", null, [
        g(i, {
            modelValue: e.inputValue,
            "onUpdate:modelValue": t[0] || (t[0] = (a) => e.inputValue = a),
            type: e.type,
            label: e.label,
            onInput: e.onChangeHandler,
            onFocus: () => e.inProgress = !0,
            onBlur: e.onBlur,
            inProgress: e.inProgress,
            classes: "rgb"
        }, null, 8, ["modelValue", "type", "label", "onInput", "onFocus", "onBlur", "inProgress"])
    ]);
}
const De = /* @__PURE__ */ m(Ee, [["render", Re]]), Me = {
    name: "RGB",
    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        updateColor: Function
    },
    components: {
        RGBItem: De
    },
    methods: {
        changeValue(e, t) {
            if (e === "alpha") {
                this.updateColor({ alpha: t / 100 });
                return;
            }
            const n = G({
                red: this.red,
                green: this.green,
                blue: this.blue,
                [e]: t
            });
            this.updateColor({ ...n, [e]: t });
        }
    }
};
function Le(e, t, n, o, r, s) {
    const i = h("RGBItem");
    return d(), p(S, null, [
        g(i, {
            value: e.red,
            type: "number",
            label: "R",
            onChange: (a) => e.changeValue("red", a)
        }, null, 8, ["value", "onChange"]),
        g(i, {
            value: e.green,
            type: "number",
            label: "G",
            onChange: (a) => e.changeValue("green", a)
        }, null, 8, ["value", "onChange"]),
        g(i, {
            value: e.blue,
            type: "number",
            label: "B",
            onChange: (a) => e.changeValue("blue", a)
        }, null, 8, ["value", "onChange"]),
        g(i, {
            value: parseInt(e.alpha * 100, 10),
            type: "number",
            label: "Alpha",
            onChange: (a) => e.changeValue("alpha", a)
        }, null, 8, ["value", "onChange"])
    ], 64);
}
const Xe = /* @__PURE__ */ m(Me, [["render", Le]]), Te = {
    name: "Preview",
    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        updateColor: Function
    },
    components: {
        Hex: Ve,
        RGB: Xe
    }
}, Oe = { class: "color-preview-area" }, je = { class: "input-group" };
function Ue(e, t, n, o, r, s) {
    const i = h("Hex"), a = h("RGB");
    return d(), p("div", Oe, [
        u("div", je, [
            g(i, {
                red: e.red,
                green: e.green,
                blue: e.blue,
                updateColor: e.updateColor
            }, null, 8, ["red", "green", "blue", "updateColor"]),
            g(a, {
                red: e.red,
                green: e.green,
                blue: e.blue,
                alpha: e.alpha,
                updateColor: e.updateColor
            }, null, 8, ["red", "green", "blue", "alpha", "updateColor"])
        ])
    ]);
}
const O = /* @__PURE__ */ m(Te, [["render", Ue]]), Ye = {
    name: "Solid",
    props: {
        red: {
            type: Number,
            default: 255
        },
        green: {
            type: Number,
            default: 0
        },
        blue: {
            type: Number,
            default: 0
        },
        alpha: {
            type: Number,
            default: 1
        },
        hue: Number,
        saturation: Number,
        value: Number,
        onStartChange: Function,
        onChange: Function,
        onEndChange: Function
    },
    components: {
        Area: X,
        Preview: O
    },
    data() {
        return {
            colorRed: this.red,
            colorGreen: this.green,
            colorBlue: this.blue,
            colorAlpha: this.alpha,
            colorHue: 0,
            colorSaturation: 100,
            colorValue: 100,
            actions: {
                onStartChange: this.onStartChange,
                onChange: this.onChange,
                onEndChange: this.onEndChange
            }
        };
    },
    mounted() {
        const { hue: e, saturation: t, value: n } = G({ red: this.colorRed, green: this.colorGreen, blue: this.colorBlue });
        this.colorHue = e, this.colorSaturation = t, this.colorValue = n;
    },
    computed: {
        hsv() {
            return this.hue === void 0 || this.saturation === void 0 || this.value === void 0 ? G({ red: this.red, green: this.green, blue: this.blue }) : {
                hue: this.hue,
                saturation: this.saturation,
                value: this.value
            };
        },
        color() {
            return {
                red: this.red,
                green: this.green,
                blue: this.blue,
                alpha: this.alpha
            };
        }
    },
    watch: {
        hsv: function ({ hue: e, saturation: t, value: n }) {
            this.colorHue = e, this.colorSaturation = t, this.colorValue = n;
        },
        color: function ({ red: e, green: t, blue: n, alpha: o }) {
            this.colorRed = e, this.colorGreen = t, this.colorBlue = n, this.colorAlpha = o;
        }
    },
    methods: {
        updateColor({ red: e, green: t, blue: n, alpha: o, hue: r, saturation: s, value: i }, a = "onChange") {
            e = c(e, this.colorRed), t = c(t, this.colorGreen), n = c(n, this.colorBlue), o = c(o, this.colorAlpha), r = c(r, this.colorHue), s = c(s, this.colorSaturation), i = c(i, this.colorValue), this.colorRed = e, this.colorGreen = t, this.colorBlue = n, this.colorAlpha = o, this.colorHue = r, this.colorSaturation = s, this.colorValue = i;
            const l = this.actions[a];
            l && l({
                red: e,
                green: t,
                blue: n,
                alpha: o,
                hue: r,
                saturation: s,
                value: i,
                style: L(e, t, n, o)
            });
        }
    }
};
function We(e, t, n, o, r, s) {
    const i = h("Area"), a = h("Preview");
    return d(), p(S, null, [
        g(i, {
            red: e.colorRed,
            green: e.colorGreen,
            blue: e.colorBlue,
            alpha: e.colorAlpha,
            hue: e.colorHue,
            saturation: e.colorSaturation,
            value: e.colorValue,
            updateColor: e.updateColor,
            "is-gradient": !1
        }, null, 8, ["red", "green", "blue", "alpha", "hue", "saturation", "value", "updateColor"]),
        g(a, {
            red: e.colorRed,
            green: e.colorGreen,
            blue: e.colorBlue,
            alpha: e.colorAlpha,
            updateColor: e.updateColor
        }, null, 8, ["red", "green", "blue", "alpha", "updateColor"])
    ], 64);
}
const ze = /* @__PURE__ */ m(Ye, [["render", We]]), qe = {
    name: "GradientControls",
    props: {
        type: String,
        degree: Number,
        changeGradientControl: {
            type: Function,
            default: () => {
            }
        }
    },
    data() {
        return {
            disableClick: !1,
            mouseEvents: () => {
            }
        };
    },
    mounted() {
        this.mouseEvents = N(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },
    computed: {
        degreesStyle() {
            return { transform: `rotate(${this.degree}deg)` };
        }
    },
    methods: {
        mouseDownHandler(e) {
            const n = e.target.getBoundingClientRect(), o = n.top + parseInt(8 - window.pageYOffset, 10), r = n.left + parseInt(8 - window.pageXOffset, 10);
            return {
                centerY: o,
                centerX: r
            };
        },
        mouseMoveHandler(e, { centerX: t, centerY: n }) {
            this.disableClick = !0;
            const o = K(e.clientX, e.clientY, t, n);
            this.changeGradientControl({ degree: parseInt(o, 10) });
        },
        mouseUpHandler(e) {
            const t = e.target.classList;
            t.contains("gradient-degrees") || t.contains("icon-rotate") || (this.disableClick = !1);
        },
        onClickGradientDegree() {
            if (this.disableClick) {
                this.disableClick = !1;
                return;
            }
            let e = this.degree + 45;
            e >= 360 && (e = 0), this.changeGradientControl({ degree: parseInt(e, 10) });
        }
    }
}, Je = { class: "gradient-controls" }, Ke = { class: "gradient-type" }, Qe = {
    key: 0,
    class: "gradient-degrees-options"
}, Ze = /* @__PURE__ */ u("div", { class: "gradient-degree-pointer" }, null, -1), _e = [
    Ze
], xe = { class: "gradient-degree-value" };
function et(e, t, n, o, r, s) {
    return d(), p("div", Je, [
        u("div", Ke, [
            u("div", {
                class: P(`gradient-type-item liner-gradient ${e.type === "linear" ? "active" : ""}`),
                onClick: t[0] || (t[0] = () => e.changeGradientControl({ type: "linear" }))
            }, null, 2),
            u("div", {
                class: P(`gradient-type-item radial-gradient ${e.type === "radial" ? "active" : ""}`),
                onClick: t[1] || (t[1] = () => e.changeGradientControl({ type: "radial" }))
            }, null, 2)
        ]),
        e.type === "linear" ? (d(), p("div", Qe, [
            u("div", {
                class: "gradient-degrees",
                onMousedown: t[2] || (t[2] = (...i) => e.mouseEvents && e.mouseEvents(...i)),
                onClick: t[3] || (t[3] = (...i) => e.onClickGradientDegree && e.onClickGradientDegree(...i))
            }, [
                u("div", {
                    class: "gradient-degree-center",
                    style: b(e.degreesStyle)
                }, _e, 4)
            ], 32),
            u("div", xe, [
                u("p", null, R(e.degree) + "° ", 1)
            ])
        ])) : E("", !0)
    ]);
}
const tt = /* @__PURE__ */ m(qe, [["render", et]]), nt = {
    name: "Gradient",
    props: {
        type: {
            type: String,
            default: "linear"
        },
        degree: {
            type: Number,
            default: 0
        },
        points: {
            type: Array,
            default: () => [
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
        onStartChange: Function,
        onChange: Function,
        onEndChange: Function
    },
    components: {
        GradientControls: tt,
        Area: X,
        Preview: O
    },
    data() {
        return {
            activePointIndex: 0,
            gradientPoints: this.points,
            activePoint: this.points[0],
            colorRed: this.points[0].red,
            colorGreen: this.points[0].green,
            colorBlue: this.points[0].blue,
            colorAlpha: this.points[0].alpha,
            colorHue: 0,
            colorSaturation: 100,
            colorValue: 100,
            gradientType: this.type,
            gradientDegree: this.degree,
            actions: {
                onStartChange: this.onStartChange,
                onChange: this.onChange,
                onEndChange: this.onEndChange
            }
        };
    },
    mounted() {
        const { hue: e, saturation: t, value: n } = G({ red: this.colorRed, green: this.colorGreen, blue: this.colorBlue });
        this.colorHue = e, this.colorSaturation = t, this.colorValue = n, document.addEventListener("keyup", this.keyUpHandler);
    },
    beforeDestroy() {
        document.removeEventListener("keyup", this.keyUpHandler);
    },
    methods: {
        removePoint(e = this.activePointIndex) {
            this.gradientPoints.length <= 2 || (this.gradientPoints.splice(e, 1), e > 0 && (this.activePointIndex = e - 1), this.onChange && this.onChange({
                points: this.gradientPoints,
                type: this.gradientType,
                degree: this.gradientDegree,
                style: $(this.gradientPoints, this.gradientType, this.gradientDegree)
            }));
        },
        keyUpHandler(e) {
            (e.keyCode === 46 || e.keyCode === 8) && this.removePoint(this.activePointIndex);
        },
        changeActivePointIndex(e) {
            this.activePointIndex = e, this.activePoint = this.gradientPoints[e];
            const { red: t, green: n, blue: o, alpha: r } = this.activePoint;
            this.colorRed = t, this.colorGreen = n, this.colorBlue = o, this.colorAlpha = r;
            const { hue: s, saturation: i, value: a } = G({ red: t, green: n, blue: o });
            this.colorHue = s, this.colorSaturation = i, this.colorValue = a;
        },
        changeGradientControl({ type: e, degree: t }) {
            e = c(e, this.gradientType), t = c(t, this.gradientDegree), this.gradientType = e, this.gradientDegree = t, this.onChange({
                points: this.gradientPoints,
                type: this.gradientType,
                degree: this.gradientDegree,
                style: $(this.gradientPoints, this.gradientType, this.gradientDegree)
            });
        },
        updateColor({ red: e, green: t, blue: n, alpha: o, hue: r, saturation: s, value: i }, a = "onChange") {
            e = c(e, this.colorRed), t = c(t, this.colorGreen), n = c(n, this.colorBlue), o = c(o, this.colorAlpha), r = c(r, this.colorHue), s = c(s, this.colorSaturation), i = c(i, this.colorValue);
            const l = this.gradientPoints.slice();
            l[this.activePointIndex] = {
                ...l[this.activePointIndex],
                red: e,
                green: t,
                blue: n,
                alpha: o
            }, this.colorRed = e, this.colorGreen = t, this.colorBlue = n, this.colorAlpha = o, this.colorHue = r, this.colorSaturation = s, this.colorValue = i, this.gradientPoints = l;
            const f = this.actions[a];
            f && f({
                points: l,
                type: this.gradientType,
                degree: this.gradientDegree,
                style: $(l, this.gradientType, this.gradientDegree)
            });
        },
        updateGradientLeft(e, t, n = "onChange") {
            this.gradientPoints[t].left = e;
            const o = this.actions[n];
            o && o({
                points: this.gradientPoints,
                type: this.gradientType,
                degree: this.gradientDegree,
                style: $(this.gradientPoints, this.gradientType, this.gradientDegree)
            });
        },
        addPoint(e) {
            this.gradientPoints.push({
                ...this.gradientPoints[this.activePointIndex],
                left: e
            }), this.activePointIndex = this.gradientPoints.length - 1, this.onChange && this.onChange({
                points: this.gradientPoints,
                type: this.gradientType,
                degree: this.gradientDegree,
                style: $(this.gradientPoints, this.gradientType, this.gradientDegree)
            });
        }
    }
};
function ot(e, t, n, o, r, s) {
    const i = h("GradientControls"), a = h("Area"), l = h("Preview");
    return d(), p(S, null, [
        g(i, {
            type: e.gradientType,
            degree: e.gradientDegree,
            changeGradientControl: e.changeGradientControl
        }, null, 8, ["type", "degree", "changeGradientControl"]),
        g(a, {
            red: e.colorRed,
            green: e.colorGreen,
            blue: e.colorBlue,
            alpha: e.colorAlpha,
            hue: e.colorHue,
            saturation: e.colorSaturation,
            value: e.colorValue,
            updateColor: e.updateColor,
            "is-gradient": !0,
            type: e.gradientType,
            degree: e.gradientDegree,
            points: e.gradientPoints,
            activePointIndex: e.activePointIndex,
            changeGradientControl: e.changeGradientControl,
            changeActivePointIndex: e.changeActivePointIndex,
            updateGradientLeft: e.updateGradientLeft,
            addPoint: e.addPoint,
            removePoint: e.removePoint
        }, null, 8, ["red", "green", "blue", "alpha", "hue", "saturation", "value", "updateColor", "type", "degree", "points", "activePointIndex", "changeGradientControl", "changeActivePointIndex", "updateGradientLeft", "addPoint", "removePoint"]),
        g(l, {
            red: e.colorRed,
            green: e.colorGreen,
            blue: e.colorBlue,
            alpha: e.colorAlpha,
            updateColor: e.updateColor
        }, null, 8, ["red", "green", "blue", "alpha", "updateColor"])
    ], 64);
}
const rt = /* @__PURE__ */ m(nt, [["render", ot]]), it = {
    name: "ColorPicker",
    props: {
        isGradient: {
            type: Boolean,
            default: !1
        },
        color: {
            type: Object,
            default: () => ({
                red: 255,
                green: 0,
                blue: 0,
                alpha: 1,
                hue: 0,
                saturation: 100,
                value: 100
            })
        },
        gradient: {
            type: Object,
            default: () => ({
                type: "linear",
                degree: 0,
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
            })
        },
        onStartChange: {
            type: Function,
            default: () => {
            }
        },
        onChange: {
            type: Function,
            default: () => {
            }
        },
        onEndChange: {
            type: Function,
            default: () => {
            }
        }
    },
    components: {
        Solid: ze,
        Gradient: rt
    }
}, st = { class: "ui-color-picker" };
function at(e, t, n, o, r, s) {
    const i = h("Gradient"), a = h("Solid");
    return d(), p("div", st, [
        e.isGradient ? (d(), w(i, {
            key: 0,
            points: e.gradient.points,
            type: e.gradient.type,
            degree: e.gradient.degree,
            onChange: e.onChange,
            onStartChange: e.onStartChange,
            onEndChange: e.onEndChange
        }, null, 8, ["points", "type", "degree", "onChange", "onStartChange", "onEndChange"])) : (d(), w(a, {
            key: 1,
            red: e.color.red,
            green: e.color.green,
            blue: e.color.blue,
            alpha: e.color.alpha,
            hue: e.color.hue,
            saturation: e.color.saturation,
            value: e.color.value,
            onChange: e.onChange,
            onStartChange: e.onStartChange,
            onEndChange: e.onEndChange
        }, null, 8, ["red", "green", "blue", "alpha", "hue", "saturation", "value", "onChange", "onStartChange", "onEndChange"]))
    ]);
}
const ut = /* @__PURE__ */ m(it, [["render", at]]);
export {
    ut as ColorPicker
};