class Ship {
    constructor(speed, health, shipBitmap, isDead = false) {
        this.speed = speed;
        this.health = health;
        this.shipBitmap = shipBitmap;
        this.isDead = isDead;
    }
}


"use strict";
let engine = (function () {
    let canvas,
        stage,
        score,
        //Background
        backgroundImage,
        background,
        //Aim
        aimImage,
        aim,
        aimScale,
        aimHalfWidth,
        //Enemy
        shipImage,
        shipHolder,
        shipWidth;

    function initialize(canvasId, bgSource, aimSource, shipSource) {
        canvas = document.getElementById(canvasId);
        stage = new createjs.Stage(canvas);
        score = 0;
        shipHolder = [];

        backgroundImage = new Image();
        backgroundImage.src = bgSource;
        backgroundImage.onload = setBackground;

        aimImage = new Image();
        aimImage.src = aimSource;
        aimImage.onload = setAim;

        shipImage = new Image();
        shipImage.src = shipSource;
        shipImage.onload = createShip;
        shipWidth = 142; //from used image width

        attatchEvents();
    }


    function setAim() {
        aim = new createjs.Bitmap(aimImage);
        aimScale = 0.5;
        aimHalfWidth = (aimImage.width * aimScale) / 2;
        aim.scaleX = aimScale;
        aim.scaleY = aimScale;
    }

    function setBackground() {
        background = new createjs.Bitmap(backgroundImage);
        stage.addChild(background);

        setTimeout(stage.update(), 100)
    }

    function createShip() {
        let shipSpeed = 3 + Math.floor(Math.random() * 5);
        let shipHealth = Math.floor(1000 / shipSpeed);
        let shipBitmap = new createjs.Bitmap(shipImage);
        let xPosition = canvas.width - shipImage.width;
        let yPosition = Math.floor(Math.random() * (canvas.height - 100));

        shipBitmap.x = xPosition;
        shipBitmap.y = yPosition;

        shipHolder.push(new Ship(shipSpeed, shipHealth, shipBitmap));
        stage.addChild(shipBitmap);
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
        });
        //TODO: add logic for ship render and movement
        createjs.Ticker.addEventListener('tick', () => {
            if (shipHolder.length < 5) {
                createShip();
            }

            for (let idx = 0; idx < shipHolder.length; ++idx) {
                if (!shipHolder[idx].isDead) {
                    stage.children[idx + 1].x -= shipHolder[idx].speed;
                }
            }
            stage.update();
            removeEscapedShips();
        });

        function removeEscapedShips() {
            for (let idx = 1; idx < stage.children.length; ++idx) {
                if (stage.children[idx].x <= 0 - shipWidth) {
                    shipHolder[idx - 1].isDead = true;
                }
            }

            if (shipHolder.length < 0) return;

            if (shipHolder[0].isDead) {
                shipHolder.splice(0, 1);
                stage.removeChildAt(1);
            }
            //TODO: separate ships from other stage children in container
        }
    }

    return {
        initialize
    }
})();


function main() {
    const gameCanvasId = 'canvas',
        backgroundImageSource = 'res/spaceBackground.jpg',
        aimImageSource = 'res/aim.png',
        shipImageSource = 'res/shipSmall.png';


    engine.initialize(gameCanvasId, backgroundImageSource, aimImageSource, shipImageSource);
}
