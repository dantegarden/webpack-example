import { nav } from './nav'
let { common } = require("./common")

// => css需要在入口js中导入才能使用
import './common.less'

nav();
common();
console.log("index")

@log
class A {
    constructor(){}
    sum(){
        console.log('sum')
    }
    n = 11
    static fun(){
        console.log('fun')
    }
}

function log(target){
    target.decorator = "decorator"
}

A.fun();
new A().sum();
console.log(A.decorator)
console.log(new A().n)

require('@babel/polyfill')
"success".includes("cc")

function run(){
    return new Promise((resolve, reject) => {
        setTimeout(_ => {
            resolve("wait 2s")
        }, 2000)
    })
}

async function go(){
    let a = await run()
    console.log(a)
}
go()

//在webpack的js中使用图片，需要先把图片导入进来
import img1 from './assets/2.jpg'
let img = new Image();
img.src = img1;
document.body.appendChild(img1);
