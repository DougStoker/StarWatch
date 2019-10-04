"use strict"
import {Vmath} from "./modules/vmath.js"
import {uuidv4,getRandomColor,getRandomInt,wrapMod} from "./modules/funcs.js"
let myUUID = uuidv4();
var gamePieces = {};
let myColor = getRandomColor();
var itUUID;
let imit = false;
let pieceWidth = 30;
let pieceHeight = 30;
let itfilla = '#aa0000';
let itfillb = '#99ff00';
var itfill = itfilla;
const GAME_FRICTION = 0.975 // 1 = no friction , 0 = can't move
const PLAYER_MASS = 15
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const BOUNCINESS = 0.3 ;  //1  = 100% bounce 

//const wrapMod = (x, n) => (x % n + n) % n

/* var Vmath = {
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
    sub_vec: function(v1,v1){
        return({x:v1.x-v2.x,
                y:v1.y-v2.y})
    },
    normalize: function(v){
        return Vmath.divide_num(v,Vmath.magnitude(v))
    },
    times_componentwise : function(v1,v2){
        return{x: v1.x * v2.x,
               y: v1.y * v2.y}
    },
} */


var cango = true;

var socket = io('//:3000') // for localhost testing
    //var socket = io('https://nightwatch-server.now.sh')
socket.on('announce', () => {
    //console.log("announce received")s
    var myGamePiece = gamePieces[myUUID];
    socket.emit('move', {
        uuid: myUUID,
        pos: myGamePiece.pos,
        vel: myGamePiece.vel,
        color: myColor
    });
})
socket.on('it', (data) => {
    //console.log('Got it data: ', data)
    itUUID = data.uuid;
    if (itUUID == myUUID) { // I'm it!
        imit = true;
    } else {
        imit = false;
    }
    let flashIt = setInterval(function() { changeItColor() }, 100);
    setTimeout(function() {
        clearInterval(flashIt);
        itfill = itfilla;
    }, 3000);
})

socket.on('moved', function(data) {
    //console.log("move received:");
    //console.log(data);
    // This is where we parse the data object for the new box to draw
    if (typeof gamePieces[data.uuid] != "undefined") {
        //gamePieces[data.uuid].pos.x = data.x;
        //gamePieces[data.uuid].pos.y = data.y;
        gamePieces[data.uuid].pos = data.pos
        gamePieces[data.uuid].vel = data.vel
    } else {
        gamePieces[data.uuid] = new component(pieceWidth, pieceHeight, data.color, data.pos.x, data.pos.y);
    }
    // socket.emit('moved')
});
socket.on('remove', function(data) {
    // We should make some pretty animation here
    if (typeof gamePieces[data.uuid] != 'undefined') {
        delete gamePieces[data.uuid];
    }
})



var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        //document.body.style.backgroundImage = "url('https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/Hme4C4_7iosf3emf/stars-in-the-sky-looped-animation-beautiful-night-with-twinkling-flares-hd-1080_sr8wih9v__F0000.png')";
        this.interval = setInterval(updateGameArea, getRandomInt(5, 1));
        this.interval2 = setInterval(updateRefresh, getRandomInt(50, 10));
        window.addEventListener('keydown', function(e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;

        })
        window.addEventListener('keyup', function(e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = false;
        })

        window.addEventListener('mousedown', function(e) {
            e.preventDefault();
            myGameArea.mouse = true;
            myGameArea.mouseY = e.movementY;
            myGameArea.mouseX = e.movementX;
        })

        window.addEventListener('mousemove', function(e) {
            e.preventDefault();
            // This prevents us from sending a "stopping" event, 0,0
            // To make it allow for more angular movements, 
            // it would be good to keep the last three events and send
            // the average down to the gameArea
            if (e.movementY != 0 || e.movementX != 0) {
                myGameArea.mouseY = e.movementY;
                myGameArea.mouseX = e.movementX;
            }
        })

        window.addEventListener('mouseup', function(e) {
            myGameArea.mouse = false;
        })

        window.addEventListener('mouseout', function(e) {
            myGameArea.mouse = false;
        })
        window.addEventListener('touchstart', function(e) {
            e.preventDefault();
            myGameArea.touch = true;
            myGameArea.touches = e.touches;
            myGameArea.changedTouches = [];
        })
        window.addEventListener('touchmove', function(e) {
            e.preventDefault();
            myGameArea.touches = e.touches;
            myGameArea.changedTouches = e.changedTouches;
        })
        window.addEventListener('touchend', function(e) {
            myGameArea.touch = false;
            myGameArea.touches = [];
            myGameArea.changedTouches = [];
        })
    },
    clear: function() {
        //this.canvas.height = this.canvas.clientHeight * 0.95;
        //this.canvas.width = this.canvas.clientWidth * 0.95;
        //let width = this.canvas.width;
        //let height = this.canvas.height;
        //console.log("w: " + width + " h: " + height);
        this.context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
}

