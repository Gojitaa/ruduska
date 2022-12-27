import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import terser from "@rollup/plugin-terser"

const input = "src/index.ts"

export default [
    {
        input,
        output: {
            file: "dist/index.esm.js",
            format: "esm"
        },
        plugins: [typescript()]
    },
    {
        input,
        output: {
            file: "dist/index.js",
            format: "cjs"
        },
        plugins: [typescript()]
    },
    {
        input,
        output: {
            file: "dist/index.min.js",
            name: "index.js",
            format: "iife"
        },
        plugins: [typescript(), terser()]
    },
    {
        input,
        output: {
            file: "dist/index.d.ts",
            format: "es"
        },
        plugins: [dts()]
    }
]
