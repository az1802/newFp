<template>
  <div class="mine">
    <NavigationBar :showArrow="false" title="我的" />
    <div class="user-container">
      <img
        class="top-bg"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-mine/pic-top_bg.png"
        alt=""
      />
      <div class="user-wrapper">
        <div class="avatar-wrapper">
          <img
            v-if="userInfo.avatarUrl || userInfo.avatar"
            :src="userInfo.avatarUrl || userInfo.avatar"
            alt=""
            class="avatar"
          />
          <img
            v-else
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-avatar.svg"
            alt=""
            class="avatar"
          />
        </div>
        <p class="user-name">
          {{
            userInfo.userId || userId
              ? userInfo.nickName || userInfo.nickname
              : "立即登录"
          }}
        </p>
      </div>
    </div>
    <div class="count-container">
      <div class="count-wrapper common-card">
        <div class="content">
          <p class="number">{{ stats.sumUsedCoupons || "0" }}</p>
          <p class="desc">用券次数</p>
        </div>
        <div class="content">
          <p class="number">{{ (stats.sumSavingAmount || 0) / 100 }}</p>
          <p class="desc">已节省(元)</p>
        </div>
      </div>
    </div>
    <div class="category-container">
      <div class="category-wrapper common-card">
        <div class="category" @click="navigateTo('MINE/WALLET')">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-wallet.svg"
            alt=""
            class="icon"
          />
          <p class="desc">钱包</p>
        </div>
        <div class="category" @click="navigateTo('MINE/COUPON')">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-coupon.svg"
            alt=""
            class="icon"
          />
          <p class="desc">优惠券</p>
        </div>
        <div class="category" @click="navigateTo('MINE/FEEDBACK')">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-feedback.svg"
            alt=""
            class="icon"
          />
          <p class="desc">反馈</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { useNavigate } from "@hooks/commonHooks";
import { useUserInfo, useUserStats } from "@hooks/userHooks";
import { computed, onBeforeMount } from "vue";

export default {
  setup() {
    const { navigateTo } = useNavigate();
    const { userInfo, requestUserInfo } = useUserInfo();
    let userId = uni.getStorageSync("userId");
    const { stats, requestUserStats } = useUserStats();
    onBeforeMount(() => {
      requestUserInfo();
      requestUserStats();
    });
    return {
      navigateTo,
      userInfo,
      stats,
      userId,
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.mine {
  width: 100%;

  .common-card {
    background: #fff !important;
    box-shadow: 0px 1px 5px 0px rgba(223, 210, 210, 0.5);
    border-radius: 10px !important;
  }

  .user-container {
    position: relative;
    width: 100%;
    height: 42.5334vw;

    .top-bg {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .user-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      padding-top: 22px;

      .avatar-wrapper {
        width: 60px;
        height: 60px;
        border-radius: 100%;
        background: white;

        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 100%;
        }
      }

      .user-name {
        margin-top: 7.5px;
        font-size: 16px;
        color: white;
      }
    }
  }

  .count-container {
    position: relative;
    margin-top: -40px;
    width: 100%;
    height: 75px;
    box-sizing: border-box;
    padding: 0 10px;

    .count-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 75px;
      box-sizing: border-box;

      .content {
        flex: 1;
        box-sizing: border-box;
        text-align: center;

        &:first-child {
          border-right-1px();
        }

        .number {
          font-weight: 500;
          font-size: 27px;
          color: #E3513F;
        }

        .desc {
          margin-top: 8px;
          font-size: $font-size-13;
          color: #868686;
        }
      }
    }
  }

  .category-container {
    height: 105px;
    margin-top: 10px;
    padding: 0 10px;

    .category-wrapper {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;

      .category {
        flex: 1;

        .icon {
          display: block;
          width: 40px;
          height: 40px;
          margin: auto;
        }

        .desc {
          margin-top: 12px;
          text-align: center;
          color: #353535;
          font-size: $font-size-11;
        }
      }
    }
  }

  .order-container {
    padding: 10px;
    overflow: hidden;
    transition: height 0.5s;

    .order-wrapper {
      height: 100%;
      padding: 0 10px;

      .header-wrapper {
        height: 35px;
        line-height: 35px;
        font-size: $font-size-14;
        color: #595959;
      }

      .order-content {
        .tab-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 70px;

          .tab {
            flex: 1;

            &:nth-child(1) .icon {
              width: 26.39px;
            }

            &:nth-child(2) .icon {
              width: 29.43px;
            }

            .icon {
              display: block;
              height: 34px;
              margin: 0 auto;
            }

            .desc {
              margin-top: 4px;
              text-align: center;
              font-size: $font-size-11;
              color: #595959;
            }
          }
        }
      }

      .recently-order {
        height: 68px;
        box-sizing: border-box;
        padding: 10px 10px 7px;
        background: #F7F4F4;

        .title {
          font-size: 9px;
          color: #888888;
        }

        .order {
          display: flex;
          margin-top: 5px;

          .picture {
            flex: 0 33px;
            width: 33px;
            height: 33px;
            margin-right: 10px;
            background: #FFF;
          }

          .desc {
            flex: 1;
            overflow: hidden;

            .name {
              no-wrap();
              font-size: $font-size-13;
              color: #595959;
            }

            .time {
              margin-top: 8px;
              font-size: 9px;
              color: #888888;
            }
          }

          .status {
            font-size: $font-size-11;
            color: #E3513F;
          }
        }
      }
    }
  }
}
</style>
