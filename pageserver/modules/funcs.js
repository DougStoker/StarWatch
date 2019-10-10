function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomInt(max, min) {
    if (min == null || min == undefined) {
        min = 0
    }
    return Math.floor(Math.random() * Math.floor(max - min) + min)
}

//const wrapMod = (x, n) => (x % n + n) % n
function wrapMod(x, n) {return (x % n + n) % n}


const rads = function(n){return ((n*3.14159265359)/180)/* %6.283185307179586 */}
const degs = function(n){return ((n*180)/3.14159265359)}


export default uuidv4;
export {getRandomColor,getRandomInt,uuidv4,wrapMod,degs,rads};
