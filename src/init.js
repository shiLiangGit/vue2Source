import observe from "./observe/index";

function initMix(Vue) {
    Vue.prototype._init = function (options) {
        let  vm = this;
        vm.$options = options;
        initState(vm);
    }
}
// 初始化状态
function initState (vm) {
    const opts = vm.$options;
    if (opts.data) initData(vm);
}
// 初始化data
function initData (vm) {
    let data = vm.$options.data;
    // 如果data是function 则调用data,使用其return的值
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;
    // data属性拦截，设置响应式
    observe(data);
    // 代理vm._data.key 为 vm.key
    for (let key in data) {
        proxy(vm, '_data', key);
    }
}
// 代理vm._data.key 为 vm.key
function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key];
        },
        set(newVal) {
            vm[target][key] = newVal;
        }
    })
}
export {
    initMix
}