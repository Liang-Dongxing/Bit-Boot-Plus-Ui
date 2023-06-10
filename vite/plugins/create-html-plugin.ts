import { createHtmlPlugin } from 'vite-plugin-html';

export default (viteEnv: any) => {
  return createHtmlPlugin({
    inject: {
      data: {
        title: viteEnv.VITE_APP_TITLE
      }
    }
  });
};
