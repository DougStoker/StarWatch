import {wrapMod} from "./funcs.js" 

var Vmath = {
    dot_product(v1,v2){
        return v1.x*v2.x + v1.y*v2.y
    },
    divide_num : function(vec,num){
        return {x:vec.x / num,
                y:vec.y / num}
    },
    magnitude : function(vec){
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y)
    },
    wrap_mod_xy : function(v, vx, vy){      
        return {x: wrapMod(v.x, vx),
                y: wrapMod(v.y, vy)}
    },
    add_vec : function(a,b){
        return {x: a.x + b.x,
                y: a.y + b.y}
    },
    times_num : function(v,num){
        return{x: v.x * num,
               y: v.y * num}
    },
    invert : function(v){
        return{x: -v.x,
               y: -v.y}
    },
    sub_vec: function(v1,v2){
        return({x:v1.x-v2.x,
                y:v1.y-v2.y})
    },
    normalize: function(v){
        return Vmath.divide_num(v,Vmath.magnitude(v))
    }
}

export default Vmath
export {Vmath}