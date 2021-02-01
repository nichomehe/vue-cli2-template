
import calcInputWidth from './inputWidth'

let getHeight = (el) => {
   return el.scrollHeight;
 }
 // 解决在安卓手机上 当输入框弹起的时候 底部foot隐藏
export const hideElement = {
  directives: {
    'hide-element': {
      unbind(el,binding) {
        binding.value && binding.value();
      }  
    }
  }
};
// 解决在安卓手机上 当输入框弹起的时候 底部foot隐
export const resizeFoot = {
  directives: {
    'resize-foot': {
      bind(el, binding) {
        let elStyle = el.style;
        let active = false;
        let originalHeight = document.body.clientHeight;
        let reset = () => {
          if(!active) return false;
          elStyle.display = 'flex';
          active = false;
        }
        let hide = () => {
          if(active)return false;
          elStyle.display = 'none'
          active = true;
        }
        let getCurrHeight = () => {
          let getClientHeight = document.body.clientHeight;
          return getClientHeight;
        }
        el.check = () => {
          let currHeight = getCurrHeight();
          if(currHeight != originalHeight) {
            hide();
          }else {
            reset();
          }
        }
        window.addEventListener('resize', el.check);
      },
      unbind(el) {
        window.removeEventListener('resize',el.check);
        el.check = null;
      }  
    }
  }
};

export const allScroll = {
  directives: {
    'all-scroll': {
      bind: (el, binding) => {
        el.addEventListener('touchmove', (e) => {
          e && (e._isScroller = true)
          return false;
        }, false)
      }
    }
  }
};
export const stopScroll = {
  directives: {
    'stop-scroll': {
      bind: (el, binding) => {
        // 由于部分机型兼容问题 暂时放开滚动
        if(Evn.isAndroid) return;
        let viewHeight;
        let height;
        let scrollEl = el;
        let disStart = '';
        el.addEventListener('touchstart', (ev) => {
          disStart = ev.touches[0].screenY
          viewHeight = el.clientHeight;
          height = getHeight(el);
        }, false)
        el.addEventListener('touchmove', (e) => {
          height = getHeight(el);
          loadMore(e);
        }, false)
        const loadMore = (ev) => {
          // alert(el.scrollHeight+';'+el.clientHeight)
          if(scrollEl.scrollTop == 0 && (ev.touches[0].screenY-disStart)>0){
            // 页面到顶向下滑动 禁止拖动
             ev && (ev._isScroller = false)
          }else if((scrollEl.scrollTop + viewHeight >= height) && (ev.touches[0].screenY-disStart)<0){
            // 页面到底向上滑动 禁止拖动
            ev && (ev._isScroller = false)
          }else{
            // 其余情况页面可以滚动
            ev && (ev._isScroller = true)
          }
          binding.value && binding.value(scrollEl.scrollTop);
         
        }
      }
    }
  }

};


export const loadMore = {
  directives: {
    // 瀑布流
    'load-more': {
      bind: (el, binding) => {
        let viewHeight;
        let height;
        let requestFram;
        let oldScrollTop;
        let scrollReduce = 20;
        let scrollEl = el;

        el.addEventListener('touchstart', (ev) => {
          viewHeight = el.clientHeight;
          height = getHeight(el);
        }, false)
      
        el.addEventListener('touchmove', (e) => {
          height = getHeight(el);
          loadMore(e);
        }, false)

        el.addEventListener('touchend', (e) => {
          loadMore(e);
          oldScrollTop = scrollEl.scrollTop;
          moveEnd();
        }, false)

        const moveEnd = () => {
          requestFram = requestAnimationFrame(() => {
            if (scrollEl.scrollTop != oldScrollTop) {
              oldScrollTop = scrollEl.scrollTop;
              moveEnd()
            } else {
              cancelAnimationFrame(requestFram);
              height = getHeight(el);
              loadMore();
            }
          })
        }
        const loadMore = (ev) => {
          if (scrollEl.scrollTop + viewHeight >= height - scrollReduce) {
            binding.value && binding.value(1);
            // ev && (ev._isScroller = true)
          }
        }
      }
    }
  }

};

export const loadMoreAndScroll = {
  // 瀑布流加滚动监听
  directives: {
    'loadMoreAndScroll': {
      bind: (el, binding) => {
        let viewHeight;
        let height;
        let requestFram;
        let oldScrollTop;
        let scrollReduce = 20;
        let scrollEl = el;

        el.addEventListener('touchstart', (ev) => {
          viewHeight = el.clientHeight
          height = getHeight(el);;
        }, false)
      
        el.addEventListener('touchmove', (e) => {
          height = getHeight(el);
          loadMore(e);
        }, false)

        el.addEventListener('touchend', (e) => {
          loadMore(e);
          oldScrollTop = scrollEl.scrollTop;
          moveEnd();
        }, false)

        const moveEnd = () => {
          requestFram = requestAnimationFrame(() => {
            if (scrollEl.scrollTop != oldScrollTop) {
              oldScrollTop = scrollEl.scrollTop;
              moveEnd()
            } else {
              cancelAnimationFrame(requestFram);
              height = getHeight(el);
              loadMore();
            }
          })
        }
        const loadMore = (ev) => {
          if (scrollEl.scrollTop + viewHeight >= height - scrollReduce) {
            binding.value && binding.value();
          }else if(scrollEl.scrollTop) {
            binding.value && binding.value(scrollEl.scrollTop);
          }
        }
      }
    }
  }

};

export const clickOutside = {
  // 点击元素之外
  directives: {
    'click-outside': {
      bind (el, binding, vnode) {
        function documentHandler (e) {
            if (el.contains(e.target)) {
                return false;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
      },
      unbind (el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
      }
    }
  }

};





export const inputWidth = {
  directives:{
    'input-width':{
      bind (el, binding) {
        let width = calcInputWidth(el);
        el.style.width = width+'px';
      },
      update (el, binding){
        let width = calcInputWidth(el);
        el.style.width = width+'px';
      }
    }
  }
}
