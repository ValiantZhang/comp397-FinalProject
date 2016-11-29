/*
    Module to store globally accessible values and states for the game.
*/
var config;
(function (config) {
    var Scene = (function () {
        function Scene() {
        }
        Scene.MENU = 0;
        Scene.GAME = 1;
        return Scene;
    }());
    config.Scene = Scene;
    var Screen = (function () {
        function Screen() {
        }
        Screen.WIDTH = 1100;
        Screen.HEIGHT = 640;
        Screen.CENTER_X = 550;
        Screen.CENTER_Y = 320;
        return Screen;
    }());
    config.Screen = Screen;
    var Game = (function () {
        function Game() {
        }
        Game.FPS = 60;
        return Game;
    }());
    config.Game = Game;
})(config || (config = {}));
//# sourceMappingURL=config.js.map