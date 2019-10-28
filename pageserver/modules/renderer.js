
class Renderer{
    constructor(dims={x:0,y:0}){
        this.canvas = document.createElement("canvas")
        this.w = this.canvas.width = dims.x
        this.h = this.canvas.height = dims.y
        this.context = this.canvas.getContext("2d")
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
    }
    circle = (pos,color,radius) => {

    }
    clear = () => {
        //this.canvas.height = this.canvas.clientHeight * 0.95
        //this.canvas.width = this.canvas.clientWidth * 0.95
        //let width = this.canvas.width
        //let height = this.canvas.height
        //console.log("w: " + width + " h: " + height)
        this.context.clearRect(0, 0, this.w, this.h)
    }

    image = (img,pos,dims,angle) => {
        this.context.save()
        this.context.translate(pos.x,pos.y)
        this.context.rotate(angle)
        this.context.drawImage(img, 0, 0, img.width, img.height, -(dims.x/2), -(dims.x/2), dims.x, dims.y)
        this.context.restore()

    }
    filledCircle = (color,radius,pos) => {
        this.context.fillStyle = color
        this.context.beginPath()
        this.context.arc(pos.x,pos.y,radius, 0, 2 * Math.PI)
        this.context.fill()
    }
    myHealthBar = (hp,width) => {
        this.context.fillStyle = '#ff0000'
        this.context.fillRect(20,10,width-10 ,3)
        this.context.stroke()
        if(hp>0){this.context.fillStyle = '#00ff00'
            this.context.fillRect(20,10,(width-20)*(hp/30000)+10, 3)
            this.context.stroke()
        }
    }
    hpBar = (pos,w,hp) => {
        this.context.fillStyle = '#ff0000'
        this.context.fillRect(pos.x-w,pos.y-w,100 ,1)
        this.context.stroke()
        if(hp>0){this.context.fillStyle = '#00ff00'
            this.context.fillRect(pos.x-w,pos.y-w,hp/300, 1)
            this.context.stroke()
        }

    }
}
export default Renderer
export {Renderer}