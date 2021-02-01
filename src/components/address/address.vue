<template>
<div class="height-100 width-100 flex-column content">
  <Titlebar class='f-17  title-bar' :autoBack='false' title="城市筛选" @onBack="goBack"></Titlebar>
  <div class="search-box width-100 bg-f flex-row">
    <div class="input-box flex-1">
      <span class="icon-search-black search-icon icon" ></span>
      <input v-model="searchValue" class="width-100"  autocomplete='false' type="text" placeholder="请输入城市名查询" @focus="showMask=true">
      <rIcon v-show="searchValue" class="clear-icon icon" type="close-circled" @iconClick="searchValue=''" color="#d0d0d3"></rIcon>
    </div>
    <div class="cancel-box color-theme margin-right-15 f-15" v-if="showMask" @click.stop.prevent="showMask=false">取消</div>

  </div>
  <div class="search-list width-100 bg-f color-6 f-14 text-left" v-if="searchData.length">
    <div class="search-item bottom-line color-9" v-for="item in searchData" :key="item.name" v-html="item.colorName"  @click="itemClick(item)"></div>
  </div>
  <div v-if="showMask" class="mask-box width-100" @click.stop.prevent="showMask=false;searchValue=''"></div>
  <div class="list-top width-100 bg-f text-left f-14 color-3 padding-left-15 bottom-line" @click="itemClick({name:'全国',id:''})">全国</div>
  <div class="list-top width-100 bg-f text-left f-14 color-3 padding-left-15" @click="itemClick(currentCity)">{{currentCity.name}}(当前城市)</div>
  <div class="alphaPage  width-100 text-left flex-1 " v-stop-scroll
      @touchstart="touchstartAlphaPage"
      @touchmove="touchmoveAlphaPage"
      @touchend="touchendAlphaPage"
      ref="alphaPage">
    <!-- <div class="block-title block-title-fixed" :style="blockTitleStyle" ref="blockTitle">{{currentAlpha && currentAlpha.alpha}}</div> -->
    <div v-if="scrollH" class="block-title-fixed block-title color-9 width-100 bg-f f-12">{{currentAlpha && currentAlpha.alpha}}</div>
    <div v-for="(value) in list" :key="value.key" :data-alpha="value.key" ref="alphablock" class="city-list">
      <div class="block-title color-9 f-12" v-if="value.key">{{value.key}}</div>
      <div v-for="v in value.list" class="city-item bottom-line" :key="v.id" @click.stop.prevent="itemClick(v)">{{v.name}}</div>
    </div>
    <div class="tip color-9" v-show="showTip"><span v-if="currentAlpha">{{currentAlpha.alpha}}</span></div>
  </div>
  <ul class="alpha-list f-11"
      v-if="alphablockList.length"
      @touchstart.prevent="touchmoveAlphaList"
      @touchmove.prevent="touchmoveAlphaList"
      ref="alphaList">
    <li class="margin-bottom-5">搜索</li>
    <li class="margin-bottom-5" @click.prevent="touchmoveAlphaList">全国</li>
    <li v-for="v in alphablockList" class="bottom-line"
        :class="{'color-9': currentAlpha&&currentAlpha.alpha==v.alpha}"
        :key="v.alpha"
        :data-alpha="v.alpha">{{v.alpha}}</li>
  </ul>
</div>
</template>

