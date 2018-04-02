function Shape(canvas,cobj,copy) {
    this.canvas=canvas;
    this.copy=copy;
    this.cobj=cobj;
    this.width=canvas.width;
    this.height=canvas.height;
    this.type="line";
    this.style="stroke";
    this.fillStyle="#000";
    this.strokeStyle="#000";
    this.lineWidth=1;
    this.history=[];
    this.bianNum=5;
    this.isback=true;
    this.clearSize=25;

}
Shape.prototype={
    init:function () {
        this.cobj.fillStyle=this.fillStyle;
        this.cobj.strokeStyle=this.strokeStyle;
        this.cobj.lineWidth=this.lineWidth;
    },
    draw:function () {
        this.init();
        var that=this;
        that.copy.onmousedown=function (e) {
            var startx=e.offsetX;
            var starty=e.offsetY;
            that.copy.onmousemove=function (e) {
                that.isback=true;
                var endx=e.offsetX;
                var endy=e.offsetY;
                var r=Math.sqrt(Math.pow((endx-startx),2)+Math.pow((endy-starty),2));
                that.cobj.clearRect(0,0,that.width,that.height);
                if (that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0)
                }
                that.cobj.beginPath();
                that[that.type](startx,starty,endx,endy,r);
            };
            that.copy.onmouseup=function () {
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                
            }
            
        }
    },
    line:function (x, y, x1, y1) {
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();
    },
    rect:function (x,y,x1,y1) {
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj[this.style]();
    },
    circle:function (x,y,x1,y1,r) {
        this.cobj.arc(x,y,r,0,2*Math.PI);
        this.cobj[this.style]();
    },
    bian:function (x,y,x1,y1,r) {
        var angle=Math.PI*2/this.bianNum;
        for (var i=0;i<this.bianNum;i++){
            this.cobj.lineTo(Math.cos(i*angle)*r+x,Math.sin(i*angle)*r+y)
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    jiao:function (x,y,x1,y1,r) {
        var angle=Math.PI*2/(this.bianNum*2);
        this.cobj.beginPath();
        for (var i = 0; i <this.bianNum*2; i++) {
            if (i%2==0){
                this.cobj.lineTo(Math.cos(angle*i)*r+x,
                    Math.sin(angle*i)*r+y);
            }else {
                this.cobj.lineTo(Math.cos(angle*i)*r/3+x,
                    Math.sin(angle*i)*r/3+y);
            }


        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    pen:function () {
        var that=this;
        that.copy.onmousedown=function (e) {
            var startx=e.offsetX;
            var starty=e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function (e) {
                that.init();
                that.isback=true;
                var endx=e.offsetX;
                var endy=e.offsetY;
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();
            };
            that.copy.onmouseup=function () {
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }

        }
    },
    clear:function (clearObj) {
        var that=this;
        that.copy.onmousemove=function (e) {
            var ox=e.offsetX;
            var oy=e.offsetY;
            move(ox,oy);
        };
        function move(ox,oy) {
            var lefts=ox-that.clearSize/2;
            var tops=oy-that.clearSize/2;
            if (lefts<0){
                lefts=0;
            }
            if (lefts>that.width-that.clearSize){
                lefts=that.width-that.clearSize
            }
            if (tops<0){
                tops=0;
            }
            if (tops>that.height-that.clearSize){

                tops=that.height-that.clearSize
            }

            clearObj.css({
                width:that.clearSize,
                height:that.clearSize,
                left:lefts,
                top:tops,
                display:"block"
            })
        }
        that.copy.onmousedown=function (e) {
            that.copy.onmousemove=function (e) {
                var endx=e.offsetX;
                var endy=e.offsetY;
                move(endx,endy);
                that.cobj.clearRect(endx,endy,that.clearSize,that.clearSize);
            };
            that.copy.onmouseup=function () {
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.clear(clearObj);
            }
        };
    }
};