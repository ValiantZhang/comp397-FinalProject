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
         private _spikes1 : objects.Spike[];
         private _movingSpikes1 : objects.Spike[];
         private _enemySpawners : objects.EnemySpawner[];
         
         private _dimensionObjects : objects.DimensionObject[];

        // private _ground : createjs.Bitmap;
        private _player : objects.Player;
        private _enemies : objects.Enemy[];
        
        private _endArea : objects.HugeWall;

        // private _pipes : objects.Pipe[];
        // private _blocks : objects.Block[];
        // private _qBlocks : objects.qBlock[];
        private _scrollTrigger : number;
        private _spawnTime : number;
        private _spawnDelay : number;
        private _currentTick : number;
        private _maxEnemies : number;
        private _enemiesSpawned : number;
        
        private _scrollableObjContainer : createjs.Container;


        constructor() {
            super();
            //this.start();
        }

        public start() : void {
            this._spawnDelay = 5000 - this._getRandomNum();
            this._currentTick = createjs.Ticker.getTime();
            this._spawnTime = this._currentTick + this._spawnDelay;
            this._maxEnemies = 5;
            this._enemiesSpawned = 0;
            // Create an empty array to store platforms and dimension objects
            this._platforms1 = [];
            this._spikes1 = [];
            this._movingSpikes1 = [];
            this._enemies = [];
            this._enemySpawners = [];
            this._dimensionObjects = [];

            // Set scroll trigger
            this._scrollTrigger = 680;
            
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
            
            // Scrollable object container
            this._scrollableObjContainer = new createjs.Container();
            
            this._buildLevel();
            
            // Add foreground
            this._fg = new objects.Parallax(assets.getResult("bgFront"));
            this._fg.setAutoScroll(false);
            this.addChild(this._fg);
            
            this._player = new objects.Player(player_anim,"player");
            this._player.position.x = config.Screen.CENTER_X;
            this._player.position.y = config.Screen.CENTER_Y + 150;
            this.addChild(this._player);

            //this._scrollableObjContainer.addChild(this._bg);
            //this._scrollableObjContainer.addChild(this._player);
            //this._scrollableObjContainer.addChild(this._ground);

            // this._ground.y = 535;
            this._addEnemies(100, 100);
            
            this.addChild(this._scrollableObjContainer);

            this.setChildIndex(this._fg, this.getNumChildren()-1);
            window.onkeydown = this._onKeyDown;
            window.onkeyup = this._onKeyUp;

            stage.addChild(this);
        }

        public update() : void {

            if (controls.SHIFT){
                this._dimensionTimer = 10;
                this._shifting = true;
                this._dimensionShift();
                controls.SHIFT = false;
                this._normalView = this._normalView ? false : true;
                this._shifting = this._normalView ? false : true;
            }

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

            if(!controls.RIGHT && !controls.LEFT) {
                this._player.resetAcceleration();
                this._player.idle();
            }
            
            this._keepAboveGround();
            this._checkPlatformCol();

            this._player.update();
            this._switchLevel();
            
            for(let o of this._dimensionObjects ) {
                o.update();
            }
            
            for(let enemy of this._enemies ) {
                enemy.update();
                
                // if (this._checkCollision(this._player, enemy)){
                //     enemy.endGame();
                // }
            }
            
            for(let spike of this._spikes1 ) {
                if (this._checkCollision(this._player, spike)){
                    spike.endGame();
                }
            }
            for(let spike of this._movingSpikes1 ) {
                if (this._checkCollision(this._player, spike)){
                    spike.endGame();
                }
            }
            
            this._spawnEnemy();
        }

        private _onKeyDown(event: KeyboardEvent) : void {
             switch(event.keyCode) {
                case keys.W:
                    controls.UP = true;
                    break;
                case keys.S:
                    controls.DOWN = true;
                    break;
                case keys.A:
                    controls.RIGHT = false;
                    controls.LEFT = true;
                    break;
                case keys.D:
                    controls.LEFT = false;
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

        private _scrollBG(speed : number) : void{
            if(dimension == config.Dimension.firstDimension){
                this._bg.scroll(speed);
                this._fg.scroll(speed * 10);
                // this._scrollableObjContainer.regX += speed * 10;
                for (var i= 0; i < this._scrollableObjContainer.numChildren; i++) {
                var child = this._scrollableObjContainer.getChildAt(i) as objects.DimensionObject;
                child.position.x -= speed * 10;
            }
                
            } else {
                this._bg.scroll(speed * config.Zone.alternateZone);
                this._fg.scroll(speed * 10 * config.Zone.alternateZone);
                this._player.resetAcceleration();
                // this._scrollableObjContainer.regX += speed * 10 * config.Zone.alternateZone;
                for (var i= 0; i < this._scrollableObjContainer.numChildren; i++) {
                var child = this._scrollableObjContainer.getChildAt(i) as objects.DimensionObject;
                child.position.x -= speed * 10 * config.Zone.alternateZone;
                }
            }
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
                this._player.changeZone(config.Zone.alternateZone);
                this._bg.setSpeed(this._bg.getSpeed() * config.Zone.alternateZone);
                this._fg.setSpeed(this._fg.getSpeed() * config.Zone.alternateZone);
                dimension = config.Dimension.secondDimension;
            } else {
                this.removeChild(this._dimensionFilter2);
                this.addChild(this._dimensionFilter);
                this._player.changeZone(config.Zone.realZone);
                this._bg.setSpeed(this._bg.getSpeed() / config.Zone.alternateZone);
                this._fg.setSpeed(this._fg.getSpeed() / config.Zone.alternateZone);
                dimension = config.Dimension.firstDimension;
            }
            this.removeChild(this._scrollableObjContainer);
            this.addChild(this._scrollableObjContainer);
            this.removeChild(this._player);
            this.addChild(this._player);
            this.removeChild(this._fg);
            this.addChild(this._fg);
            
            // Change dimension of objects
            this._switchDimensionObjects();
        }
        
        // Populate level
        private _buildLevel():void{
            
            var platforms1 =[[10,5],[12,4],[16,4],[18,1],[22,1],[24,2],[26,3],[29.6,4],[34.4,4]];
            platforms1.forEach(el => {
                var currentBlock = new objects.Platform(new objects.Vector2(tileSize*el[0]+tileSize/2,100+tileSize/2*(el[1]-1)+tileSize/2))
                this._platforms1.push(currentBlock);
                this._dimensionObjects.push(currentBlock);
                this._scrollableObjContainer.addChild(currentBlock);                
            });
            
            var spikes1 =[13,15,17,19,20,21,30,31,32,33,34];
            spikes1.forEach(el => {
                var currentBlock =new objects.Spike(tileSize*el+tileSize/2);
                this._spikes1.push(currentBlock);
                this._dimensionObjects.push(currentBlock);
                this._scrollableObjContainer.addChild(currentBlock);                
            });
            
            var movingSpikes1 =[8,39,40,41,43,44,46,48,49,50];
            movingSpikes1.forEach(el => {
                var currentBlock =new objects.Spike(tileSize*el+tileSize/2, true, "b_spike");
                this._movingSpikes1.push(currentBlock);
                this._dimensionObjects.push(currentBlock);
                this._scrollableObjContainer.addChild(currentBlock);                
            });
            
             var enemySpawners =[45,47];
             enemySpawners.forEach(el => {
                 var currentBlock =new objects.EnemySpawner(tileSize*el+tileSize/2);
                 this._enemySpawners.push(currentBlock);
                 this._dimensionObjects.push(currentBlock);
                 this._scrollableObjContainer.addChild(currentBlock);                
             });
            
            
            this._endArea = new objects.HugeWall(new objects.Vector2(3000, 0));
            this._scrollableObjContainer.addChild(this._endArea); 
            
        }
        
        // Populate enemies
        private _addEnemies(x : number, y : number):void{
            var newEnemy = new objects.Enemy(enemy1_anim, this._player.position);
            newEnemy.position.x = x;
            newEnemy.position.y = y;
            this._enemies.push(newEnemy);
            this._scrollableObjContainer.addChild(newEnemy);
        }
        
        private _spawnEnemy(): void {
            if (createjs.Ticker.getTime() >= this._spawnTime && this._enemiesSpawned < this._maxEnemies){
                this._addEnemies(this._player.position.x - 500, this._player.position.y - 500);
                
                this._currentTick = createjs.Ticker.getTime();
                this._spawnTime = this._currentTick + this._spawnDelay;
                this._enemiesSpawned += 1;
            }
        }
        
        private _getRandomNum() {
            return Math.floor(Math.random() * ((200 + 200 - 200) + 200));
        }
        
        // Platform collision detection
        private _checkPlatformCol(){
            // Check if player is colliding with any platforms
            var collisionCount = 0;
            // Loops through each platform
            for(let a of this._platforms1 ) {
                // Check for collision
                if(this._checkCollision(this._player, a)) {
                    collisionCount += 1;
                    
                    // Check if collision is with top of object
                    if (this._checkTopFace(this._player, a)){
                        this._player.setIsGrounded(true);
                    } 
                    // else {
                    //     // Check other faces if not with top
                    //     this._checkOtherFaces(this._player, a);
                    // }
                }
            }
            if (collisionCount == 0 && this._player.y < config.Screen.CENTER_Y + 130){
                this._player.setIsGrounded(false);
            }
        }
        
        // Move to new level
        private _switchLevel() : void {
            if (this._checkCollision(this._player, this._endArea)){
                stage.removeAllChildren();
                scene = config.Scene.LEVEL2;
                changeScene();
            }
        }
        
        // Collision detection
        private _checkCollision(player : objects.Player, obj2 : objects.GameObject) : boolean {
            // Check for intersection
            if( obj2.leftSide < player.rightSide - player.width / 2 &&
                obj2.rightSide > player.leftSide + player.width / 2 &&
                obj2.topSide < player.botSide &&
                obj2.botSide > player.topSide ) {

                return true;
            }
            return false;
        }
        
        // Check if collision happened on top face of object2 and bottom of object1
        private _checkTopFace(player : objects.Player, obj2 : objects.GameObject) : boolean{
            
            if (player.botSide > obj2.topSide - 1 &&
                player.topSide < obj2.topSide - player.height / 8){
                
                // Bump player up to platform if slightly below
                player.position.y = obj2.topSide - player.height / 2 + 1;
                    
                return true;
            }
            return false;
        }
        
        // Check if collision happened on other faces
        private _checkOtherFaces(player : objects.Player, obj2 : objects.GameObject) : void{
            // Check if player is colliding with left side
            if (player.rightSide < obj2.leftSide){
                player.x = obj2.leftSide - player.width / 2;
                player.setVelocity(new objects.Vector2(0, player.getVelocity().y));
                console.log("Left hit");
            // Check if player is colliding with right side
            } else if (player.leftSide > obj2.rightSide){
                player.x = obj2.rightSide + player.width / 2;
                player.setVelocity(new objects.Vector2(0, player.getVelocity().y));
                console.log("Right hit");
            // check if player is colliding with bottom side
            } else if (player.topSide < obj2.botSide - 7){
                player.y = obj2.botSide + player.height / 2;
                player.setVelocity(new objects.Vector2(0, -player.getVelocity().y));
                console.log("Bottom hit");
            }
        }
        
        // Switch dimensional objects
        private _switchDimensionObjects(){
            for(let a of this._dimensionObjects) {
                a.dimensionShift();
            }
        }
    }
}