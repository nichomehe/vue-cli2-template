<template>
  <div class="range-box f-14">
    <div class="range-line" ref='rangeLine'>
      <div class="light-line" :style='lightStyle'></div>

      <div class="flex-column range-mark" :style="item.style" v-for="(item) in marks"  :key="item.value">
        <div class="range-mark-circle" :class="{'range-mark-circle-none':!item.showMark}"></div>
        <div class="range-mark-text">{{item.value}}{{item.unit}}</div>
      </div>

      <div class="range-circle range-circle-before"
        :style='beforeStyle'
        @touchstart='circleTouchStartBefore'
        @touchmove='circleTouchmoveBefore'
        @touchend='circleTouchendBefore'>
      </div>
      <div class="range-circle range-circle-after"
        ref='rangeCircle'
        :style='afterStyle'
        @touchstart='circleTouchStartAfter'
        @touchmove='circleTouchmoveAfter'
        @touchend='circleTouchendAfter'>
      </div>
    </div>

  </div>
</template>


<script>

export default {
  props: {
    // 单位默认无
    unit: {
      type: String,
      default: ''
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    },
    endMark: {
      type: String,
      default: '无限'
    },
    lengthFactor: {
      type: Number,
      default: 0.84
    },
    reset:{
      type:Boolean,
      default:false
    },
    initData:{
      type:Object,
      default:{}
    }
  },
  data () {
    return {
      isReset:false,
      marks: [],
      rangeCircleWidth: 0,
      totalWidth: 0,
      beforeCircleData: {
        clientX: 0,
        distance: 0
      },
      afterCircleData: {
        clientX: 0,
        distance: 0
      },
      distanceBefore: 0,
      distanceAfter: 0,
    }
  },
  methods: {
    preventDefault (e) {
      e.stopPropagation && e.stopPropagation()
      e.preventDefault && e.preventDefault()
    },
    circleTouchStartBefore (e) {
      this.isReset = false;
      this.beforeCircleData.clientX = (e.touches[0] || e.changedTouches[0]).clientX
      document.addEventListener('touchmove', this.preventDefault)
    },
    circleTouchmoveBefore (e) {
      let oX = (e.touches[0] || e.changedTouches[0]).clientX
      let oDistance = oX - this.beforeCircleData.clientX
      if (this.beforeCircleData.distance + oDistance < 0) {
        this.distanceBefore = 0
      } else if ((Math.abs(this.beforeCircleData.distance + oDistance) + Math.abs(this.distanceAfter)) > (this.totalWidth - this.rangeCircleWidth)  && this.distanceAfter != 0) {
        this.distanceBefore = this.totalWidth - Math.abs(this.distanceAfter) - this.rangeCircleWidth
      } else if ((this.beforeCircleData.distance + oDistance) > this.totalWidth * this.lengthFactor) {
        this.distanceBefore = this.totalWidth * this.lengthFactor
      } else {
        this.distanceBefore = this.beforeCircleData.distance + oDistance
      }
      this.onchange()
    },
    circleTouchendBefore () {
      this.beforeCircleData.distance = this.distanceBefore
    },

    circleTouchStartAfter (e) {
      this.isReset = false;
      this.afterCircleData.clientX = (e.touches[0] || e.changedTouches[0]).clientX
      document.addEventListener('touchmove', this.preventDefault)
    },
    circleTouchmoveAfter (e) {
      let oX = (e.touches[0] || e.changedTouches[0]).clientX
      let oDistance = oX - this.afterCircleData.clientX
      if (this.afterCircleData.distance + oDistance > 0 || (this.distanceBefore > this.totalWidth * this.lengthFactor - this.rangeCircleWidth)) {
        this.distanceAfter = 0
      } else if (Math.abs(this.afterCircleData.distance + oDistance) < this.totalWidth * (1 - this.lengthFactor)) {
        this.distanceAfter = -this.totalWidth * (1 - this.lengthFactor)
      } else if ((Math.abs(this.afterCircleData.distance + oDistance) + Math.abs(this.distanceBefore)) > this.totalWidth - 20) {
        this.distanceAfter = Math.abs(this.distanceBefore) + this.rangeCircleWidth - this.totalWidth
      } else {
        this.distanceAfter = this.afterCircleData.distance + oDistance
      }
      this.onchange()
    },
    circleTouchendAfter () {
      this.afterCircleData.distance = this.distanceAfter
    },
    onchange () {
      let start = Math.round(this.distanceBefore / (this.totalWidth * this.lengthFactor) * (this.max - this.min) + this.min)
      let end = 'max'
      if (this.distanceAfter < 0) {
        end = Math.round((this.totalWidth + this.distanceAfter) / (this.totalWidth * this.lengthFactor) * (this.max - this.min) + this.min)
      }
      this.$emit('onchange', {min: start, max: end})
    },
    handleDate () {
      let self = this
      let oArray = [this.min, this.max / 2, this.max, this.endMark]
      this.marks = oArray.map((item, index) => {
        let oData = {value: item, unit: '', style: {}}
        if (index == 0 || index == oArray.length - 1) {
          oData.showMark = false
        } else {
          oData.showMark = true
          oData.unit = self.unit
          oData.style = {left: `${self.lengthFactor / 2 * index * 100}%`}
        }
        return oData
      })
    },
    init(){
      if(Object.keys(this.initData).length >0){
        this.distanceBefore = (this.initData.min / (this.max-this.min) )* this.totalWidth * this.lengthFactor;
        this.distanceAfter = this.initData.max == 'max'? 0 :-(((this.max - this.initData.max) / this.max-this.min) * this.totalWidth * this.lengthFactor +this.totalWidth*(1-this.lengthFactor));
        this.beforeCircleData.distance = this.distanceBefore;
        this.afterCircleData.distance = this.distanceAfter;
      }
    }
  },
  watch:{
    reset(){
      this.isReset = this.reset;
      if(this.isReset){
        this.beforeCircleData.distance = 0;
        this.afterCircleData.distance = 0;
        this.distanceBefore = 0;
        this.distanceAfter = 0;
      }
    }
  },
  computed: {
    beforeStyle () {
      return  {
        transform:`translateX(${this.distanceBefore}px)`
      }
    },
    afterStyle () {
      return {
        transform:`translateX(${this.distanceAfter}px)`
      }
    },
    lightStyle () {
      return {
        left:`${this.distanceBefore}px`,
        width:`${this.totalWidth - Math.abs(this.distanceBefore) - Math.abs(this.distanceAfter)}px`
      }
    }
  },
  mounted () {
    this.totalWidth = this.$refs.rangeLine.clientWidth
    this.rangeCircleWidth = this.$refs.rangeCircle.offsetWidth
    this.handleDate();
    this.init();
  }
}

</script>


<style lang="less" scroped>
.range-box {
  width: 100%;
  margin-bottom: 40px;
  margin-left: -10px;
  padding:0 5px;
  .range-line {
    height: 6px;
    background: #e2e2e2;
    margin: 0 10px;
    border-radius: 10px;
    position: relative;
    flex: 1;
    .range-mark{
      position:absolute;
      transform: translateX(-50%);
      .range-mark-circle{
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #fff;
      }
      .range-mark-circle-none{
        background: #e2e2e2;
      }
      .range-mark-text{
        font-size: 12px;
        color: #666666;
        margin-top:10px;
      }
      &:nth-child(5){
        right:0;
        transform: translateX(50%);
      }
    }
    .light-line{
      position: absolute;
      height: 6px;
      background:#4080E8;
      border-radius: 10px;
    }
    .range-circle {
      position: absolute;
      background: #fff;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      z-index: 2;
      top: -7px;
      border:1px solid #4080E8;
    }
    .range-circle-before {
      left: -10px;
    }
    .range-circle-after {
      right: -10px;
    }
  }
}
</style>