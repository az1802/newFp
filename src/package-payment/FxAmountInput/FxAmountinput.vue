<template>
  <view class="keyboard-main" :style="{ height: height + 'px' }">
    <view class="input-icon-box">
      <text class="input-icon" :style="{ fontSize: fontSize + 'px' }">{{
        currency
      }}</text>
    </view>
    <view class="keyboard-content" :style="{ height: height + 'px' }">
      <view
        class="placeholder"
        :style="{
          fontSize: parseInt((fontSize / 3) * 2) + 'px',
          height: height + 'px',
        }"
        v-if="!money"
      >
        {{ placeholder }}
      </view>
      <view
        class="input"
        :class="{ zIndex: isShow }"
        :style="{
          fontSize: size + 'px',
          height: height + 'px',
          fontWeight: isBold ? 'bold' : 'initial',
        }"
        @click.stop="show"
      >
        <span id="text">
          <block v-if="isFilter">
            {{ filterMoney(money) }}
          </block>
          <block v-if="!isFilter">
            {{ money }}
          </block>
          <view
            class="line"
            :style="{
              height: parseInt((height / 4) * 3) + 'px',
              background: btnColor,
            }"
          ></view>
        </span>
      </view>
    </view>
    <!-- <view class="mask" v-if="isShow"></view> -->
    <div
      class="keyboard"
      :class="isShow ? 'keyboard1' : 'keyboard2'"
      v-if="isShow"
    >
      <div class="money-box">
        <div @click.stop="hide" class="glyph-box">
          <image
            class="glyph"
            src="/static/Glyph.png"
            mode="aspectFill"
          ></image>
        </div>
        <div class="money-content">
          <div class="content">
            <div class="text" v-if="!buyCouponInfo || !buyCouponInfo.id">
              实付金额:
            </div>
            <div
              class="buy-coupon-info"
              v-if="buyCouponInfo && buyCouponInfo.id"
            >
              <img
                src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/money-icon.png"
                alt=""
                class="money-icon"
              />
              <div class="text">含特惠券包¥{{ buyCouponInfo.price / 100 }}</div>
            </div>
            <div class="icon">￥</div>
            <div class="money">
              {{ parseFloat((actuallyPaid || 0) / 100).toFixed(2) }}
            </div>
          </div>
          <div class="hint-text" v-if="fanpiaoMoney">
            预估饭票余额￥{{ fanpiaoMoney / 100 }}
          </div>
          <div class="hint-text" v-if="showCouponReducest && selCoupon.id">
            优惠￥{{ selCoupon.reduceCost / 100 }}
          </div>
          <div class="hint-text" v-if="buyCouponInfo && buyCouponInfo.id">
            优惠￥{{ buyCouponInfo.couponCost / 100 }}
          </div>
        </div>
      </div>
      <div class="keyboard-content">
        <div class="left">
          <div class="left-item">
            <view
              class="key-cell item-key-cell1"
              @click.stop="_handleKeyPress(1)"
              >1</view
            >
            <view
              class="key-cell item-key-cell2"
              @click.stop="_handleKeyPress(2)"
              >2</view
            >
          </div>
          <div class="left-item">
            <view
              class="key-cell item-key-cell1"
              @click.stop="_handleKeyPress(4)"
              >4</view
            >
            <view
              class="key-cell item-key-cell2"
              @click.stop="_handleKeyPress(5)"
              >5</view
            >
          </div>
          <div class="left-item">
            <view
              class="key-cell item-key-cell1"
              @click.stop="_handleKeyPress(7)"
              >7</view
            >
            <view
              class="key-cell item-key-cell2"
              @click.stop="_handleKeyPress(8)"
              >8</view
            >
          </div>
          <div class="left-item last-left-item">
            <view
              class="key-cell item-key-cell3"
              @click.stop="_handleKeyPress(0)"
              >0</view
            >
          </div>
        </div>
        <div class="right">
          <div class="right-item right-item1">
            <view
              class="key-cell item-key-cell"
              @click.stop="_handleKeyPress(3)"
              >3</view
            >
            <view
              class="key-cell item-key-cell"
              @click.stop="_handleKeyPress(6)"
              >6</view
            >
            <view
              class="key-cell item-key-cell"
              @click.stop="_handleKeyPress(9)"
              >9</view
            >
            <view
              class="key-cell item-key-cell"
              @click.stop="_handleKeyPress('.')"
              >.</view
            >
          </div>
          <div class="right-item right-item2">
            <view
              class="key-cell key-cell2 item-key-cell"
              @click.stop="_handleKeyPress('delete')"
            >
              <!-- <image class="key-cell-icon" src="/static/backspace.png" mode="aspectFill"></image> -->
            </view>
            <view class="key-confirm" @click.stop="_handleConfirmKey">
              {{ confirmText }}</view
            >
          </div>
        </div>
      </div>
      <div class="isIphonex" v-if="isIphonex"></div>
    </div>
  </view>
