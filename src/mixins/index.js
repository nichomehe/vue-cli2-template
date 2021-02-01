import { mapId } from '../filter/index'
import {stopScroll,allScroll} from '../directive'

export default {
    mixins:[mapId,stopScroll,allScroll],
    data(){
      return {
        loadingMix:null
      }
    },
    methods: {
      routerBack(){
        this.changeRouterState(-1);
        this.$router && this.$router.go(-1)
      },
      // toast封装
      showToast(data,type,time){
        let propsData = {
          message: '',
          type: type || 'negetive',   //positive  negetive long
          time: time || 2000
        }
        let map = {
            string: data,
            object: data.msg || ''
        }
        propsData.message = map[typeof data]
        this.$toast({propsData: propsData});
      },
      //loading封装
      showLoading(obj){
        let propsData = {
          color:'#4080e8',
        }
        obj && typeof obj == 'object' && Object.assign(propsData,obj);
        this.loadingMix = this.$loading({propsData: propsData});
        return this.loadingMix;
      },
      hideLoading(){
        if(this.loadingMix){
          this.loadingMix.remove && this.loadingMix.remove();
          this.loadingMix = null;
        }
      },
      // goRouter
      goRouter(name,params){
        !params && this.$router && this.$router.push(name)
        params && this.$router && this.$router.push({ name: name, params: params})
      },
      // goRouter
      goRouterQuery(name,params){
        !params && this.$router && this.$router.push(name)
         params && this.$router && this.$router.push({ name: name, query: params})
      }
    }
}
