import {initState} from "./state";
import {compileToFunction} from "./compiler";

function initMix(Vue) {
    Vue.prototype._init = function (options) {
        let  vm = this;
        vm.$options = options;
        initState(vm);
        if (options.el) {
            vm.$mount(options.el);
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        let ops = vm.$options;
        let template;
        el = document.querySelector(el);
        if (!ops.render) {
           if (!ops.template) {
               template = el.outerHTML;
           } else {
               template = ops.template;
           }
            if (template) {
                ops.render = compileToFunction(template);
            }
        }
    }
}

export {
    initMix
}