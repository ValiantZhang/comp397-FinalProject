/*
    Scene module to group all user-defined scenes  under the same "namespace aka module"
    Menu scene that contains all assets and functionality associated with the menu itself
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var scenes;
(function (scenes) {
    var Tutorial = (function (_super) {
        __extends(Tutorial, _super);
        // Menu Class Contructor
        function Tutorial() {
            _super.call(this);
        }
        Tutorial.prototype.start = function () {
            // Add menu scene to global stage container
            stage.addChild(this);
            this._bg = new createjs.Bitmap(assets.getResult("bgTut"));
            this.addChild(this._bg);
            this._playButton = new objects.Button("btnPlay", config.Screen.CENTER_X + 300, config.Screen.CENTER_Y + 50);
            this.addChild(this._playButton);
            this._playButton.on("click", this._playButtonClick, this);
        };
        Tutorial.prototype.update = function () {
        };
        Tutorial.prototype._playButtonClick = function (event) {
            // Change global scene variable to GAME. Call global changeScene() function
            scene = config.Scene.GAME;
            changeScene();
        };
        return Tutorial;
    }(objects.Scene));
    scenes.Tutorial = Tutorial;
})(scenes || (scenes = {}));
//# sourceMappingURL=tutorial.js.map