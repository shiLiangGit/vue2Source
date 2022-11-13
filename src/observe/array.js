import observe from "./index";

let oldArrayProto = Array.prototype;
let newArrayProto = Object.create(oldArrayProto);

let arrayMethods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'reverse',
    'sort',
]; // concat/slice 不会改变原数组，不用做重写

// 循环重写方法
arrayMethods.forEach(method => {
    newArrayProto[method] = function (...args) {
        oldArrayProto[method].call(this, ...args); // 继承执行数组原始方法
        let tempData, ob = this._ob_;
        // push, unshift, splice 再次属性拦截参数是对象情况
        switch (method) {
            case 'push':
            case 'unshift':
                tempData = args;
                break;
            case 'splice':
                tempData = args.slice(2);
                break;
        }
        if (tempData) { // tempData为传递的所有参数一定是数组， 所以用observeArray
            ob.observeArray(tempData)
        }
        observe(tempData);
    };
})
export default newArrayProto;