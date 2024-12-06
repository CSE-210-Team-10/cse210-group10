import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

export default {
  plugins: [
    postcss({
      extract: true,
      plugins: [
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
