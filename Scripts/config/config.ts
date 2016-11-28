/*
    Module to store globally accessible values and states for the game.
*/
module config {
    export class Scene {
        public static MENU : number = 0;
        public static GAME : number = 1;
    }

    export class Screen {
        public static WIDTH : number = 800;
        public static HEIGHT : number = 640;
        public static CENTER_X : number = 400;
        public static CENTER_Y : number = 320;
    }
    
    export class Game {
        public static FPS : number = 60;
    }

    export class PipeSize {
        public static SMALL : string = "pipe1";
        public static MEDIUM : string = "pipe2";
        public static LARGE : string = "pipe3";
    }

    export class MarioState {
        public static SMALL : number = 0;
        public static BIG : number = 1;
        public static FLOWER : number = 2;
    }
}