<template>
  
</template>

<script>
import { handleData } from "@/network/ws.js";
import { mapGetters } from "vuex";
export default {
  name: "dice-order",
  data() {
    return {
      tab1: true,
      tab2: false,
      tab3: false,
      allBets: [],
      myBets: [],
      ws_identify: "",
      keyShow:false
    };
  },
  methods: {
    changeTab(type) {
      switch (type) {
        case 1:
          this.tab1 = true;
          this.tab2 = this.tab3 = false;
          break;
        case 2:
          this.tab2 = true;
          this.tab1 = this.tab3 = false;
          break;
        case 3:
          this.tab3 = true;
          this.tab1 = this.tab2 = false;
      }
    }
  },
  props: ["activeToken"],
  watch: {
    allBets(newValue) {
      if (this.username) {
        this.myBets = newValue.filter(item => {
          return item.player === this.username;
        });
        if (this.myBets.length === 31) {
          this.myBets=this.myBets.slice();
        }
      }
    }
  },

  computed: {
    ...mapGetters(["username"])
  },

  mounted() {
    
    const _this = this;
    this.ws_identify = this.$ws.getActionTraces(
      {
        account: "richrichlogs",
        action_name: "result",
        receiver: "richrichlogs"
      },
      { req_id: "roll_result" }
    );

    this.ws_identify.onMessage(message => {
      if (handleData(message)) _this.allBets.unshift(handleData(message));
      const mes = handleData(message);
      
      if (this.username && mes) {
        if (mes.player === this.username) {
          this.$store.dispatch("UPDATE_EOS_ASYNC");
          this.$store.dispatch("UPDATE_TOKEN_ASYNC", {
            type: this.activeToken === "eos" ? "rich" : this.activeToken
          });
          if (Number(parseFloat(mes.amount)) <Number(parseFloat(mes.payout))) {
            this.$message.success(
              this.$t("order.win", {
                random: mes.random_roll,
                payout: mes.payout
              })
            );
          } else {
            this.$message.error(
              this.$t("order.lose", {
                random: mes.random_roll,
                payout: mes.payout
              })
            );
          }
          if( Number(parseFloat(mes.keyamount))>0){
            _this.keyShow=true;
            setTimeout(function(){
               _this.keyShow=false;
            },480)
          }
        }
      }

      if (_this.allBets.length > 30) {
        _this.allBets=_this.allBets.slice(0,30);
        
      }
    });
  },

  destroyed() {
    this.ws_identify.unlisten();
  }
};
</script>

<style lang="less">
.key{
  position: fixed;
  top:50%;
  bottom: 0;
  left: 80%;
  transform: translateX(-50%) translateY(-50%);
}
@media (max-width: 768px) {
  .order {
    width: 100% !important;
  }
}
.order_roll{
  max-width: 97px;
  line-height: 20px!important;
}
.order {
  background-color: #161933;
  padding: 30px 0 50px;
  @media (max-width: 768px) {
    .order-container {
      width: 100% !important;
    }
  }
  .order-container {
    width: 1090px;
    min-height: 330px;
    margin: 0 auto;
    @media (max-width: 768px) {
      .order-tab {
        height: 40px !important;
        span {
          height: 40px !important;
          line-height: 40px !important;
        }
      }
    }
    .order-tab {
      width: 100%;
      height: 60px;
      padding: 0 20px;
      background-color: #1c233f;
      text-align: left;
      color: #989a99;
      @media (max-width: 768px) {
        span {
          padding: 0 10px !important;
        }
      }
      span {
        cursor: pointer;
        padding: 0 30px;
        display: inline-block;
        font-size: 12px;
        height: 60px;
        line-height: 60px;
      }
      .active-tab {
        color: #fff;
        border-bottom: 1px solid #fff;
      }
    }
    .order-table {
      border-collapse: collapse;
    }
    table {
      vertical-align: center;
      tr {
        border-top: 1px dashed #1e1e1e;
        background: #1c233f;
        th,
        td {
          color: #fff;
          font-size: 14px;
          height: 45px;
          line-height: 45px;
          font-weight: bold;
        }
      }
      thead {
        tr {
          border-bottom: none !important;
        }
      }
    }
    .tab3-class {
      background: #282828;
      height: 45px;
      line-height: 45px;
    }
  }
}
.win {
  background-color: #2a402a !important;
  border-color: #2d742d !important;
}
.lose {
  background-color: #3e2626 !important;
  border-color: #7a3022 !important;
}
</style>
