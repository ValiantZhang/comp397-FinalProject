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
    { id: "bgBack2", src: "../../Assets/images/bg-back2.png" },
    { id: "bgBack3", src: "../../Assets/images/bg-back3.png" },
    { id: "bgTut", src: "../../Assets/images/tutorial.png" },
    { id: "platform1_3", src: "../../Assets/images/tile_1_3.png" },
    { id: "platform1_3_alt", src: "../../Assets/images/tile_1_3_alt.png" },
    { id: "platformVines", src: "../../Assets/images/tile_1_3_vine.png" },
    { id: "platformWood", src: "../../Assets/images/tile_1_3_wood.png" },
    { id: "bgFront", src: "../../Assets/images/bg-front.png" },
    { id: "filter", src: "../../Assets/images/dimension1-bg.png" },
    { id: "filterLvl2", src: "../../Assets/images/dimension3-bg.png" },
    { id: "filterLvl3", src: "../../Assets/images/dimension4-bg.png" },
    { id: "filterAlt", src: "../../Assets/images/dimension2-bg.png" },
    { id: "btnPlay", src: "../../Assets/images/btn-play.png" },
    { id: "btnInstruct", src: "../../Assets/images/btn-how-to-play.png" },
    { id: "enemy1", src: "../../Assets/images/enemy1_ss_64x135.png" },
    { id: "enemyHover", src: "../../Assets/images/enemy1_red_64x135.png" },
    { id: "enemyObstacle", src: "../../Assets/images/enemyObstacle.png" },
    { id: "spike", src: "../../Assets/images/Spike.png" },
    { id: "b_spike", src: "../../Assets/images/Spike.png" },
    { id: "invisibleWall", src: "../../Assets/images/invisibleWall_2x500.png" },
    { id: "title", src: "../../Assets/images/title.png" },
    { id: "player", src: "../../Assets/images/runner.png" },
    { id: "enemyReticle", src: "../../Assets/images/reticle-shift-2.png" },
    { id: "signWoods", src: "../../Assets/images/wood-sign-woods.png" },
    { id: "signVillage", src: "../../Assets/images/wood-sign-village.png" },
    { id: "signWin", src: "../../Assets/images/wood-sign-win.png" },
    { id: "signCity", src: "../../Assets/images/wood-sign-city.png" },
    { id: "blackBox", src: "../../Assets/images/bg-blackbox.png" },
    { id: "deathFilter", src: "../../Assets/images/deathFilter.png" },
    //Audio
    { id: "menuSong", src: "../../Assets/audio/ChopNocNo13.mp3" },
    { id: "citySound", src: "../../Assets/audio/Crickets.mp3" },
    { id: "woodsSound", src: "../../Assets/audio/Forest.mp3" },
    { id: "villageSound", src: "../../Assets/audio/Wind.mp3" },
    { id: "dimensionSound", src: "../../Assets/audio/Ominous.mp3" },
    { id: "beastGrowl", src: "../../Assets/audio/Growl.mp3" },
    { id: "enemyDeathSound", src: "../../Assets/audio/Ping.mp3" },
    { id: "playerDeathSound", src: "../../Assets/audio/Sighing.mp3" }
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
            idle_alt: 21,
            run_alt: { frames: [24, 25, 26, 27, 28, 29, 30, 31], speed: 0.1 },
        }
    };
    var newData1 = {
        "images": [assets.getResult("enemy1")],
        "frames": { width: 64, height: 135 },
        "animations": {
            "idle": { "frames": [0, 1, 2, 3], "speed": 0.2, next: true }
        }
    };
    player_anim = new createjs.SpriteSheet(newData0);
    enemy1_anim = new createjs.SpriteSheet(newData1);
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
        case config.Scene.LEVEL3:
            stage.removeAllChildren();
            currentScene = new scenes.Level3();
            console.log("Starting LEVEL 3 scene");
            break;
        case config.Scene.TUTORIAL:
            stage.removeAllChildren();
            currentScene = new scenes.Tutorial();
            console.log("Starting Tutorial scene");
            break;
        case config.Scene.END:
            stage.removeAllChildren();
            currentScene = new scenes.End();
            console.log("Starting End scene");
            break;
    }
}
//# sourceMappingURL=game.js.map