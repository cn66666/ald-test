<template>

</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
export default {
  name: "dealerInfo",
  components: {PushFunctionBtn},
  data() {
    return {
      dealerId: null
    }
  },
  mounted() {
    var that = this;
    that.dealerId = this.$route.query.dealerId;
    that.getDealerInfo()
  },
  methods: {
    getDealerInfo: function (){
      var that = this;
      that.axios.post('/ald/dealer/dealer_info', {'dealerId': that.dealerId,}).then(res=>{
        if (res.data.code=='ok'){
        }
      }).catch(res=>{
      })
    },

    showApplyIntercept: function (dealerId){
      var that = this;
      that.interceptList = []
      that.applyInterceptId=dealerId
      that.showIntercept=true;
      that.axios.post('/ald/dealer/show_apply_intercept', {'dealerId': dealerId,}).then(res=>{
        if (res.data.code=='ok'){
          that.interceptList = res.data.data
        }else {
          this.$message({
            message: res.data.msg + ':' + res.data.data,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    },
  }

}
</script>

<style scoped>

</style>
