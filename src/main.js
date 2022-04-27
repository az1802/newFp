import {
  createSSRApp
} from "vue";
import App from "./App.vue";
import store from '@state/store'
import '@design/index.less'
import '@design/custom-colorui-icon.css'
// import base from "./base";
// import baseCommon from "./base-common";

// const AppPlugin = {
//   install: function (app, params) {
//     app.mixin(base)
//     app.mixin(baseCommon)
//   }
// }

export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  // app.use(AppPlugin)
  return {
    app,
  };
}
