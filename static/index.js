/*
 * Author: Evan Lucas-Currie
 */

var dataPoints;
var id;
var timeoutCount = 0;
var canvas;
var colors = ["red","coral","yellow","orange","green", "purple", "pink"];
var scaleAdjustment;
var imageHeight;
var imageWidth;
var devWidth;
var devHeight;
var expectConfidence = 0.5;
var submitted = false;

$("#tsparticles")
.particles()
.ajax("particles2.json", function (container) {
});

function deviceWidth(){
    devWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    devHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    devWidth *= 0.7;
    document.getElementById("display").style.height = devHeight * 0.75 + "px";
}

function play(name) {
    document.getElementById("aside").innerHTML = `<audio id="audio" src="/static/audio/${name}.mp3"></audio>`
    var audio = document.getElementById("audio");
    audio.play();
}

function draw(x, y, widthVal, heightVal, label, num){
    let color = colors[num % colors.length]

    var rect = new fabric.Rect({
        left: x,
        top: y,
        stroke: color,
        strokeWidth: 4,
        width: widthVal - x,
        height: heightVal - y,
        fill: "rgb(0,0,0,0)"
    });

    var text = new fabric.Text(label, { 
        fontFamily: 'Comic Sans MS',
        left: x + 3,
        top: y + 3, 
        fill: 'black',
        backgroundColor: color,
        fontWeight: 'bold', 
        fontSize: 28
    });
    text.set('selectable', false);
    rect.set('selectable', false);
    canvas.add(rect);
    canvas.add(text);

    document.getElementById("canvas").style.display = "";
    document.getElementById("display").style.maxHeight = imageHeight;
}

function send(){
    if(submitted){
        return;
    }
    let form_data = new FormData(document.getElementById("myForm"));
    form_data.append('image', document.getElementById("getImage").files);
    submitted = true;
    $(() => {
    $.ajax({
        type: 'POST',
        url:  '/predict',
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: (data) => {
            dataPoints = JSON.parse(data);
        },
    });
    });

    id = setInterval(() => {
        if(dataPoints != null){
            for(let x of dataPoints){
                if(x.confidence > expectConfidence && x.name != ""){
                    x.xmin = Math.round(x.xmin * scaleAdjustment);
                    x.ymin = Math.round(x.ymin * scaleAdjustment);
                    x.ymax = Math.round(x.ymax * scaleAdjustment);
                    x.xmax = Math.round(x.xmax * scaleAdjustment);
                    draw(x.xmin, x.ymin, x.xmax, x.ymax, x.name, x.class);
                }
            }
            timeoutCount = 0;
            stopInterval();    
        } else if(timeoutCount == 100){
            alert("Timeout: Did not receive server data. Server may be overloaded at the moment try smaller images")
            stopInterval();
        }
        timeoutCount++;
    }, 100);
    
}

function stopInterval(){
    clearInterval(id);
}


const image = document.querySelector("#getImage");

image.addEventListener("change", function() {
    let uploaded_image;
    if(canvas != null){
        canvas.clear();
    }
    
    try{
        submitted = false;
        document.getElementById("canvasContainer").innerHTML = '<canvas id="canvas"></canvas>';
        dataPoints = null;
        imagePosted = false;
        const reader = new FileReader();

        reader.onload = function(event){
            uploaded_image = new Image();
            uploaded_image.src = event.target.result;
            uploaded_image.onload = function() {
            scaleAdjustment = 1;
            imageHeight = this.height;
            imageWidth = this.width;


            if(imageWidth > devWidth){
                scaleAdjustment = devWidth / imageWidth;
                imageHeight *= scaleAdjustment;
                imageWidth *= scaleAdjustment;
            }
            canvas = new fabric.Canvas('canvas');
            canvas.on({
                "mouse:down": function (event) {
                        var pointer = canvas.getPointer(event.e);
                        console.info("Mouse Coords: "+pointer.x+" "+pointer.y);
                        let name;
                        let min = null;
                        for(x of dataPoints){
                                if(x.xmin <= pointer.x && x.ymin <= pointer.y 
                                    && x.ymax >= pointer.y && x.xmax >= pointer.x 
                                    && x.confidence > expectConfidence){
                                        let diff = x.ymax - pointer.y + x.xmax - pointer.x;
                                        if(min == null){
                                            min = diff;
                                            name = x.name;
                                        }else if(min > diff){
                                            name = x.name;
                                            console.info(x);
                                        }
                                    }
                        }

                        if(name != null){
                            play(name);  
                        }
                }
            });

            canvas.selection = false;
            canvas.setHeight(imageHeight);
            canvas.setWidth(imageWidth);
            
            var imgInstance = new fabric.Image(uploaded_image, {
                left: 0,
                top: 0,
                angle: 0,
                opacity: 1,
                scaleX: scaleAdjustment,
                scaleY: scaleAdjustment
            });
            
            imgInstance.set('selectable', false);
            canvas.add(imgInstance);
            }
            
        };
        reader.readAsDataURL(this.files[0]);
    }catch(exception){
        console.log("Image could not be obtained");
    }
});