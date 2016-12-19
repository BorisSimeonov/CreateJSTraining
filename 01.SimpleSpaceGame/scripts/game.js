"use strict";
let engine = (function () {
    let canvas,
        stage,
        scoreCount,
        scoreText,
        playerLevel,
        levelText,
        playerDamage,
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
        shipContainer = new createjs.Container();
        maxShipsCount = 5;
        playerDamage = 140;

        setInfoBoard();

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

    function setInfoBoard() {
        scoreCount = 0;
        scoreText = new createjs.Text(`Score: ${scoreCount}`, '20px Arial', '#FFF');
        scoreText.baseline = 'top';
        scoreText.x = 20;
        scoreText.y = 20;
        scoreText.name = 'score';

        playerLevel = 0;
        levelText = new createjs.Text(`Level: ${playerLevel}`, '20px Arial', '#FFF');
        levelText.baseline = 'top';
        levelText.x = 20;
        levelText.y = 40;
        levelText.name = 'level';
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
        stage.addChild(scoreText); //add the text after the background is loaded and added
        stage.addChild(levelText);
    }

    function createShip() {
        stage.addChild(shipContainer);
        let ship = new createjs.Bitmap(shipImage);
        ship.name = 'enemyShip';
        ship.mouseEnabled = true;

        shipContainer.addChild(ship);
        resetShip(ship);
    }

    function resetShip(ship) {
        ship.x = canvas.width + Math.floor(2 * Math.random() * shipImage.width);
        ship.y = Math.floor(Math.random() * (canvas.height - 100));
        ship.speed = 3 + Math.floor(Math.random() * 5);
        ship.health = Math.floor(1000 / ship.speed);

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
            let mouseTarget = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY);
            //the index of 1 is used to surpass the aim as target and select the next child of stage
            if(mouseTarget[1].name === 'enemyShip') {
                mouseTarget[1].health -= playerDamage;
                if(mouseTarget[1].health <= 0) {
                    mouseTarget[1].isDead = true;
                    scoreCount += 100;
                } else {
                    scoreCount += 1;
                }
                stage.getChildByName('score').text = `Score: ${scoreCount}`;
            }
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
