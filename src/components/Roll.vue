<template>
  
</template>

<script>
import vueSlider from "vue-slider-component";
import { mapGetters } from "vuex";
import { login } from "@/util/login";
import { api, supportCoin, restApi } from "@/network/transtion";
export default {
  name: "dice-roll",
  data() {
    return {
      roll: 50,
      amount: 0.25,
      totalAmount: 100,
      autoStatus:false,
      t:'',
      limitAmount:1,
      moreBetStatus:true,
      activenum:'',
      betNum:0
    };
  },
  components: {
    vueSlider
  },
  // activeToken 表示使用押注的代币, showToken表示显示余额的代币
  props: ["activeToken", "showToekn"],
  computed: {
    lossPercent() {
      return (98 / (this.roll - 1)).toFixed(4);
    },
    winMoney() {
      this.winAmout = this.amount * this.lossPercent;
      return (this.amount * this.lossPercent).toFixed(4);
    },
    getref() {
      let url = new URL(location.href);
      let ref = url.searchParams.get("ref");
      if (ref) {
        return ref;
      } else {
        return "";
      }
    },
    ...mapGetters(["username", "eosBalance", "otherToken"])
  },
  watch: {
    activeToken() {
      // this.getMax();
      this.amount = supportCoin[this.activeToken].minAmount;
    }
  },
  methods: {
    login() {
      login(this);
    },
    changeAmount(number) {
      if (number === 3) {
        if (this.username) {
          this.amount =
            this.activeToken === "eos" ? this.eosBalance : this.otherToken;
        }
      } else {
        this.amount *= number;
        if (this.amount < supportCoin[this.activeToken].minAmount) {
          this.amount = supportCoin[this.activeToken].minAmount;
        }
      }
    },
    doRoll () {
      var that=this;
      if (this.totalAmount) {
        if (this.amount <= this.totalAmount) {
          if(this.totalAmount)
          api(
            this.activeToken,
            "transfer",
            {
              from: this.$store.state.account.name,
              to: "richrich2222",
              quantity: this.betNum==0?this.amount:10*this.amount*this.betNum,
              memo: `playdice|${new Date().getTime()}-${this.betNum}-${this.roll}-${this.getref}`
            },
            this,
            function(res){
              if(that.autoStatus){
                that.doRoll();
              }
            },
            function(error){
              if(that.autoStatus){
                that.doRoll();
              }
            }
          );
        } else {
          this.$message.warning(
            this.$t("roll.maxPayout", { Amount: this.totalAmount })
          );
        }
      }
      
    },
    moreBet(num){
      if(this.moreBetStatus){
        this.betNum=num;
        this.activenum=num;
      }else{
        this.activenum=0;
        this.betNum=0;
      }
    }
  },
  mounted() {
    // this.getMax();
  }
};
</script>

<style lang="less">
.roll-auto{
  margin-top: 20px;
  margin-bottom: 20px;
}
.btnactive{
  background: #28b6e4!important;
  color:#fff!important;
}
.btnnoactive{
  background: #fff;
  color:#28b6e4;
}
@media (max-width: 768px) {
  .sidebar {
    position: relative !important;
    top: 0px !important;
    min-height: 70px !important;
    width: 100% !important;
  }
  .box {
    transform: rotate(0) !important;
    top: 0px !important;
  }
  .jkr-close {
    right: 0px !important;
    bottom: -320px;
    z-index: 500;
  }
  table {
    margin-top: 0 !important;
  }
}
.vue-slider-tooltip {
  display: none !important;
}
@media (max-width: 768px) {
  .roll {
    width: 100% !important;
  }
}
.roll {
  width: 660px;
  padding: 30px 15px;
  position: relative;
  .roll-header {
    height: 105px;
    background-color: #1c233f;
    display: flex;
    position: relative;
    img {
      position: absolute;
      cursor: pointer;
      margin: 8px 0 0 8px;
    }
    div {
      flex: 2;
      padding-top: 25px;
      display: flex;
      flex-direction: column;
      span {
        font-size: 12px;
        color: #7f7f7f;
        padding-bottom: 10px;
      }
      strong {
        font-size: 28px;
        color: #dbdbdb;
        line-height: 28px;
      }
    }
    div:nth-of-type(2) {
      strong {
        font-size: 48px;
        line-height: 32px;
      }
    }
  }
  .roll-main {
    min-height: 240px;
    padding: 30px;
    background-color: #161933;
    .slider-roll {
      background: #1e6b59;
      cursor: pointer;
      width: 100%;
    }
    @media (max-width: 768px) {
      .roll-middle {
        flex-direction: column;
        .field-amount {
          width: 100% !important;
        }
        .field-profit {
          div {
            padding-left: 10px;
          }
        }
      }
    }
    .roll-middle {
      display: flex;
      .field-amount {
        width: 66%;
        margin-right: 15px;
        margin-top: 15px;
        .title {
          text-align: left;
          font-size: 12px;
          line-height: 12px;
          color: #7f7f7f;
          padding-left: 10px;
        }
        .content {
          display: flex;
          flex-wrap: nowrap;
          height: 32px;
          width: 100%;
          color: #fff;
          font-size: 16px;
          margin-top: 10px;
          padding-left: 10px;
          .jack-input {
            border: none;
            line-height: 33px;
            width: calc(100% - 108px);
            padding: 0;
            background-color: #3b435c;
            color: #fff;
            flex-shrink: 2;
            font-size: 16px;
            padding-left: 6px;
            border-right: 1px dashed #1c233f;
            &:focus {
              outline: none;
            }
          }
          .amount-action {
            height: 32px;
            line-height: 32px;
            width: 108px;
            color: #7f7f7f;
            background-color: #3b435c;
            span {
              font-size: 12px;
              cursor: pointer;
              width: 36px;
              display: inline-block;
              &:hover {
                color: #fff;
              }
            }
          }
        }
      }
      .field-profit {
        width: 130px;
        margin-top: 15px;
        text-align: left;
        .title {
          text-align: left;
          font-size: 12px;
          line-height: 12px;
          color: #7f7f7f;
        }
        .content {
          height: 32px;
          line-height: 32px;
          width: 100%;
          color: #fff;
          font-size: 16px;
          margin-top: 10px;
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .pc-jkr {
    display: block !important;
  }
}

.roll-footer {
  display: flex;
  margin-top: 24px;
  div {
    flex-grow: 1;
    flex-basis: 142px;
  }
  .eos,
  .token {
    font-size: 22px;
    font-weight: 600;
    height: 48px;
    line-height: 48px;
    display: flex;
    .symbol {
      margin-left: 0.7em;
      font-size: 0.7em;
      color: rgb(153, 153, 153);
    }
    text-align: left;
  }
  .token {
    justify-content: flex-end;
  }
}
@media (max-width: 768px) {
  .roll-footer {
    flex-direction: column;
    .login-wrap {
      order: -1;
    }
    .eos,
    .token {
      text-align: left;
      justify-content: flex-start;
    }
    div {
      flex-basis: auto;
    }
  }
}
.login {
  width: 132px;
  height: 48px;
  line-height: 48px;
  background-color: #28b6e4;
  border: none;
  border-radius: 6px;
  padding: 0 5px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin: 0 auto;
  display: inline-block;
}
</style>
