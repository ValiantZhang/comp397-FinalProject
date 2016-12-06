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
        Scene.LEVEL2 = 2;
        Scene.LEVEL3 = 3;
        Scene.TUTORIAL = 4;
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
    var Zone = (function () {
        function Zone() {
        }
        Zone.realZone = 1;
        Zone.alternateZone = 0.05;
        return Zone;
    }());
    config.Zone = Zone;
    var Dimension = (function () {
        function Dimension() {
        }
        Dimension.firstDimension = 0;
        Dimension.secondDimension = 1;
        return Dimension;
    }());
    config.Dimension = Dimension;
})(config || (config = {}));
//# sourceMappingURL=config.js.map