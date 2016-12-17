"use strict";

let engine = (function () {
    let canvas,
        stage,
        backgroundImage,
        aimImage,
        background,
        aim,
        aimScale,
        aimHalfWidth,
        score;

    function initialize(canvasId, bgSource, aimSource) {
        canvas = document.getElementById(canvasId);
        stage = new createjs.Stage(canvas);
        score = 0;

        backgroundImage = new Image();
        backgroundImage.src = bgSource;
        backgroundImage.onload = setBackground;

        aimImage = new Image();
        aimImage.src = aimSource;
        aimImage.onload = initializeAim;

        attatchEvents();
    }

    function initializeAim() {
        aim = new createjs.Bitmap(aimImage);
        aimScale = 0.5;
        aimHalfWidth = (aimImage.width * aimScale) / 2;
        aim.scaleX = aimScale;
        aim.scaleY = aimScale;
    }

    function setBackground(event) {
        background = new createjs.Bitmap(backgroundImage);
        stage.addChild(background);

        setTimeout(stage.update(), 100)
    }

    function attatchEvents() {
        stage.addEventListener('click', (event) => {
            console.log("Click: ", event.stageX, event.stageY);
        });

        stage.addEventListener('stagemousemove', (event) => {
            let xAxis = event.stageX,
                yAxis = event.stageY;

            aim.x = xAxis - aimHalfWidth;
            aim.y = yAxis - aimHalfWidth;

            stage.addChild(aim);
            stage.update();
        });
    }

    return {
        initialize
    }
})();


function main() {
    const gameCanvasId = 'canvas',
        backgroundImageSource = 'res/spaceBackground.jpg',
        aimImageSource = 'res/aim.png';


    engine.initialize(gameCanvasId, backgroundImageSource, aimImageSource);
}
