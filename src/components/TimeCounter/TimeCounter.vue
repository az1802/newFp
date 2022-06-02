<template>
  <div class="time-counter-wrapper">
    <div class="time">
      <div class="day-time">{{ customStartText }}</div>
      <div class="day-time" v-if="showDay">{{ day }}</div>
      <div class="day-time" v-if="showDay">天</div>
      <div
        class="time-item"
        v-if="isShowHour"
        style="margin-left: 6px"
        :class="[
          isMini ? 'time-item-mini' : '',
          isNoBg ? 'time-item-no-bg' : '',
        ]"
      >
        <div class="time-item-background"></div>
        <div class="time-item-text">{{ hour }}</div>
      </div>
      <div
        class="time-separate"
        v-if="isShowHour"
        :class="[
          isMini ? 'time-separate-mini' : '',
          isNoBg ? 'time-separate-no-bg' : '',
        ]"
      >
        :
      </div>
      <div
        class="time-item"
        :class="[
          isMini ? 'time-item-mini' : '',
          isNoBg ? 'time-item-no-bg' : '',
        ]"
      >
        <div class="time-item-background"></div>
        <div class="time-item-text">{{ min }}</div>
      </div>
      <div
        class="time-separate"
        :class="[
          isMini ? 'time-separate-mini' : '',
          isNoBg ? 'time-separate-no-bg' : '',
        ]"
      >
        :
      </div>
      <div
        class="time-item"
        :class="[
          isMini ? 'time-item-mini' : '',
          isNoBg ? 'time-item-no-bg' : '',
        ]"
      >
        <div class="time-item-background"></div>
        <div class="time-item-text">{{ second }}</div>
      </div>
      <div
        class="time-separate"
        :class="[
          isMini ? 'time-separate-mini' : '',
          isNoBg ? 'time-separate-no-bg' : '',
        ]"
      >
        .
      </div>
      <div
        class="time-item"
        :class="[
          isMini ? 'time-item-mini' : '',
          isNoBg ? 'time-item-no-bg' : '',
        ]"
      >
        <div class="time-item-background"></div>
        <div class="time-item-text">{{ millisecond }}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const COMPONENT_NAME = "TIME_COUNTER";

export default {
  name: COMPONENT_NAME,
  props: {
    showDay: {
      type: Boolean,
      default: false,
    },
    isMini: {
      type: Boolean,
      default: false,
    },
    isNoBg: {
      type: Boolean,
      default: false,
    },
    customStartText: {
      type: String,
      default: "距结束仅剩",
    },
    mode: {
      type: String,
      default: "activity",
    },
    endDate: {
      type: [Number, String],
      default: "",
    },
    isShowHour: {
      type: Boolean,
      default: true,
    },
    isStop: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      day: 0,
      hour: 0,
      min: 0,
      second: 0,
      millisecond: 0,
      intervalTimeId: "",
    };
  },
  unmounted() {
    clearInterval(this.intervalTimeId);
  },
  mounted() {
    //#ifndef MP-ALIPAY
    this._initData(this.endDate);
    //#endif
    //#ifdef MP-ALIPAY
    if (!this.isStop) {
      this._initData(this.endDate);
    }
    //#endif
  },
  watch: {
    endDate(nval, oval) {
      if (nval && !this.isStop) {
        this._initData(parseFloat(nval));
      } else {
        clearInterval(this.intervalTimeId);
      }
    },
    isStop(nval) {
      //#ifdef MP-ALIPAY
      if (nval) {
        clearInterval(this.intervalTimeId);
      } else {
        this._initData(this.endDate);
      }
      //#endif
    },
  },
  methods: {
    _initData(endDate) {
      clearInterval(this.intervalTimeId);
      let currentTime = new Date();
      let day = currentTime.getDay(),
        date = currentTime.getDate();
      if (!endDate) {
        endDate = new Date();
        if (this.mode == "fanpiao-seckill") {
          date = 31;
        } else {
          if (day == 0) {
            date = date + 1;
          } else {
            date = date + (7 - day) + 1;
          }
        }
        endDate.setDate(date);
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setSeconds(0);
        endDate.setMilliseconds(0);
      } else {
        endDate = new Date(parseFloat(endDate) * 1000);
      }

      let endTimes = endDate.getTime();
      let currentTimes = currentTime.getTime();
      let intervaltime = 100;
      //#ifdef MP-ALIPAY
      intervaltime = 500;
      //#endif
      this.intervalTimeId = setInterval(() => {
        //#ifdef MP-ALIPAY
        if (this.isStop) {
          return;
        }
        //#endif
        let timesDifference = endTimes - new Date().getTime();
        this.millisecond = parseInt((timesDifference % 1000) / 100);
        this.second = parseInt(timesDifference / 1000) % 60;
        this.min = parseInt(timesDifference / (1000 * 60)) % 60;
        this.hour = parseInt(timesDifference / (1000 * 60 * 60)) % 24;
        this.day = parseInt(timesDifference / (1000 * 60 * 60 * 24));
      }, intervaltime);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.time-counter-wrapper {
  // display inline-block
  .time {
    text-align: center;
    display: flex;
    align-items: center;

    .day-time {
      font-size: 12px;
      display: inline-block;
      padding-right: 4px;
    }

    .time-item {
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      position: relative;

      .time-item-text {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 11;
        font-size: 12px;
        color: #F25643;
        line-height: 18px;
        border-radius: 4px;
        background: linear-gradient(180deg, #FFC87B 0%, #FFF1D5 100%);
        overflow: hidden;
        font-weight: bold;
      }

      .time-item-background {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        background-color: #FFFFFF;
        position: absolute;
        top: 0;
        z-index: 10;
      }
    }

    .time-separate {
      color: #FFBC00;
      font-size: 12px;
      width: 3px;
      text-align: center;
      margin: 0 4px 0 4px;
      text-align: center;
      font-weight: bold;
    }
  }

  .time-item-mini {
    width: 14px !important;
    height: 14px !important;

    .time-item-text {
      font-size: 12px !important;
      line-height: 14px !important;
      font-weight: bold;
    }
  }

  .time-separate-mini {
    font-size: 16px !important;
    margin: -1px 1.5px 0 1px !important;
    font-weight: bold !important;
  }

  .time-item-no-bg {
    width: 14px !important;
    height: 14px !important;

    .time-item-text {
      font-size: 10px !important;
      line-height: 14px !important;
      background: #FFF7E2 !important;
      font-weight: bold !important;
      color: #F25643;
    }
  }

  .time-separate-no-bg {
    font-size: 10px !important;
    margin: 0 0 0 0 !important;
    width: 3px !important;
    color: #F25643 !important;
    font-weight: bold !important;
  }
}
</style>