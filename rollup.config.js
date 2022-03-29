import { DEFAULT_EXTENSIONS } from '@babel/core'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import url from '@rollup/plugin-url'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer'
import typescript from 'rollup-plugin-typescript2'
import ttypescript from 'ttypescript'

import packageJson from './package.json'

const extensions = DEFAULT_EXTENSIONS.concat(['.ts', '.tsx'])

const commonPlugins = [
    typescript({
        typescript: ttypescript,
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
        declarationDir: './dist',
        tsconfigDefaults: {
            noEmit: false,
            emitDeclarationOnly: true,
            compilerOptions: {
                plugins: [
                    { transform: 'typescript-transform-paths' },
                    { transform: 'typescript-transform-paths', afterDeclarations: true },
                ],
            },
            exclude: [
                '**/__mocks__/*',
                '**/*.stories.tsx',
                '**/*.spec.ts',
                '**/*.spec.tsx'
            ],
        },
    }),
    commonjs(),
    json(),
    babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        extensions,
    }),
    peerDepsExternal(),
    terser(),
    url(),
    visualizer({
        filename: 'stats.html',
    }),
]

function setUpConfig({ output }) {
    return {
        input: 'src/index.ts',
        output: {
            ...output,
            sourcemap: true,
        },
        plugins: [
            nodeResolve({
                mainFields: output.format === 'cjs' ? ['main', 'module'] : undefined,
                extensions,
            }),
            ...commonPlugins,
        ],
        external: [/@babel\/runtime/],
        preserveModules: output.format === 'esm'
    }
}

export default [
    setUpConfig({
        output: {
            file: packageJson.main,
            format: 'cjs',
        }
    }),
    setUpConfig({
        output: {
            dir: 'dist',
            format: 'esm',
        }
    }),
]
