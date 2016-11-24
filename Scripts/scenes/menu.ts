/*
    Scene module to group all user-defined scenes  under the same "namespace aka module"
    Menu scene that contains all assets and functionality associated with the menu itself
*/

module scenes {
    export class Menu extends objects.Scene {

        // Private instance variables
        // Label or bitmap
        private _bg : objects.Parallax;
        private _dimensionFilter : createjs.Bitmap;
        private _fg : createjs.Bitmap;
        private _fg2 : createjs.Bitmap;
        
        private _menuLabel : objects.Label;
        private _menuLabel2 : objects.Label;
            
        // Button 
        private _playBtn : objects.Button;
        private _howToPlayBtn : objects.Button;
        
        // Filter
        private _blurFilter : createjs.BlurFilter;
        private _bounds : createjs.Rectangle;
        
        // Menu Class Contructor
        constructor() {
            super();
        }

        public start() : void {
            // Add bg
            this._bg = new objects.Parallax(assets.getResult("bgBack"));
            //this._bg.regX = 0;
            this.addChild(this._bg);
            // this._bg2 = new createjs.Bitmap(assets.getResult("BG"));
            // this._bg2.regX = 0;
            // this._bg2.x = 1590;
            // this.addChild(this._bg2);
            
            // Add blur filter
            // this._blurFilter = new createjs.BlurFilter(5, 5, 4);
            // this._bg.filters = [this._blurFilter];
            // this._bounds = this._bg.getBounds();
            // this._bg.cache(this._bounds.x, this._bounds.y, this._bounds.width, this._bounds.height);
            // this._bg2.filters = [this._blurFilter];
            // this._bounds = this._bg2.getBounds();
            // this._bg2.cache(this._bounds.x, this._bounds.y, this._bounds.width, this._bounds.height);

            // // Add menu label
            // this._menuLabel = new objects.Label("Pipe Runner", "76px Impact", "#487FFF", config.Screen.CENTER_X, config.Screen.CENTER_Y - 150);
            // this.addChild(this._menuLabel);
            // // Add menu label2
            // this._menuLabel2 = new objects.Label("Runner of Pipes", "32px Impact", "#88AFFF", config.Screen.CENTER_X, config.Screen.CENTER_Y - 90);
            // this.addChild(this._menuLabel2);
            
            // // Add play button
            // this._playBtn = new objects.Button("Play", config.Screen.CENTER_X + 200, config.Screen.CENTER_Y + 200);
            // this._playBtn.scaleX = 0.5;
            // this._playBtn.scaleY = 0.5;
            // this._playBtn.cursor = "pointer";
            // this.addChild(this._playBtn);
            // this._playBtn.on("click", this._playBtnClick, this);
            
            // // Add instructions button
            // this._howToPlayBtn = new objects.Button("HowToPlay", config.Screen.CENTER_X - 200, config.Screen.CENTER_Y + 200);
            // this._howToPlayBtn.scaleX = 0.5;
            // this._howToPlayBtn.scaleY = 0.5;
            // this._howToPlayBtn.cursor = "pointer";
            // this.addChild(this._howToPlayBtn);
            // this._howToPlayBtn.on("click", this._howToPlayBtnClick, this);

            // Add menu scene to global stage container
            stage.addChild(this);
        }

        public update() : void {
            this._bg.update();
        }

        private _playBtnClick(event : createjs.MouseEvent) {
            scene = config.Scene.GAME;
            changeScene();
        }
        
        private _howToPlayBtnClick(event : createjs.MouseEvent) {
            //scene = config.Scene.INSTRUCTIONS;
            changeScene();
        }
    }
}