/// <reference path = "_reference.ts" />

// Global Variables
var assets;
var canvas: HTMLElement;
var stage: createjs.Stage;

var spriteSheetLoader : createjs.SpriteSheetLoader;
var atlas : createjs.SpriteSheet;
var player_anim : createjs.SpriteSheet;
var enemy1_anim: createjs.SpriteSheet;
var dimension : number = config.Dimension.firstDimension;

var currentScene : objects.Scene;
var scene: number;

var playerPosition : objects.Vector2;
var globalScore: number = 0;
var levelScore : number = 0;
var highScore : number = 0;
var level1HS : number = 0;
var level2HS : number = 0;
var level3HS : number = 0;

var tileSize:number=128;
var loadProgress;
var loadingBar : createjs.Shape;

// Preload Assets required
var assetData:objects.Asset[] = [
    {id: "bgBack", src: "../../Assets/images/bg-back.png"},
    {id: "bgBack2", src: "../../Assets/images/bg-back2.png"},
    {id: "bgBack3", src: "../../Assets/images/bg-back3.png"},
    {id: "bgTut", src: "../../Assets/images/tutorial.png"},
    {id: "platform1_3", src: "../../Assets/images/tile_1_3.png"},
    {id: "platform1_3_alt", src: "../../Assets/images/tile_1_3_alt.png"},
    {id: "platformVines", src: "../../Assets/images/tile_1_3_vine.png"},
    {id: "platformWood", src: "../../Assets/images/tile_1_3_wood.png"},
    {id: "bgFront", src: "../../Assets/images/bg-front.png"},
    {id: "filter", src: "../../Assets/images/dimension1-bg.png"},
    {id: "filterLvl2", src: "../../Assets/images/dimension3-bg.png"},
    {id: "filterLvl3", src: "../../Assets/images/dimension4-bg.png"},
    {id: "filterAlt", src: "../../Assets/images/dimension2-bg.png"},
    {id: "btnPlay", src: "../../Assets/images/btn-play.png"},
    {id: "btnInstruct", src: "../../Assets/images/btn-how-to-play.png"},
    {id: "enemy1", src: "../../Assets/images/enemy1_ss_64x135.png"},
    {id: "enemyHover", src: "../../Assets/images/enemy1_red_64x135.png"},
    {id: "enemyObstacle", src: "../../Assets/images/enemyObstacle.png"},
    {id: "spike", src: "../../Assets/images/Spike.png"},
    {id: "b_spike", src: "../../Assets/images/Spike.png"},
    {id: "invisibleWall", src: "../../Assets/images/invisibleWall_2x500.png"},
    {id: "title", src: "../../Assets/images/title.png"},
    {id: "player", src: "../../Assets/images/runner.png"},
    {id: "enemyReticle", src: "../../Assets/images/reticle-shift-2.png"},
    {id: "signWoods", src: "../../Assets/images/wood-sign-woods.png"},
    {id: "signVillage", src: "../../Assets/images/wood-sign-village.png"},
    {id: "signWin", src: "../../Assets/images/wood-sign-win.png"},
    {id: "signCity", src: "../../Assets/images/wood-sign-city.png"},
    {id: "baby", src: "../../Assets/images/baby.png"},
    {id: "blackBox", src: "../../Assets/images/bg-blackbox.png"},
    {id: "deathFilter", src: "../../Assets/images/deathFilter.png"},
    //Audio
    {id: "menuSong", src: "../../Assets/audio/ChopNocNo13.mp3"},
    {id: "citySound", src: "../../Assets/audio/Crickets.mp3"},
    {id: "woodsSound", src: "../../Assets/audio/Forest.mp3"},
    {id: "villageSound", src: "../../Assets/audio/Wind.mp3"},
    {id: "dimensionSound", src: "../../Assets/audio/Ominous.mp3"},
    {id: "beastGrowl", src: "../../Assets/audio/Growl.mp3"},
    {id: "enemyDeathSound", src: "../../Assets/audio/Ping.mp3"},
    {id: "playerDeathSound", src: "../../Assets/audio/Sighing.mp3"},
    {id: "babySounds", src: "../../Assets/audio/BabyGoogles.mp3"}
];

function preload() {
    showLoading();
    // Create a queue for assets being loaded
    assets = new createjs.LoadQueue(false);
    assets.installPlugin(createjs.Sound);
    // Register callback function to be run when assets complete loading.
    loadProgress = assets.progress;
    assets.on("complete", init, this);
    assets.on("progress", updateProgress, this);
    assets.loadManifest(assetData);
}

function init() {
    // Reference to canvas element
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(config.Game.FPS);
    createjs.Ticker.on("tick", this.gameLoop, this);
    
    let newData0 = {
        
        images: [ assets.getResult("player") ],
        frames: {width:120, height:120, count:32, regX: 60, regY:60, spacing:0, margin:0},
        animations: { 
            idle: 5,
            run: { frames: [ 8, 9, 10, 11, 12, 13, 14, 15], speed: 0.25 },
            idle_alt: 21,
            run_alt: { frames: [ 24, 25, 26, 27, 28, 29, 30, 31], speed: 0.1 },
        }
    }
    
     let newData1 = {
        "images": [assets.getResult("enemy1")],
        "frames": {width:64, height:135},
        "animations": {
           "idle": {"frames": [0,1,2,3],"speed": 0.2, next: true }
        }
    }

    player_anim = new createjs.SpriteSheet(newData0);
    enemy1_anim = new createjs.SpriteSheet(newData1);
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
        case config.Scene.LEVEL2 :
            stage.removeAllChildren();
            currentScene = new scenes.Level2();
            console.log("Starting LEVEL 2 scene");
            break;
        case config.Scene.LEVEL3 :
            stage.removeAllChildren();
            currentScene = new scenes.Level3();
            console.log("Starting LEVEL 3 scene");
            break;
        case config.Scene.TUTORIAL :
            stage.removeAllChildren();
            currentScene = new scenes.Tutorial();
            console.log("Starting Tutorial scene");
            break;
        case config.Scene.END :
            stage.removeAllChildren();
            currentScene = new scenes.End();
            console.log("Starting End scene");
            break;    
    }
    
}

//Update the loading bar's size
function updateProgress(){
    loadProgress = assets.progress;
    loadingBar.scaleX = loadProgress * 500;
    stage.update();
}

//Add loading bar shape and label
function showLoading() {
	canvas = document.getElementById("canvas");
	stage = new createjs.Stage(canvas);
	
	var loadLabel = new objects.Label("Shifting Dimensions...", "26px Consolas", "#FFFFFF", config.Screen.CENTER_X, config.Screen.CENTER_Y - 100);
    stage.addChild(loadLabel);
    
    loadingBar = new createjs.Shape();
    var lBWidth = 500;
    var lBHeight = 20;
    var lBColor = "#FFFFFF";
    loadingBar.graphics.beginFill(lBColor).drawRect(0, 0, 1, lBHeight).endFill();
    loadingBar.x = config.Screen.CENTER_X - (lBWidth/2);
    loadingBar.y = config.Screen.CENTER_Y;
    stage.addChild(loadingBar);
    
    var lBFrame = new createjs.Shape();
    var lBFramePadding = 4;
    lBFrame.graphics.setStrokeStyle(1).beginStroke(lBColor).drawRect(-lBFramePadding/2, -lBFramePadding/2, lBWidth + lBFramePadding, lBHeight + lBFramePadding).endStroke();
    lBFrame.x = config.Screen.CENTER_X - (lBWidth/2);
    lBFrame.y = config.Screen.CENTER_Y;
    stage.addChild(lBFrame);
    
    stage.update();
}

