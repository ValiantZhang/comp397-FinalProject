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
        Screen.WIDTH = 800;
        Screen.HEIGHT = 640;
        Screen.CENTER_X = 400;
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
    var PipeSize = (function () {
        function PipeSize() {
        }
        PipeSize.SMALL = "pipe1";
        PipeSize.MEDIUM = "pipe2";
        PipeSize.LARGE = "pipe3";
        return PipeSize;
    }());
    config.PipeSize = PipeSize;
    var MarioState = (function () {
        function MarioState() {
        }
        MarioState.SMALL = 0;
        MarioState.BIG = 1;
        MarioState.FLOWER = 2;
        return MarioState;
    }());
    config.MarioState = MarioState;
})(config || (config = {}));
//# sourceMappingURL=config.js.map