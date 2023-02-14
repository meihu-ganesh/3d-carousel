var radius = 240;
var autoRotate = true;
var rotateSpeed = -60;
var imageWidth = 170;
var imageHeight = 120;
setTimeout(init, 1000);
var onDrag = document.getElementById("drag-container");
var onSpin = document.getElementById("spin-container");
var aImg = onSpin.getElementsByTagName('img');
var eEle = [...aImg];
// Size of images
onSpin.style.width = imageWidth + "px";
onSpin.style.height = imageHeight + "px";

// Size of ground - depend on radius
var ground = document.getElementById("ground");
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
    for (var i = 0; i < aEle.length; i++) {
        aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    }
}

function applyTransform(obj) {
    // Constrain the angle of camera (between 0 and 180)
    if(tY > 180) tY = 180;
    if(tY < 0) tY = 0;

    //Apply the angle & syntax error 
    obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
    onSpin.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// auto spin
if (autoRotate) {
    var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
    onSpin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`
}

// setup events
document.onpointerdown = function (e) {
    clearInterval(onDrag.timer);
    e = e || window.event;
    var sX = e.clientX,
        sY = e.clientY;

    this.onpointermove = function (e) {
        e = e || window.event;
        var nX = e.clientX, 
            nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY = desY ** 0.1;
        applyTransform(onDrag);
        sX = nX;
        sY = nY;
    };
    
    this.onpointerup = function (e) {
        onDrag.timer = setInterval(function () {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTransform(onDrag);
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(onDrag.timer);
                playSpin(true);
            }
        }, 17);
        this.onpointermove = this.onpointerup = null;
    };

    return false;
};

document.onmousewheel = function (e) {
    e = e || window.event;
    var d = e.wheelDelta / 20 || -e.detail;
    radius += d;
};