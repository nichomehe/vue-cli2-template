<template>
<transition name="scroll-move" mode="in-out" @before-leave='leave' @before-enter='enter'>
    <div class="box" @click='cancelAction($event)'>
        <section class="btns-box f-16" ref="btns" @click='cancelBubble($event)'>
          <div class="btn-title color-3 border-bottom" v-if="attr.title">
            {{attr.title}}
          </div>
          <slot name="content">
            <div class="btn-items padding-bottom-10" v-if="attr.btnData && attr.btnData.length">
              <div class="btn-item border-bottom" @click="itemHandel($event,item)" v-for="(item,index) in attr.btnData" :key="index">{{item.label}}</div>
            </div>
          </slot>
          <div v-if="!attr.hideBottomBtn" class="btn-bottom" @click="cancelAction($event)">取消</div>
        </section>
    </div>
 </transition>
</template>


<script>
  export default {
    props:{
      attr:{
        type:Object,
        default(){
          return {
            
          }
        }
      }
    },
    data(){
      return{
        btnsStyle:{
          
        }
      }
    },
    methods:{
      cancelBubble(e){
        e.cancelBubble = true;
      },
      cancelAction(e){
        e.cancelBubble = true;
        this.$emit('cancelAction')
      },
      itemHandel(e,item){
        e.cancelBubble = true;
        this.$emit('btnClick',item);
      },
      leave(){
        this.$refs.btns.style.transform = 'translateY(100%)';
      },
      enter(){
        // 组件使用v-show的时候 需要使用enter改变样式 使得连续点击的时候可以有动画
        this.$refs.btns.style.transform = 'translateY(0)';
      },
    },
    mounted(){

    }
    
  }
</script>

<style lang='less' scoped>
  .scroll-move-leave-active {
    transition: all .3s ease-out;
  }
  .box{
    // transition: all 0s ease-out;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(14, 14, 14, 0.8);
      z-index: 1;
    .btns-box{
      background: #EFEFF4;
      transition: all .3s ease-out;
      animation:swipetop 0.5s;
      position: absolute;
      bottom:0;
      width: 100%;
      left: 0;
      .btn-title{
        height: 60px;
        line-height: 60px;
        background: #fff;
      }
      .btn-items{
        background: #efeff4;
        .btn-item{
          background: #fff;
          height: 45px;
          line-height: 45px;
        }
      }
      .btn-bottom{
        background: #fff;
        height: 45px;
        line-height: 45px;
      }
    }
  }
  @keyframes swipetop {
    from {transform: translateY(100%);}
    to {transform: translateY(0);}
  }
</style>