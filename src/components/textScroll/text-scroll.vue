<template>
  <div :class="wrapCls">
    <slot name="prepend"></slot>
    <div :class="scrollbarCls"
         ref="scrollbar">
      <div :class="itemCls"
           v-for="item in scrollList"
           v-html="item"></div>
    </div>
    <slot name="append"></slot>
  </div>
</template>

<script>
const prefixCls = 'r--textscroll'

export default {
  name: 'TextScroll',
  props: {
    list: Array,
    gap: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      listCopyNum: 0,
      maxScrollleft: 0
    }
  },
  computed: {
    wrapCls () {
      return [`${prefixCls}`]
    },
    scrollbarCls () {
      return `${prefixCls}-scrollbar`
    },
    itemCls () {
      return `${prefixCls}-item`
    },
    scrollList () {
      let arr = []
      switch (this.list.length) {
        case 1:
          this.listCopyNum = 4
          break
        case 2:
          this.listCopyNum = 3
          break
        default:
          this.listCopyNum = 2
      }
      for (var i = 0; i < this.listCopyNum; i++) {
        arr = arr.concat(this.list)
      }
      return arr
    }
  },
  mounted () {
    this.setMaxScrollLeft()
    this.start()
  },
  updated () {
    this.setMaxScrollLeft()
  },
  methods: {
    setMaxScrollLeft () {
      this.maxScrollleft = this.$refs.scrollbar.scrollWidth / this.listCopyNum
    },
    start () {
      let self = this,
        scrollbar = this.$refs.scrollbar,
        start = null;
      function step (timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;

        if (progress > self.gap) {
          if (scrollbar.scrollLeft >= self.maxScrollleft) {
            scrollbar.scrollLeft = 0;
          }
          scrollbar.scrollLeft += 1;

          start = timestamp;
        }
        window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }
  }
}
</script>

<style lang="less">
@textscrollCls: r--textscroll;

.@{textscrollCls} {
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  width: 100%;
  height: 33px;
  align-items: center;
  font-size: 12px;
  background-color: #fffcdd;
  color: #ffa810;
  &-scrollbar {
    flex: 1;
    overflow: hidden;
    display: flex;
  }
  &-item {
    padding-right: 50px;
    flex-shrink: 0;
  }
}
</style>
