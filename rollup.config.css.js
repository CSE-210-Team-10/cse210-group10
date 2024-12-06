import cssnano from 'cssnano';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';

export default {
  input: 'input.css',
  plugins: [
    postcss({
      extract: true,
      plugins: [
        postcssImport(), // Add this to handle @import rules
        cssnano({
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        }),
      ],
    }),
  ],
};