<script type="text/javascript">
import {list} from './addressList.js'
export default {
  name: 'address',
  mixins:[],
  props:{
    currentCity:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data () {
    return {
      alphablockList: [], // 左侧字母块信息
      alphaList: [], // 右侧字母信息
      currentAlpha: null,
      list: list,
      cityList:[],
      showTip: false,
      text: "",
      blockTitleHeight: 45,
      blockTitleTranslateY: 45,
      scrollH:0,
      searchValue:'',
      showMask:false //是否展示蒙层
    }
  },
  mounted () {
    this.updateAlphablockList()
    this.updateAlphaList();
    setTimeout(()=>{
      let cityList = [];
      this.list.forEach(item=>{
        item.list.forEach(_item=>{
          cityList.push(_item);
        })
      });
      this.cityList = cityList;
      // console.log(this.cityList)
    },2000)     
    // this.blockTitleHeight = this.$refs.blockTitle.offsetHeight
  },
  updated () {
    this.updateAlphablockList()
    this.updateAlphaList()
  },
  watch: {
    currentAlpha () {
      if (this.currentAlpha && this.currentAlpha.alpha) {
        this.showTip = true
      } else {
        this.showTip = false
      }
      if (this.tipTimeoutId) {
        clearTimeout(this.tipTimeoutId)
      }
      this.tipTimeoutId = setTimeout(() => {
        this.showTip = false
      }, 500)
    }
  },
  computed:{
    searchData(){
      let searchData = [];
      if(!this.searchValue) return searchData;
      let flag =true
      this.cityList.forEach(item=>{
        let oItem = Object.assign({},item)
        if(item.name.includes(this.searchValue)){
          oItem.colorName = item.name.replace(new RegExp(this.searchValue,'g'),`<span class='color-3'>${this.searchValue}</span>`);
          searchData.push(oItem);
        }
        this.searchValue == item.name && (flag = true);
      })
      // debugger
      return searchData;
    }
  },
  methods: {
    goBack(){
      this.$emit('goBack')
    },
    updateAlphablockList () {
      if (!this.alphablockList.length && this.$refs.alphablock) {
        var alphablockList = []
        this.$refs.alphablock.forEach(alphablock => {
          alphablockList.push({
            min: alphablock.offsetTop,
            max: alphablock.offsetTop + alphablock.offsetHeight,
            el: alphablock,
            alpha: alphablock.dataset.alpha
          })
        })
        this.alphablockList = alphablockList
      }
    },
    updateAlphaList () {
      if (!this.alphaList.length && this.$refs.alphaList) {
        let liEls = this.$refs.alphaList.querySelectorAll('li')
        liEls.forEach(li => {
          this.alphaList.push({
            min: li.offsetTop,
            max: li.offsetTop + li.offsetHeight,
            alpha: li.dataset.alpha
          })
        })
      }
    },
    touchstartAlphaPage () {
      this.timeId && clearInterval(this.timeId)
      this.scrollTopTime && clearInterval(this.scrollTopTime)
    },
    touchmoveAlphaPage () {
      this.setCurrentAlpha()
    },
    touchendAlphaPage () {
      if(this.$parent.isSearchCity)return; //避免点击城市item时触发 startAnimateWatch 方法
      this.startAnimateWatch()
    },
    startAnimateWatch_bak () {
      let start = null
      let self = this
      function step (timestamp) {
        if (!start) start = timestamp
        var progress = timestamp - start
        if (progress < 5000) {
          self.timeId = requestAnimationFrame(step)
        }
        self.setCurrentAlpha()
      }
      self.timeId && cancelAnimationFrame(self.timeId)
      self.timeId = requestAnimationFrame(step)
    },
    startAnimateWatch () {
      this.oldScrollTop = this.$refs.alphaPage.scrollTop
      this.timeId && clearInterval(this.timeId)
      this.timeId = setInterval(() => {
        // console.log(0)
        this.setCurrentAlpha()
      }, 10)
      this.scrollTopTime && clearInterval(this.scrollTopTime)
      this.scrollTopTime = setInterval(() => {
        let scrollTop = this.$refs.alphaPage.scrollTop
        if (scrollTop == this.oldScrollTop) {
          clearInterval(this.scrollTopTime)
          clearInterval(this.timeId)
        }
        this.oldScrollTop = scrollTop
      }, 1000)
    },
    setCurrentAlpha () {
      // debugger
      let scrollTop = this.$refs.alphaPage.scrollTop
      this.scrollH = scrollTop;
      if (this.currentAlpha && (scrollTop > this.currentAlpha.max || scrollTop < this.currentAlpha.min)) {
        this.currentAlpha = null;
      }
      if (!this.currentAlpha) {
        this.currentAlpha = this.alphablockList.find(alphablock => {
          return scrollTop >= alphablock.min && scrollTop <= alphablock.max
        })
      }
      if (this.currentAlpha) {
        if (scrollTop >= this.currentAlpha.min && scrollTop < this.currentAlpha.max - this.blockTitleHeight) {
          this.blockTitleTranslateY = this.blockTitleHeight
        } else {
          this.blockTitleTranslateY = this.currentAlpha.max - scrollTop
        }
      } else {
        this.blockTitleTranslateY = -this.blockTitleHeight
      }
    },
    touchmoveAlphaList (e) {
      if(e.target.innerText == '全国'){
        this.$refs.alphaPage.scrollTop = 0;
        this.scrollH = 0;
        this.text = 'A';
        this.currentAlpha = "A";
        return;
      }
      var alphaObj = this.alphaList.find(alphaObj => {
        var H = e.changedTouches[0].clientY - this.$refs.alphaList.offsetTop
        return H >= alphaObj.min && H <= alphaObj.max
      })
      if (alphaObj) {
        this.currentAlpha = this.alphablockList.find(alphablock => {
          return alphablock.alpha == alphaObj.alpha
        })
        this.text = alphaObj.alpha
        this.$refs.alphaPage.scrollTop = this.currentAlpha.min
      }
    },
    itemClick(item){
      event.cancelBubble = true;
      event.stopPropagation();
      this.$emit('cityChange',item)
    }
  }
}
</script>

<style  lang="less" scoped>
.content{
  position: relative;
  .mask-box{
    position: absolute;
    top: 90px;
    bottom: 0;
    z-index:99; 
    background: rgba(0,8,16,0.6);
  }
  .title-bar{
    // height: 40px;
    z-index: 9;
  }
  .search-box{
    height: 45px;
    .cancel-box{
      width: 30px;
      margin-top: 4px;
    }
    .input-box{
      padding:10px 15px 6px 15px;
      position: relative;
      .icon{
        position: absolute;
        top: 56%;
        transform: translateY(-50%);
      }
      .search-icon{
        width: 18px;
        height: 18px;
        display: inline-block;
        left: 25px;
      }
      .clear-icon{
        right: 25px;
      }
      input{
        font-size: 14px;
        padding: 5px 32px;
        border:1px solid #C8C7CC;
        border-radius: 14px;
        vertical-align: middle;
      }
    }

  }
  .search-list{
    position: absolute;
    top: 90px;
    z-index: 999;
    .search-item{
      position: relative;
      height: 45px;
      line-height: 45px;
      padding-left: 15px;
    }
  }
  .bottom-line{
    &:after{
      content: "";
      position:absolute;
      bottom: 0;
      right: 0;
      left: 15px;
      height: 1px;
      background:#EFEFF4;
      // margin-left:15px;
    }
  }
  .list-top{
    position: relative;
    height: 45px;
    line-height: 45px;
  }
  .alphaPage {
    position: relative;
    .city-list{
      background: #fff;
      .city-item {
        position: relative;
        text-indent: 15px;
        font-size: 14px;
        height: 45px;
        line-height: 45px;
      }
    }
    .block-title {
      height: 30px;
      line-height: 30px;
      background:#EFEFF4;
      text-indent: 15px;
    }
    .block-title-fixed{
      position: fixed;
      top:174px;
      z-index: 9;
    }
    .tip {
      position: fixed;
      top: 45%;
      left: 50%;
      width: 50px;
      height: 50px;
      line-height: 50px;
      border-radius: 50%;
      margin-left: -25px;
      background: #EFEFF4;;
      text-align: center;
    }
  }
  .alpha-list {
    position: fixed;
    right: 0;
    top: 125px;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    color:rgba(64,128,232,0.98);
    z-index: 10;
    li {
      padding-right: 10px;
      padding-left: 20px;
      height: 16px;
    }
  }
}

</style>
