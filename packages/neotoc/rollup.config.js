import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'neotoc',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [typescript()],
  },
  {
    input: 'dist/dts/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
