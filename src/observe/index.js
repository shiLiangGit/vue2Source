import newArrayProto from "./array";
function Observe(data) {
    if (data instanceof Array) { // 如果是数组
        Object.defineProperty(data, '_ob_', {
            value: this,
            enumerable: false // 将_ob_设置为不可枚举避免, 下面observe陷入死循环
        })
        // 重写数组能够改变自身的方法
        data.__proto__ = newArrayProto;
        this.observeArray(data);
    } else {
        this.walk(data);
    }
}
Observe.prototype.walk = function (data) {
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
}
// 对数组item,如果是对象进行属性劫持
Observe.prototype.observeArray = function (data) {
    data.forEach(item => observe(item));
}
// 拦截对象属性--响应式对象
function defineReactive(target, key, value) {
    observe(value); // 如果属性是对象，拦截value的属性设置响应式
    Object.defineProperty(target, key, {
        get() {
            console.log('get....')
            return value;
        },
        set(newVal) {
            console.log('set....');
            observe(newVal); // 如果设置的新值是对象，拦截newVal的属性设置响应式
            if (newVal !== value) value = newVal;
        }
    })
}
export default function observe(data) {
    if (!data || typeof data !== 'object') return;
    // 如果data._ob_是Observe的实例，则说明data被劫持过，不再做属性劫持
    if (data._ob_ instanceof Observe) return data._ob_;
    return new Observe(data);
}