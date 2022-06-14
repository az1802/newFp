<template>
  <div class="time-counter-wrapper">
    <div class="time">
      <div class="time-item" v-if="isShowHour">
        {{ hour }}
      </div>
      <div class="time-separate" v-if="isShowHour">:</div>
      <div class="time-item">
        {{ min }}
      </div>
      <div class="time-separate">:</div>
      <div class="time-item">
        {{ second }}
      </div>
      <div class="time-separate">:</div>
      <div class="time-item">
        {{ millisecond }}
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
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
    formateTimeNumber(number) {
      number = parseFloat(number);
      return number < 10 ? "0" + number : number;
    },
    _initData(endDate) {
      clearInterval(this.intervalTimeId);
      let currentTime = new Date();
      let day = currentTime.getDay(),
        date = currentTime.getDate();
      if (!endDate) {
        endDate = new Date();
        if (day == 0) {
          date = date + 1;
        } else {
          date = date + (7 - day) + 1;
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
        this.second = this.formateTimeNumber(
          parseInt(timesDifference / 1000) % 60
        );
        this.min = this.formateTimeNumber(
          parseInt(timesDifference / (1000 * 60)) % 60
        );
        this.hour = this.formateTimeNumber(
          parseInt(timesDifference / (1000 * 60 * 60)) % 24
        );
        this.day = parseInt(timesDifference / (1000 * 60 * 60 * 24));
      }, intervaltime);
    },
  },
};
</script>

<style scoped lang="less">
@import "@design/index.less";
.time-counter-wrapper {
  .time {
    .flex-simple(flex-start,center);
    text-align: center;
    height: 20px;
    .time-item {
      .box-size(20px,100%,#FE5C33);
      .normal-font(12px,white);
      .line-center(20px);
      border-radius: 2px;
    }

    .time-separate {
      .box-size(9.5px,100%);
      .normal-font(12px,#FE5C33);
      .line-center(20px);
      border-radius: 2px;
      text-align: center;
    }
  }
}
</style>