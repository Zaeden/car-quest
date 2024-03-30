// import adapter from "@sveltejs/adapter-auto";
// import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
// /** @type {import('@sveltejs/kit').Config} */
// const config = {
//   kit: {
//     adapter: adapter(),
//   },
//   preprocess: vitePreprocess(),
//   ssr: false
// };
// export default config;

import node from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: node(),
    methodOverride: {
      allowed: ["PATCH", "DELETE"],
    },
  },
  preprocess: vitePreprocess(),
  ssr: false,
};
export default config;
