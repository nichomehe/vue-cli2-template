import pKeyboard from "./index.vue"

pKeyboard.install = function(Vue){
	Vue.component(pKeyboard.name, pKeyboard);
}

export default pKeyboard;