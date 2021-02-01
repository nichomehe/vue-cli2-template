<template>
  <transition appear
              name="p-keyboard-fade"
              @after-leave="afterLeave">
    <div class="p-keyboard">
      <div class="p-keyboard-content-wrap">
        <slot></slot>
        <div :class="['p-keyboard-content']"
             @touchstart="doTouch"
             @touchend="endTouch"
             ref="content">

          <div class="p-keyboard-head">
            <div class="cancel">取消</div>
            <div class="title"><span v-if="showTitle">{{title}}</span></div>
            <div data-code="ok"
                 class="confirm">确定</div>
          </div>
          <div class="p-keyboard-row">
            <div data-code="1">1</div>
            <div data-code="2">2</div>
            <div data-code="3">3</div>
          </div>
          <div class="p-keyboard-row">
            <div data-code="4">4</div>
            <div data-code="5">5</div>
            <div data-code="6">6</div>
          </div>
          <div class="p-keyboard-row">
            <div data-code="7">7</div>
            <div data-code="8">8</div>
            <div data-code="9">9</div>
          </div>
          <div class="p-keyboard-row">
            <div :data-code="typeStr.code"
                 v-html="typeStr.str"></div>
            <div data-code="0">0</div>
            <div data-code="d"
                 class="d">
              <span data-code="d">
                <rIcon type="clear" data-code="d"></rIcon>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "pKeyboard",
  data () {
    return {
      currentValue: this.value + ""
    }
  },
  props: {
    type: {
      type: String,
      default: "float"
    },
    value: {
      type: [String, Number],
      default: ''
    },
    // 最大长度
    maxlength: {
      type: Number,
      default: -1
    },
    // 小数点后保留几位，"-1"表示不限制
    fixed: {
      type: Number,
      default: -1
    },
    // 是否显示键盘上title
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value: function (newVal, oldVal) {
      this.currentValue = newVal
    }
  },
  computed: {
    typeStr () {
      let obj = {};
      switch (this.type) {
        case "float":
          obj.str = "&sdot;";
          obj.code = ".";
          break;
        case "int":
          obj.str = "";
          obj.code = "";
          break;
        case "idcard":
          obj.str = "X";
          obj.code = "X";
          break;
      }
      return obj;
    },
    title () {
      return this.currentValue.indexOf('*') > 0 ? this.currentValue : this.currentValue.replace(/(.{4})/g, "$1 ")
    }
  },
  mounted () {
    var self = this;

    this.show = true;
    this.$nextTick(function () {
      // 点击非键盘部分，收起键盘  不能默认调用该事件，会在点击其他区域时触发键盘确定事件影响业务逻辑
      // document.addEventListener("touchstart", self.docTouchStart)
    })
  },
  methods: {
    doTouch (e) {
      var target = e.target,
        code = target.dataset.code;

      e.preventDefault();
      if (code) {
        // 点击样式
        this.$el.querySelector("div[data-code='" + code + "']").setAttribute('active', true);

        if (code == 'd') {
          this.currentValue = this.currentValue.substr(0, this.currentValue.length - 1);
        } else {
          if (code == 'ok') {
            this.show = false;
            if (this.type == 'float') {
              if (this.currentValue == ".") {
                this.currentValue = ""
              }
              if (this.currentValue != "" && this.currentValue != "0") {
                this.currentValue = parseFloat(this.currentValue * 1) + ""
              }
            }
            this.$emit('confirm', e, this)
          } else {
            // 最大长度
            if (this.maxlength > 0 && this.currentValue.length >= this.maxlength) return;
            // type类型为float
            if (this.type == 'float' && this.currentValue) {
              // 有小数点输入了
              if (this.currentValue.indexOf(".") > -1) {
                // 超过小数点后保留位数
                if (this.fixed > 0 && this.currentValue.split(".")[1].length >= this.fixed) {
                  return;
                }
                // 已经有一个点了，就不要再输"."了
                if (code == '.') {
                  return;
                }
              }
              // 小数点前不允许输入多个"0"
              if (this.currentValue == '0' && code == '0') {
                return;
              }
            }

            // type类型为idcard
            if (this.type == 'idcard' && this.currentValue.length != (this.maxlength - 1) && code == 'X') {
              return;
            }
            this.currentValue += code;
          }
        }

        this.typing(code, this.currentValue);
      }
    },
    endTouch (e) {
      // 移除点击样式
      e.preventDefault();
      let code = e.target.dataset.code;
      if (code) {
        this.$el.querySelector("div[data-code='" + code + "']").removeAttribute('active');
      }
    },
    typing (code, codeStr) {
      this.$emit("input", codeStr);
      this.$emit('on-change', code, codeStr)
    },
    docTouchStart (e) {
      // 键盘上的touchstart事件，不执行
      if (e.target.closest(".p-keyboard")) return;

      var triggeredEvent = document.createEvent('Events');
      triggeredEvent.initEvent('touchstart', true, true);
      this.$el.querySelector("[data-code='ok']").dispatchEvent(triggeredEvent)
    },
    afterLeave () {
    }
  }
}
</script>
<style lang="less">
.p-keyboard {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  background-color: rgba(14, 14, 14, 0.8);
  .p-keyboard-content-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    width: 100%;
    // height: 260px;
    user-select: none;
    visibility: visible;
    transform: translate3d(0, 0, 0);
    transition-property: transform visibility;
    transition-duration: 0.3s;
    border-top: 1px solid #D8D9DC;
    background: #D8D9DC;
    .p-keyboard-content {
      &-hidden {
        visibility: hidden;
        transform: translate3d(0, 100%, 0);
      }
      .p-keyboard-head {
        display: flex;
        border-bottom: 1px solid #D8D9DC;
        background: #fff;
        .title {
          flex: 1;
          text-align: center;
          line-height: 44px;
          height: 44px;
          font-size: 13px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .confirm,
        .cancel {
          display: inline-block;
          padding: 0 15px;
          line-height: 44px;
          height: 44px;
          color: #4080E8;
          font-size: 16px;
        }
        .cancel {
          visibility: hidden; //取消按钮纯属占位，不用显示
        }
      }
      .p-keyboard-row {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: 54px;
        border-bottom: 1px solid #D8D9DC;
        box-sizing: content-box;
        color: #000;
        font-size: 29px;
        background: #fff;
        & > div {
          width: 33.33333%;
          height: 54px;
          line-height: 54px;
          border-right: 1px solid #D8D9DC;
          text-align: center;
          &:nth-child(3) {
            border-right: none;
          }
          &[active="true"] {
            background: #F3F4F7;
          }
        }
        .d {
          background: #D1D4DB;
          font-size: 1rem;
          &[active="true"] {
            background: #fff;
          }
        }
        &:last-child {
          border-bottom: none;
        }
      }
      .r-iconfont-clear:before {
        color: #000;
      }
      .delete {
        width: 22px;
        height: 16px;
      }
    }
  }
  &-fade-enter-active,
  &-fade-leave-active {
    transition: opacity 0.3s;
  }
  &-fade-enter,
  &-fade-leave-to {
    opacity: 0;
  }
}
</style>