</template>
<script>
import { throttle } from "@utils";

export default {
  name: "keyBoard",
  props: {
    confirmText: {
      default: "付款",
      type: String,
    },
    btnColor: {
      default: "#F25643",
      type: String,
    },
    txtColor: {
      default: "rgba(255, 255, 255, 0.6)",
      type: String,
    },
    placeholder: {
      default: "",
      type: String,
    },
    currency: {
      default: "￥",
      type: String,
    },
    maxNumber: {
      default: 100000000000,
      type: Number,
    },
    fontSize: {
      type: [String, Number],
      default: 30,
    },
    isBold: {
      type: Boolean,
      default: true,
    },
    isFilter: {
      type: Boolean,
      default: true,
    },
    actuallyPaid: {
      default: 0,
      type: Number,
    },
    selCoupon: {
      default: {},
      type: Object,
    },
    showCouponReducest: {
      default: false,
      type: Boolean,
    },
    buyCouponInfo: {
      default: {},
      type: Object,
    },
    CouponMoney: {
      default: 0,
      type: Number,
    },
    fanpiaoMoney: {
      default: 0,
      type: Number,
    },
    isFanpiaoMoneyShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fristShow: true,
      isShow: false,
      size: 0,
      height: 0,
      allWidth: 0,
      money: "",
    };
  },
  created() {
    this.height = this.fontSize;
    this.size = this.fontSize;
    var query = uni.createSelectorQuery().in(this);
    setTimeout(() => {
      this.show();
      query
        .select(".keyboard-content")
        .boundingClientRect((data) => {
          this.allWidth = data.width;
        })
        .exec();
    }, 200);
  },
  watch: {
    money(val) {
      this.$emit("change", parseFloat(val));
    },
  },
  computed: {
    isIphonex() {
      return getApp().globalData.isIphonex;
    },
  },
  methods: {
    show() {
      this.isShow = true;
      this.fristShow = true;
    },
    hide() {
      this.fristShow = true;
      this.isShow = false;
    },
    filterMoney(value) {
      if (!value) {
        return "";
      } else {
        value = value.replace(/\$\s?|(,*)/g, "");
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },
    //处理按键
    _handleKeyPress(num) {
      if (num == -1) return false;
      switch (String(num)) {
        //小数点
        case ".":
          this._handleDecimalPoint();
          break;
        //删除键
        case "delete":
          this._handleDeleteKey();
          break;
        //确认键
        case "confirm":
          this._handleConfirmKey();
          break;
        default:
          this._handleNumberKey(num);
          break;
      }
    },
    //处理小数点函数
    _handleDecimalPoint() {
      //如果包含小数点，直接返回
      if (this.money.indexOf(".") > -1) return false;
      //如果小数点是第一位，补0
      if (!this.money.length) this.money = "0.";
      //如果不是，添加一个小数点
      else this.money = this.money + ".";
      var query = uni.createSelectorQuery().in(this);
      query
        .select("#text")
        .boundingClientRect((data) => {
          var _w = data.width;
          if (_w + Number(this.size) > this.allWidth) {
            this.size -= 5;
          }
        })
        .exec();
    },
    //处理删除键
    _handleDeleteKey() {
      let S = this.money;
      //如果没有输入，直接返回
      if (!S.length) return false;
      //否则删除最后一个
      this.money = S.substring(0, S.length - 1);
      // var query = uni.createSelectorQuery().in(this)
      // query.select('#input-text').boundingClientRect(data => {
      // 	var _w = data.width;
      // 	if(_w+20<this.allWidth && this.size<this.height){
      // 		this.size +=5
      // 	}
      // }).exec();
    },
    //处理数字
    _handleNumberKey(num) {
      if (Number(this.money + num) > this.maxNumber) {
        return;
      }
      let S = this.money;
      //如果有小数点且小数点位数不小于2
      if (S.indexOf(".") > -1 && S.substring(S.indexOf(".") + 1).length < 2)
        this.money = S + num;
      if (S.indexOf(".") > -1 && S.substring(S.indexOf(".") + 1).length >= 2)
        return;
      //没有小数点
      if (!(S.indexOf(".") > -1)) {
        //如果第一位是0，只能输入小数点
        if (num == 0 && S.length == 0) this.money = "0.";
        else {
          if (S.length && Number(S.charAt(0)) === 0) return;
          this.money = S + num;
        }
      }
      var query = uni.createSelectorQuery().in(this);
      query
        .select("#text")
        .boundingClientRect((data) => {
          var _w = data.width;
          if (_w + Number(this.size) > this.allWidth) {
            this.size -= 5;
          }
        })
        .exec();
    },

    //提交
    _handleConfirmKey: throttle(function () {
      if (!this.money) {
        this.$emit("confirm", parseFloat(0));
        return false;
      }
      let S = this.money;
      //未输入
      if (!S.length || S == 0) {
        // uni.showToast({
        // 	title: this.placeholder,
        // 	icon:'none',
        // 	duration: 1000
        // });
        this.$emit("confirm", parseFloat(0));
        return false;
      }
      //将 8. 这种转换成 8.00
      if (S.indexOf(".") > -1 && S.indexOf(".") == S.length - 1)
        S = Number(S.substring(0, S.length - 1)).toFixed(2);
      //保留两位
      S = Number(S).toFixed(2);
      this.$emit("confirm", parseFloat(S)); //提交参数
    }, 1000),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@keyframes fadelogIn {
  0% {
    transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  100% {
    transform: none;
  }
}

.keyboard-main {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 0px 0 16px 0;
  box-sizing: initial;
  color: #1B1B1B;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);

  text {
    font-size: 24px;
    margin-right: 10px;
  }
}

.input-icon-box {
  position: relative;
  width: 35px;
  margin-left: -5px;

  .input-icon {
    font-weight: 600;
    position: absolute;
    left: 0;
    bottom: -4px;
  }
}

.keyboard-content {
  width: 100%;
  height: 30px;
  position: relative;

  .placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    color: #c0c4cc;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
  }

  .input {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    font-size: 30px;
    font-weight: bold;

    &.zIndex {
      z-index: 999;
    }

    #text {
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      height: 30px;
      line-height: 30px;
    }

    .line {
      display: inline-block;
      width: 2px;
      height: 30px;
      border: 1px;
      background-color: #0063E5;
      margin-left: 4px;
      animation: cursorImg 1s infinite steps(1, start);

      @keyframes cursorImg {
        0%, 100% {
          opacity: 0;
        }

        50% {
          opacity: 1;
        }
      }
    }
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.keyboard {
  flex: 1;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #F7F7F7;
  animation: fadelogIn 0.4s;
  box-sizing: border-box;
  border-radius: 24px 24px 0px 0px;
  z-index: 999;

  .money-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 16px;
    box-sizing: border-box;
    height: 60px;

    .glyph-box {
      width: 50px;

      .glyph {
        width: 20px;
        height: 17px;
      }
    }

    .money-content {
      text-align: right;

      .content {
        line-height: 28px;

        .text {
          display: inline-block;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.8);
        }

        .icon {
          display: inline-block;
          font-size: 14px;
          color: #F25643;
        }

        .money {
          display: inline-block;
          font-size: 24px;
          color: #F25643;
          font-weight: bold;
        }

        .buy-coupon-info {
          height: 22px;
          line-height: 22px;
          padding: 0 4px;
          background: rgba(255, 225, 173, 1);
          display: inline-flex;
          justify-content: flex-start;
          align-items: center;
          border-radius: 4px;
          margin-right: 4px;

          .money-icon {
            width: 16px;
            height: 12px;
            margin-right: 2px;
          }

          .text {
            font-size: 10px;
            color: rgba(121, 74, 7, 1);
          }
        }
      }

      .hint-text {
        font-size: 10px;
        color: rgba(0, 0, 0, 0.8);
        line-height: 14px;
        margin-top: -2px;
      }
    }
  }

  .keyboard-content {
    display: flex;
    width: 100%;
    height: 200px;
    box-sizing: border-box;
    margin-bottom: 6px;

    .left {
      flex: 1;
      margin: 0 3px 0 6px;

      .left-item {
        display: flex;
        height: 44px;
        margin-bottom: 6px;
        width: 100%;

        .item-key-cell1 {
          margin-right: 3px;
          flex: 1;
        }

        .item-key-cell2 {
          margin-left: 3px;
          flex: 1;
        }

        .item-key-cell3 {
          flex: 1;
        }
      }
    }

    .right {
      display: flex;
      flex: 1;
      margin: 0 6px 0 3px;

      .right-item {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .right-item1 {
        margin-right: 3px;
      }

      .right-item2 {
        margin-left: 3px;
      }

      .item-key-cell {
        margin-bottom: 6px;
      }
    }
  }
}

.key-cell {
  font-size: 20px;
  height: 44px;
  background: #FCFCFE;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  box-shadow: 0px 1px 0px 0px rgba(137, 138, 141, 0.4);
}

.key-confirm {
  flex: 1;
  background: #F25643;
  box-shadow: 0px 1px 0px 0px rgba(242, 86, 67, 0.4);
  border-radius: 4px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
}

.key-cell-icon {
  width: 24px;
  height: 18px;
}

.key-cell:active {
  color: white;
  background: #F25643;
  box-shadow: 0px 1px 0px 0px rgba(242, 86, 67, 0.6);
  opacity: 0.8;
}

.key-cell2 {
  background: url('https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/backspace.png') 0 0 / 100% 100%;
}

.key-cell2:active {
  background: url('https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/backspace-active.png') 0 0 / 100% 100%;
}
</style>
