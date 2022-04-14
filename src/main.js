import {
  createSSRApp
} from "vue";
import App from "./App.vue";
import store from '@state/store'
import '@design/index.less'
import '@design/custom-colorui-icon.css'

export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  return {
    app,
  };
}
