<!--
 * @Author: sunjie
 * @Date: 2022-01-20 18:54:05
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:18:56
 * @FilePath: /new-fanpiao-uniapp/src/App.vue
-->
<script>
import http from "@api/http";
import AppPromise from "@utils/app-promise";
import { handleQrcodeStr } from "@utils";
export default {
  globalData: {
    systemInfo: {},
    dishesMap: {},
    hasBuyFanpiao: false,
    // dishSrollTops: [],
    // categoryScrollTops: [],
  },
  created() {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
  },
  onShow() {
    http.setHeaders({ host: "test.shilai.zhiyi.cn" });
    AppPromise.getInstance(async (resolve) => {
      await this.silenceLogin();
      resolve(true);
    });
  },
  onError(msg) {
    console.error("error--", msg);
  },
  onLaunch: function (options) {
    // 处理二维码参数
    this._handleOptions(options);
    // 检查更新
    this._checkUpdateManager();
    this._initSystemInfo();
  },
  onHide: function () {
    // console.log("App Hide");
  },
  methods: {
    _handleOptions(options) {
      const { scene } = options;
      uni.setStorageSync("scene", scene);
      //#ifdef MP-ALIPAY
      // 支付宝模式的参数解析
      if (options?.query?.qrCode) {
        this.qrCodeJson = handleQrcodeStr(options.query.qrCode);
        my.setStorageSync({
          key: "qrCode",
          data: qrCodeJson,
        });
      }
      //#endif
    },
    _checkUpdateManager() {
      //检查更新
      const updateManager = uni.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        console.log(res);
      });

      updateManager.onUpdateReady(() => {
        uni
          .showModal({
            title: "发现新的版本",
            content: "新版本已经准备好，是否重启应用？",
            confirmText: "立马重启",
          })
          .then((res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          });
      });

      updateManager.onUpdateFailed(() => {
        console.log("### onUpdateFailed");
      });
    },
    _initSystemInfo() {
      this.globalData.systemInfo = uni.getSystemInfoSync();
    },
    async silenceLogin() {
      // 初始化获取静默授权
      let userId = uni.getStorageSync("userId");
      if (!userId) {
        return;
      }
      http.setHeaders({ userId: userId });
    },
  },
};
</script>

<style>
/*每个页面公共css */
@import "./design/custom-colorui.css";
@import "./design/custom-swiper.css";
</style>
