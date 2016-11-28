/// <reference path = "_reference.ts" />

// Global Variables
var assets;
var canvas: HTMLElement;
var stage: createjs.Stage;

var spriteSheetLoader : createjs.SpriteSheetLoader;
var atlas : createjs.SpriteSheet;

var currentScene : objects.Scene;
var scene: number;

// Preload Assets required
var assetData:objects.Asset[] = [
    {id: "bgBack", src: "../../Assets/images/bg-back.png"},
    {id: "bgFront", src: "../../Assets/images/bg-front.png"},
    {id: "filter", src: "../../Assets/images/dimension1-bg.png"},
    {id: "filterAlt", src: "../../Assets/images/dimension2-bg.png"},
    {id: "btnPlay", src: "../../Assets/images/btn-play.png"},
    {id: "btnInstruct", src: "../../Assets/images/btn-how-to-play.png"},
    {id: "player", src: "../../Assets/images/runner.png"}
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

    let atlasData = {
        
        images: [ assets.getResult("player") ],
            
        frames: {width:120, height:120, count:32, regX: 60, regY:60, spacing:0, margin:0},
        
        animations: { 
            idle: 5,
            run: { frames: [ 8, 9, 10, 11, 12, 13, 14, 15], speed: 0.5 },
        }
    }
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

    atlas = new createjs.SpriteSheet(atlasData);
    scene = config.Scene.MENU;
    changeScene();
}

function gameLoop(event: createjs.Event): void {
    // Update whatever scene is currently active.
    currentScene.update();
    stage.update();
}

function changeScene() : void {
    
    // Simple state machine pattern to define scene swapping.
    switch(scene)
    {
        case config.Scene.MENU :
            stage.removeAllChildren();
            currentScene = new scenes.Menu();;
            console.log("Starting MENU scene");
            break;
        case config.Scene.GAME :
            stage.removeAllChildren();
            currentScene = new scenes.Play();
            console.log("Starting PLAY scene");
            break;
    }
    
}