function updateRefresh() {
    clearInterval(myGameArea.interval);
    clearInterval(myGameArea.interval2);
    myGameArea.interval = setInterval(updateGameArea, getRandomInt(5, 1));
    myGameArea.interval2 = setInterval(updateRefresh, getRandomInt(50, 10));
}

function startGame() {
    myGameArea.start();
    gamePieces[myUUID] = new component(pieceWidth, pieceHeight, myColor, getRandomInt(0,GAME_WIDTH), getRandomInt(0,GAME_HEIGHT));
    socket.emit('move', {
        uuid: myUUID,
        pos: gamePieces[myUUID].pos,
        vel: gamePieces[myUUID].vel,
        color: myColor
    });
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.radius = width / 2; // for circles
    this.mass = PLAYER_MASS

    this.vel = {x:0,y:0}
    this.pos = {x:x,y:y}
    this.shipImage = new Image();
    this.shipImage.src = 'ship.jpg';
    this.alreadyCollided  = false;
    this.update = function(it, itcolor) {
            let ctx = myGameArea.context;

            // A square
            //ctx.fillRect(this.x, this.y, this.width, this.height);

            // A circle
            let radius = this.radius;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, radius, 0, 2 * Math.PI)
            ctx.fillStyle = color;
            ctx.fill();

            // A ship
            //ctx.drawImage(this.shipImage, 0, 0, this.shipImage.width, this.shipImage.height,this.x, this.y, this.width, this.height);

            if (it) {

                // This gives us a square

                ctx.fillStyle = itcolor;
                let ptf = 5;

                // A circle in the middle
                ctx.beginPath();
                ctx.arc(this.pos.x, this.pos.y, ptf, 0, 2 * Math.PI)
                ctx.fill();
                // A square in the middle
                //ctx.fillRect(this.x + (pieceWidth / ptf), this.y + (pieceHeight / ptf), this.width - ((
                //    pieceWidth / ptf) * 2), this.height - ((pieceWidth / ptf) * 2));


                /* This creates a hole in the ship */
                /*
                ctx.globalCompositeOperation = 'destination-out'
                ctx.arc(this.x + width/2, this.y + height/2, 10, 0, 2*Math.PI)
                ctx.fill()
                */

            }
        }

    this.updatePos = function() {
        //console.log(`[[${this.pos.x},${this.pos.y}],[${this.vel.x},${this.vel.y}]]`)
        this.pos = Vmath.add_vec(this.pos,this.vel)
        this.pos = Vmath.wrap_mod_xy(this.pos,GAME_WIDTH, GAME_HEIGHT)
        this.brake(GAME_FRICTION)

        for (var uuid in gamePieces) {
            if (uuid != myUUID) {
                if (checkOverlap(this, gamePieces[uuid])) {
                    //myGamePiece.newPos()
                        //console.log('overlap! ' + myUUID + " - " + uuid);
                    if(! this.alreadyCollided){
                        calcBounce(this, gamePieces[uuid])
                        this.alreadyCollided = true
                    }
                    if (imit && !this.overlap) {
                        socket.emit('tagged', {
                            olduuid: myUUID,
                            newuuid: uuid
                        })
                    }
    
                    this.overlap = true;
                } else {
                    this.overlap = false;
                    this.alreadyCollided=false
                }
            }
            gamePieces[uuid].update(uuid == itUUID, itfill); 
        }
    }
    this.acel = function(force) {
        newV = Vmath.divide_num(force,this.mass)
        this.vel = Vmath.add_vec(this.vel,newV)
    }
    this.brake = function(num) {
        this.vel = Vmath.times_num(this.vel,num)
    }
    this.newVel = function(v){
        this.vel = v
    }
}

