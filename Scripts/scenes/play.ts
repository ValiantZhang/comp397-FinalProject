module scenes {
    export class Play extends objects.Scene {

         private _bg : objects.Parallax;
         private _fg : objects.Parallax;
         private _dimensionFilter : createjs.Bitmap;
         private _dimensionFilter2 : createjs.Bitmap;
         private _normalView : boolean;
         private _shifting : boolean;
         private _dimensionTimer : number;
         private _platforms1 : objects.Platform[];

        // private _ground : createjs.Bitmap;
        private _player : objects.Player;

        // private _pipes : objects.Pipe[];
        // private _blocks : objects.Block[];
        // private _qBlocks : objects.qBlock[];
        private _scrollTrigger : number;
        
        private _scrollableObjContainer : createjs.Container;


        constructor() {
            super();
            this.start();
        }

        public start() : void {
            this._platforms1=[];

            // Set scroll trigger
            this._scrollTrigger = 880;
            
            this._normalView = true;
            this._shifting = false;
            
            // Set slow-mo timer for dimension shift
            this._dimensionTimer = 3;

            // Add bg
            this._bg = new objects.Parallax(assets.getResult("bgBack"));
            this._bg.setAutoScroll(false);
            this.addChild(this._bg);

            // Add filters
            this._dimensionFilter = new createjs.Bitmap(assets.getResult("filter"));
            this.addChild(this._dimensionFilter);
            this._dimensionFilter2 = new createjs.Bitmap(assets.getResult("filterAlt"));
            
            // Add foreground
            this._fg = new objects.Parallax(assets.getResult("bgFront"));
            this._fg.setAutoScroll(false);
            this.addChild(this._fg);

            //this._scrollableObjContainer = new createjs.Container();
            this._buildLevel();
            
            
            this._player = new objects.Player(player_anim,"player");
            this._player.position.x = config.Screen.CENTER_X;
            this._player.position.y = config.Screen.CENTER_Y + 150;
            this.addChild(this._player);


            // this._scrollableObjContainer.addChild(this._bg);
            // this._scrollableObjContainer.addChild(this._player);
            // this._scrollableObjContainer.addChild(this._ground);

            // this._ground.y = 535;

            //this.addChild(this._scrollableObjContainer);

            window.onkeydown = this._onKeyDown;
            window.onkeyup = this._onKeyUp;

            stage.addChild(this);
        }

        public update() : void {

            if (controls.SHIFT){
                this._dimensionTimer = 3;
                this._shifting = true;
                this._dimensionShift();
                controls.SHIFT = false;
                this._normalView = this._normalView ? false : true;
                this._shifting = this._normalView ? false : true;
            }
    
            if(!this._shifting || this._dimensionTimer < 0){
                
                this._dimensionTimer = this._dimensionTimer > 0 ? this._dimensionTimer : 3;

                if(controls.LEFT) {
                    controls.RIGHT = false;
                    this._player.moveLeft();
                    if (this._checkScroll()){
                        this._scrollBG(-1);
                        this._player.position.x = this._scrollTrigger / 4;
                    }
                } else if(controls.RIGHT) { 
                    controls.LEFT = false;
                    this._player.moveRight();
                    if (this._checkScroll()){
                        this._scrollBG(1);
                        this._player.position.x = this._scrollTrigger;
                    }
                }
                if(controls.JUMP) {
                    this._player.jump();
                }
    
                if(!controls.RIGHT && !controls.LEFT)
                {
                    this._player.resetAcceleration();
                    this._player.idle();
                }
                
                this._keepAboveGround();
    
                // if(!this._player.getIsGrounded())
                //     this._checkPlayerWithFloor();
    
                // for(let p of this._pipes ) {
                //     if(this.checkCollision(this._player, p)) {
                //         this._player.position.x = p.x - this._player.getBounds().width - 0.01;
                //         this._player.setVelocity(new objects.Vector2(0,0));
                //         this._player.resetAcceleration();
    
                //         this._player.isColliding = true;
                        
                //         console.log(p.name);
                //     }
                //     else {
                //         this._player.isColliding = false;
                //     }
                // }
    
                this._player.update();
            } else {
                this._dimensionTimer -= 1;
            }
        }

        private _onKeyDown(event: KeyboardEvent) : void {
             switch(event.keyCode) {
                case keys.W:
                    console.log("W key pressed");
                    controls.UP = true;
                    break;
                case keys.S:
                    console.log("S key pressed");
                    controls.DOWN = true;
                    break;
                case keys.A:
                    console.log("A key pressed");
                    controls.LEFT = true;
                    break;
                case keys.D:
                    console.log("D key pressed");
                    controls.RIGHT = true;
                    break;
                case keys.SPACE:
                    controls.JUMP = true;
                    break;
            }
        }

        private _onKeyUp(event : KeyboardEvent) : void {
            switch(event.keyCode) {
                case keys.W:
                    controls.UP = false;
                    break;
                case keys.S:
                    controls.DOWN = false;
                    break;
                case keys.A:
                    controls.LEFT = false;
                    break;
                case keys.D:
                    controls.RIGHT = false;
                    break;
                case keys.SPACE:
                    controls.JUMP = false;
                    break;
                case keys.SHIFT:
                    controls.SHIFT = true;
                    break;
            }
        }

        // private _checkPlayerWithFloor() : void {
        //     if(this._player.y+ this._player.getBounds().height > this._ground.y) {
        //         console.log("HIT GROUND");
        //         this._player.position.y = this._ground.y - this._player.getBounds().height;
        //         this._player.setIsGrounded(true);
        //     }
        // }
        
        private _scrollBG(speed : number) : void{
            this._bg.scroll(speed);
            this._fg.scroll(speed * 10);
        }

        private _checkScroll() : boolean {
            if(this._player.position.x > this._scrollTrigger && controls.RIGHT || 
                this._player.position.x < this._scrollTrigger / 4 && controls.LEFT) {
                    
                return true;
            }
            else {
                return false;
            }
        }

        private checkCollision(obj1 : objects.GameObject, obj2 : objects.GameObject) : boolean {

            if(obj2.x < obj1.x + obj1.getBounds().width &&
                obj2.x + obj2.getBounds().width > obj1.x &&
                obj2.y < obj1.y + obj1.getBounds().height &&
                obj2.y + obj2.getBounds().height > obj1.y - 10) {
                return true;
            }

            return false;
        }
        
        private _keepAboveGround() : void{
            if (this._player.position.y > config.Screen.CENTER_Y + 130){
                this._player.position.y = config.Screen.CENTER_Y + 130;
                this._player.setIsGrounded(true);
            }
        }
        
        // Switch dimensions
        private _dimensionShift() : void{
            if (this._normalView){
                this.removeChild(this._dimensionFilter);
                this.addChild(this._dimensionFilter2);
            } else {
                this.removeChild(this._dimensionFilter2);
                this.addChild(this._dimensionFilter);
            }
            this.removeChild(this._player);
            this.addChild(this._player);
            this.removeChild(this._fg);
            this.addChild(this._fg);
        }
        
        private _buildLevel():void{
            
            var platforms1 =[[2,5],[6,4],[10,1],[14,4],[17,6]];
             platforms1.forEach(el => {
                var currentBlock =new objects.Platform(new objects.Vector2(tileSize*el[0]+tileSize/2,tileSize*(el[1]-1)+tileSize/2))
                this._platforms1.push(currentBlock);
                //this._scrollableObjContainer.addChild(currentBlock);                
            });
        }
    }
}