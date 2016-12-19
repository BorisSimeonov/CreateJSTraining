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
        shipContainer,
        shipWidth,
        maxShipsCount;

    function initialize(canvasId, bgSource, aimSource, shipSource) {
        canvas = document.getElementById(canvasId);
        stage = new createjs.Stage(canvas);
        score = 0;
        shipContainer = new createjs.Container();
        maxShipsCount = 5;

        backgroundImage = new Image();
        backgroundImage.src = bgSource;
        backgroundImage.onload = setBackground;

        aimImage = new Image();
        aimImage.src = aimSource;
        aimImage.onload = setAim;

        shipImage = new Image();
        shipImage.src = shipSource;
        shipWidth = 142; //from used image width
        shipImage.onload = createShip;

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
        stage.addChild(shipContainer);
        let ship = new createjs.Bitmap(shipImage);
        ship.speed = 3 + Math.floor(Math.random() * 5);
        ship.health = Math.floor(1000 / ship.speed);

        shipContainer.addChild(ship);
        resetShip(ship);
    }

    function resetShip(ship) {
        ship.x = canvas.width - shipImage.width;
        ship.y = Math.floor(Math.random() * (canvas.height - 100));
        ship.isDead = false;
    }

    function removeDeadShips() {
        shipContainer.children.forEach(ship => {
           if(ship.isDead) {
               shipContainer.removeChild(ship);
           }
        });
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

        createjs.Ticker.addEventListener('tick', () => {
            //Move the spawned ships
            shipContainer.children.forEach(ship => {
                ship.x -= ship.speed;
                if(ship.x < shipWidth * (-1)) ship.isDead = true;
            });
            //Than check if there is a spot for new ship
            if(shipContainer.children.length < maxShipsCount) {
                createShip();
            }
            //update the stage after the changes
            stage.update();
            removeDeadShips();
        });

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
