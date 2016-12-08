/*
    Module to store globally accessible values and states for the game.
*/
module config {
    export class Scene {
        public static MENU : number = 0;
        public static GAME : number = 1;
        public static LEVEL2 : number = 2;
        public static LEVEL3 : number = 3;
        public static TUTORIAL : number = 4;
    }

    export class Screen {
        public static WIDTH : number = 1100;
        public static HEIGHT : number = 640;
        public static CENTER_X : number = 550;
        public static CENTER_Y : number = 320;
    }
    
    export class Game {
        public static FPS : number = 60;
    }
    
    export class Zone {
        public static realZone : number = 1;
        public static alternateZone : number = 0.5;
    }
    
    export class Dimension {
        public static firstDimension : number = 0;
        public static secondDimension : number = 1;
    }

    
}