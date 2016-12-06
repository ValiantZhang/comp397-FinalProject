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
        
        private _menuLabel : createjs.Bitmap;
        private _menuLabel2 : objects.Label;
            
        // Button 
        private _playBtn : objects.Button;
        private _howToPlayBtn : objects.Button;
        
        // Filter
        private _blurFilter : createjs.BlurFilter;
        private _bounds : createjs.Rectangle;
        
        private _player : objects.Player;
        
        // Menu Class Contructor
        constructor() {
            super();
        }

        public start() : void {
            
            // Add bg
            this._bg = new objects.Parallax(assets.getResult("bgBack"));
            this.addChild(this._bg);

            // Add filter
            this._dimensionFilter = new createjs.Bitmap(assets.getResult("filter"));
            this.addChild(this._dimensionFilter);
            
            // Add foreground
            this._fg = new createjs.Bitmap(assets.getResult("bgFront"));
            this.addChild(this._fg);
            
            // Add play button
            this._playBtn = new objects.Button("btnPlay", config.Screen.CENTER_X, config.Screen.CENTER_Y - 20);
            this._playBtn.scaleX = 0.75;
            this._playBtn.scaleY = 0.75;
            this.addChild(this._playBtn);
            this._playBtn.on("click", this._playBtnClick, this);
            
            //Add label
            this._menuLabel = new createjs.Bitmap(assets.getResult("title"));
            this.addChild(this._menuLabel);
            
            
            // Add instructions button
            this._howToPlayBtn = new objects.Button("btnInstruct", config.Screen.CENTER_X, config.Screen.CENTER_Y + 80);
            this._howToPlayBtn.scaleX = 0.75;
            this._howToPlayBtn.scaleY = 0.75;
            this.addChild(this._howToPlayBtn);
            this._howToPlayBtn.on("click", this._howToPlayBtnClick, this);
            
            this._player = new objects.Player(player_anim,"player");
            this._player.x = config.Screen.CENTER_X + 150;
            this._player.y = config.Screen.CENTER_Y + 150;
            this.addChild(this._player);

            // Add menu scene to global stage container
            stage.addChild(this);
            window.onkeydown = this._onKeyDown;
        }

        public update() : void {
            this._bg.update();
        }

        private _playBtnClick(event : createjs.MouseEvent) {
            scene = config.Scene.GAME;
            changeScene();
        }
        
        private _howToPlayBtnClick(event : createjs.MouseEvent) {
            scene = config.Scene.TUTORIAL;
            changeScene();
        }
        
        private _onKeyDown(event: KeyboardEvent) : void {
             switch(event.keyCode) {
                case keys.SPACE:
                    scene = config.Scene.GAME;
                    changeScene();
                    break;
            }
        }
    }
}