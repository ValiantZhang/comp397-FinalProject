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
        
        private _menuLabel : createjs.Bitmap;
        private _nextLvlSign : createjs.Bitmap;
            
        // Button 
        private _playBtn : objects.Button;
        private _howToPlayBtn : objects.Button;
        
        // Filter
        private _blurFilter : createjs.BlurFilter;
        private _bounds : createjs.Rectangle;
        
        private _player : objects.Player;
        private _deathFilter : createjs.Bitmap;
        private _deathFilterCounter : number;
        
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
            
            // City sign
            this._nextLvlSign = new createjs.Bitmap(assets.getResult("signCity"));
            this._nextLvlSign.y = 350;
            this._nextLvlSign.x = 920;
            this.addChild(this._nextLvlSign);
            
            // Add foreground
            this._fg = new createjs.Bitmap(assets.getResult("bgFront"));
            this.addChild(this._fg);
            this._fg2 = new createjs.Bitmap(assets.getResult("blackBox"));
            this._fg2.y = 497;
            this.addChild(this._fg2);
            
            // Add play button
            this._playBtn = new objects.Button("btnPlay", config.Screen.CENTER_X, config.Screen.CENTER_Y - 20);
            this._playBtn.scaleX = 0.75;
            this._playBtn.scaleY = 0.75;
            this.addChild(this._playBtn);
            this._playBtn.on("click", this._playBtnClick, this);
            
            //Add label
            this._menuLabel = new createjs.Bitmap(assets.getResult("title"));
            this._menuLabel.regX = this._menuLabel.getBounds().width / 2;
            this._menuLabel.x = config.Screen.CENTER_X;
            this.addChild(this._menuLabel);
            
            
            // Add instructions button
            this._howToPlayBtn = new objects.Button("btnInstruct", config.Screen.CENTER_X, config.Screen.CENTER_Y + 80);
            this._howToPlayBtn.scaleX = 0.75;
            this._howToPlayBtn.scaleY = 0.75;
            this.addChild(this._howToPlayBtn);
            this._howToPlayBtn.on("click", this._howToPlayBtnClick, this);
            
            this._player = new objects.Player(player_anim,"player");
            this._player.x = config.Screen.CENTER_X + 180;
            this._player.y = config.Screen.CENTER_Y + 130;
            this.addChild(this._player);
            
            // Add filter
            this._deathFilter = new createjs.Bitmap(assets.getResult("deathFilter"));
            this._deathFilterCounter = 1.0;
            
            if (config.Game.PLAYED){
                this.addChild(this._deathFilter);
            }

            // Add menu scene to global stage container
            stage.addChild(this);
            window.onkeydown = this._onKeyDown;
            createjs.Sound.stop();
            createjs.Sound.play("menuSong",{loop: -1});
            createjs.Sound.volume = 0.2;
        }

        public update() : void {
            this._bg.update();
            if (this._deathFilterCounter > 0 && config.Game.PLAYED){
                this._deathFilterCounter -= 0.01;
                this._deathFilter.set({alpha:this._deathFilterCounter});
            }
        }

        private _playBtnClick(event : createjs.MouseEvent) {
            config.Game.PLAYED = true;
            scene = config.Scene.GAME;
            // Set dimension
            dimension = config.Dimension.firstDimension;
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