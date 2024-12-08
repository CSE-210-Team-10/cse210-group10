import { terser } from 'rollup-plugin-terser';

export default {
  output: {
    format: 'es',
  },
  plugins: [
    terser({
      compress: true,
      mangle: true,
    }),
  ],
};
