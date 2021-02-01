import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let state = {
  userName:'Nicole',
}

const store = new Vuex.Store({
  state,
  mutations:{
    setUserName(state,value){
      state.userName = value;
    },
  }
});

export default store;
