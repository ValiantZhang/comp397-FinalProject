/// <reference path = "_reference.ts" />
// Global Variables
var assets;
var canvas;
var stage;
var spriteSheetLoader;
var atlas;
var player_anim;
var enemy1_anim;
var dimension = config.Dimension.firstDimension;
var currentScene;
var scene;
var playerPosition;
var tileSize = 128;
// Preload Assets required
var assetData = [
    { id: "bgBack", src: "../../Assets/images/bg-back.png" },
    { id: "bgTut", src: "../../Assets/images/tutorial.png" },
    { id: "platform1_3", src: "../../Assets/images/tile_1_3.png" },
    { id: "platform1_3_alt", src: "../../Assets/images/tile_1_3_alt.png" },
    { id: "bgFront", src: "../../Assets/images/bg-front.png" },
    { id: "filter", src: "../../Assets/images/dimension1-bg.png" },
    { id: "filterAlt", src: "../../Assets/images/dimension2-bg.png" },
    { id: "btnPlay", src: "../../Assets/images/btn-play.png" },
    { id: "btnInstruct", src: "../../Assets/images/btn-how-to-play.png" },
    { id: "enemy1", src: "../../Assets/images/enemy1_ss_64x135.png" },
    { id: "spike", src: "../../Assets/images/Spike.png" },
    { id: "b_spike", src: "../../Assets/images/Spike_black.png" },
    { id: "invisibleWall", src: "../../Assets/images/invisibleWall_2x500.png" },
    { id: "player", src: "../../Assets/images/runner.png" }
];
function preload() {
    // Create a queue for assets being loaded
    assets = new createjs.LoadQueue(false);
    assets.installPlugin(createjs.Sound);
    // Register callback function to be run when assets complete loading.
    assets.on("complete", init, this);
    assets.loadManifest(assetData);
}
function init() {
    // Reference to canvas element
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(config.Game.FPS);
    createjs.Ticker.on("tick", this.gameLoop, this);
    var newData0 = {
        images: [assets.getResult("player")],
        frames: { width: 120, height: 120, count: 32, regX: 60, regY: 60, spacing: 0, margin: 0 },
        animations: {
            idle: 5,
            run: { frames: [8, 9, 10, 11, 12, 13, 14, 15], speed: 0.25 },
        }
    };
    var newData1 = {
        "images": [assets.getResult("enemy1")],
        "frames": { width: 64, height: 135 },
        "animations": {
            "idle": { "frames": [0, 1, 2, 3], "speed": 0.2, next: true }
        }
    };
    /*let atlasData = {
        
        images: [ assets.getResult("player") ],
            
        frames: {width:120, height:120, count:32, regX: 60, regY:60, spacing:0, margin:0},
        
        animations: {
            idle: 5,
            run: { frames: [ 8, 9, 10, 11, 12, 13, 14, 15], speed: 0.5 },
        }
    }*/
    // let atlasData = {
    //     "images": [
    //         /*
    //         assets.getResult("player"),
    //         assets.getResult("block"),
    //         assets.getResult("pipe1.png"),
    //         assets.getResult("pipe2.png"),
    //         assets.getResult("pipe3.png"),
    //         assets.getResult("qBlock")
    //         */
    //         assets.getResult("atlas")
    //     ],
    //     "frames":[
    //         [40,0,45,45,0,0,0],
    //         [43,45,46,86,0,0,0],
    //         [43.131,39,86,0,0,0],
    //         [0,131,43,86,0,0,0],
    //         [0,217,87,87,0,0,0],
    //         [0,304,87,130,0,0,0],
    //         [0,434,93,175,0,0,0],
    //         [0,45,43,86,0,0,0],
    //         [0,0,40,45,0,0,0]
    //     ],
    //     "animations":{
    //         "run" : { "frames" : [1, 3] , speed : 0.5},
    //         "player" : { "frames" : [7] },
    //         "block" : { "frames" : [0] },
    //         "qBlock" : { "frames" : [8]}, 
    //         "pipe1" : { "frames" : [4] },
    //         "pipe2" : { "frames" : [5] },
    //         "pipe3" : { "frames" : [6] }
    //     }, 
    // }
    // atlas = new createjs.SpriteSheet(atlasData);
    player_anim = new createjs.SpriteSheet(newData0);
    enemy1_anim = new createjs.SpriteSheet(newData1);
    //atlas = new createjs.SpriteSheet(atlasData);
    scene = config.Scene.MENU;
    changeScene();
}
function gameLoop(event) {
    // Update whatever scene is currently active.
    currentScene.update();
    stage.update();
}
function changeScene() {
    // Simple state machine pattern to define scene swapping.
    switch (scene) {
        case config.Scene.MENU:
            stage.removeAllChildren();
            currentScene = new scenes.Menu();
            ;
            console.log("Starting MENU scene");
            break;
        case config.Scene.GAME:
            stage.removeAllChildren();
            currentScene = new scenes.Play();
            console.log("Starting PLAY scene");
            break;
        case config.Scene.LEVEL2:
            stage.removeAllChildren();
            currentScene = new scenes.Level2();
            console.log("Starting LEVEL 2 scene");
            break;
        case config.Scene.TUTORIAL:
            stage.removeAllChildren();
            currentScene = new scenes.Tutorial();
            console.log("Starting Tutorial scene");
            break;
    }
}
//# sourceMappingURL=game.js.map