function updateGameArea() {
    myGameArea.clear();
    var myGamePiece = gamePieces[myUUID];

    if (myGameArea.mouse) {
        let mouseX = myGameArea.mouseX
        let mouseY = myGameArea.mouseY
            //console.log("X "+mouseX + " Y " + mouseY)

        if (mouseX > 0) {
            myGamePiece.acel({x:1,y:0})

        } else if (mouseX < 0) {
            myGamePiece.acel({x:-1,y:0})
        } 

        if (mouseY > 0) {
            //myGamePiece.vel.y = 1;
            myGamePiece.acel({x:0,y:1})
        } else if (mouseY < 0) {
            //myGamePiece.vel.y = -1;
            myGamePiece.acel({x:0,y:-1})
        } //else { myGamePiece.vel.y = 0 }

        // end mouse movement checks
    } else if (myGameArea.touch) {
        let changedTouches = myGameArea.changedTouches
        let oldTouchSpot = (myGameArea.oldTouchSpot || changedTouches[0]);
        let touch = changedTouches[0]
        let diffX = touch.pageX - oldTouchSpot.pageX
        let diffY = touch.pageY - oldTouchSpot.pageY
        myGameArea.oldTouchSpot = changedTouches[0]

        if (diffX != 0 || diffY != 0) {
            if (diffX > 0) {
                //myGamePiece.vel.x = 1; 
                myGamePiece.acel({x:1,y:0})
            } else if (diffX < 0) {
                //myGamePiece.vel.x = -1;
                myGamePiece.acel({x:-1,y:0})
            } //else { myGamePiece.vel.x = 0}

            if (diffY > 0) {
                //myGamePiece.vel.y = 1;
                myGamePiece.acel({x:0,y:1})
            } else if (diffY < 0) {
                //myGamePiece.vel.y = -1;
                myGamePiece.acel({x:0,y:-1})
            } //else { myGamePiece.vel.y = 0 }
        }

    } else {


        if (myGameArea.keys && myGameArea.keys[37]) {
            myGamePiece.acel({x:-1,y:0})
        }
        if (myGameArea.keys && myGameArea.keys[39]) {
            myGamePiece.acel({x:1,y:0})
        }
        if (myGameArea.keys && myGameArea.keys[38]) {
            myGamePiece.acel({x:0,y:-1})
        }
        if (myGameArea.keys && myGameArea.keys[40]) {
            myGamePiece.acel({x:0,y:1})
        }
        // end keypress checks
    }

    if (/*cango && */(myGamePiece.vel.x != 0 || myGamePiece.vel.y != 0)) {
        socket.emit('move', {
            uuid: myUUID,
            pos: myGamePiece.pos,
            vel: myGamePiece.vel,
            color: myColor
        });
        //console.log(myGamePiece);
    } 
   
    myGamePiece.updatePos()

    for (var uuid in gamePieces) {
        if (uuid != myUUID) {
            if (checkOverlap(myGamePiece, gamePieces[uuid])) {
                //console.log('overlap! ' + myUUID + " - " + uuid);
                if (imit) {
                    socket.emit('tagged', {
                        olduuid: myUUID,
                        newuuid: uuid
                    })
                }
                //cango = true;
            }
        }
        gamePieces[uuid].update(uuid == itUUID, itfill);
    }
}

function changeItColor(){itfill = (itfill === itfilla) ? itfillb : itfilla}

 function calcBounce(obj1,obj2){
    //let mag1 = Vmath.magnitude(obj1.vel)
    //let mag2 = Vmath.magnitude(obj2.vel)
    //let dir1= {x:1,y:1}
    //let dir2= {x:-1,y:-1}
    //if(mag1 != 0){dir1 = Vmath.divide_num(obj1.vel,mag1)}
    //if(mag2 != 0){dir2 = Vmath.divide_num(obj2.vel,mag2)}

    //https://en.wikipedia.org/wiki/Elastic_collision
    let  sumMass = obj1.mass + obj2.mass


    let a1 = Vmath.sub_vec(obj1.pos,obj2.pos)
    let b1 = Vmath.sub_vec(obj1.vel,obj2.vel)
    let a2 = Vmath.sub_vec(obj2.pos,obj1.pos)
    let b2 = Vmath.sub_vec(obj2.vel,obj1.vel)
    let c1 = (2*obj2.mass)/sumMass
    let c2 = (2*obj1.mass)/sumMass
    let d1 = Vmath.dot_product(a1,b1)
    let d2 = Vmath.dot_product(a2,b2)
    let e1 = Vmath.magnitude(a1)
    e1 = e1*e1 
    let e2 = Vmath.magnitude(a2)
    e2 = e2*e2
    let f1 = Vmath.divide_num(d1,e1)
    let f2 = Vmath.divide_num(d2,e2)
    let g1 = Vmath.times_componentwise(f1,a1)
    let g2 = Vmath.times_componentwise(f2,a2)
    let h1 = Vmath.times_num(g1,c1)
    let h2 = Vmath.times_num(g2,c2)
    let final1 = Vmath.times_num(h1,BOUNCINESS)
    let final2 = Vmath.times_num(h2,BOUNCINESS)

    //let i1 = Vmath.invert(dir1)
    //let final1 = Vmath.times_num(i1,v1*BOUNCINESS)
    //let i2 = Vmath.invert(dir2)
    //let final2 = Vmath.times_num(i2,v2*BOUNCINESS)
    obj1.newVel(final1)
    obj2.newVel(final2)

} 




function checkOverlap(piece1, piece2) {

    // This is for square collision detection

    //console.log("checking for overlap")
    /*
    if (piece1.x > piece2.x + pieceWidth || piece2.x > piece1.x + pieceWidth) {
        //console.log("no overlap side-to-side");
        return false;
    }
    if (piece1.y > piece2.y + pieceHeight || piece2.y > piece1.y + pieceHeight) {
        //console.log("no overlap top-to-bottom")
        return false;
    }
    return true;
    */
    // This is for circle collision detection

    //let vsum = piece1.vel.add_vec_to(pi)

    let dx = piece1.pos.x - piece2.pos.x;
    let dy = piece1.pos.y - piece2.pos.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < piece1.radius + piece2.radius) {
        return true
    } else {
        return false
    }
}


/* function uuidv4() {
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
} */




startGame()