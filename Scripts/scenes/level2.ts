module scenes {
    export class Level2 extends objects.Scene {

        private _bg : objects.Parallax;
        private _fg : objects.Parallax;
        private _fg2 : createjs.Bitmap;
        private _dimensionFilter : createjs.Bitmap;
        private _dimensionFilter2 : createjs.Bitmap;
        private _normalView : boolean;
        private _shifting : boolean;
        private _dimensionTimer : number;
        private _nextLvlSign : createjs.Bitmap;
        private _platforms1 : objects.Platform[];
        private _spikes1 : objects.Spike[];
        private _movingSpikes1 : objects.Spike[];
        private _enemyObstacles : objects.EnemyObstacle[];
        private _invVerticalMovePlat : objects.InvPlatform[];
        private _enemySpawners : objects.EnemySpawner[];
        private _dimensionObjects : objects.DimensionObject[];
        private _player : objects.Player;
        private _enemies : objects.Enemy[];
        private _endArea : objects.HugeWall;
        private _shortcut : objects.HugeWall;
        private _scrollTrigger : number;
        private _spawnTime : number;
        private _spawnDelay : number;
        private _currentTick : number;
        private _maxEnemies : number;
        private _enemiesSpawned : number;
        private _scrollableObjContainer : createjs.Container;
        private _levelLabel : objects.Label;
        private _levelString : string;
        private _timerLabel : objects.Label;
        private _timeStamp : number;
        private _prevScore : number;


        constructor() {
            super();
            //this.start();
        }

        public start() : void {
            this._prevScore = globalScore;
            this._timeStamp = new Date().getTime();
            levelScore = 0;
            
            // Set level label
            this._levelString = "The Woods";
            this._levelLabel = new objects.Label(this._levelString, "28px Consolas", "#999",  
                               config.Screen.CENTER_X, 550);
            this.addChild(this._levelLabel);
            
            this._timerLabel = new objects.Label(Math.abs(globalScore / 1000).toFixed(2), "24px Consolas", "#0F0",  
                               config.Screen.CENTER_X, 600);
            this.addChild(this._timerLabel);
            
            // Set dimension
            dimension = config.Dimension.firstDimension;
            
            this._spawnDelay = 3000 - this._getRandomNum();
            this._currentTick = 0;
            this._currentTick = createjs.Ticker.getTime();
            this._spawnTime = this._currentTick + this._spawnDelay;
            this._maxEnemies = 5;
            this._enemiesSpawned = 0;
            // Create an empty array to store platforms and dimension objects
            this._platforms1 = [];
            this._spikes1 = [];
            this._movingSpikes1 = [];
            this._enemyObstacles = [];
            this._invVerticalMovePlat = [];
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
            this._bg = new objects.Parallax(assets.getResult("bgBack2"));
            this._bg.setAutoScroll(false);
            this.addChild(this._bg);

            // Add filters
            this._dimensionFilter = new createjs.Bitmap(assets.getResult("filterLvl2"));
            this.addChild(this._dimensionFilter);
            this._dimensionFilter2 = new createjs.Bitmap(assets.getResult("filterAlt"));
            
            // Add foreground
            this._fg = new objects.Parallax(assets.getResult("bgFront"));
            this._fg.setAutoScroll(false);
            this.addChild(this._fg);
            this._fg2 = new createjs.Bitmap(assets.getResult("blackBox"));
            this._fg2.y = 497;
            this.addChild(this._fg2);
            
            // Scrollable object container
            this._scrollableObjContainer = new createjs.Container();

            this._buildLevel();
            
            this._player = new objects.Player(player_anim,"player");
            this._player.position.x = config.Screen.CENTER_X;
            this._player.position.y = config.Screen.CENTER_Y + 150;
            this.addChild(this._player);

            this.addChild(this._scrollableObjContainer);

            this.setChildIndex(this._fg, this.getNumChildren()-1);
            this.setChildIndex(this._levelLabel, this.getNumChildren()-1);
            this.setChildIndex(this._timerLabel, this.getNumChildren()-1);
            window.onkeydown = this._onKeyDown;
            window.onkeyup = this._onKeyUp;

            stage.addChild(this);
            
            createjs.Sound.stop();
            var ambientSound = createjs.Sound.play("woodsSound",{loop: -1});
            ambientSound.play();
            ambientSound.volume = 0.2;
        }

        public update() : void {
            // Player controls
            {
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
                // Check if enemies are dead and call cleanup
                if (!enemy.isAlive){
                    var index = this._enemies.indexOf(enemy);
                    this._enemies.splice(index, 1);
                }
                
                // Check collision with player
                if (this._checkCollision(this._player, enemy)){
                    enemy.endGame();
                }
            }
            
            for(let spike of this._spikes1 ) {
                if (this._checkDimensionCollision(this._player, spike)){
                    spike.endGame();
                }
            }
            for(let mspike of this._movingSpikes1 ) {
                if (this._checkDimensionCollision(this._player, mspike)){
                    mspike.endGame();
                }
            }
            for(let eo of this._enemyObstacles ) {
                eo.update();
                if (this._checkCollision(this._player, eo)){
                    eo.endGame();
                } 
                    if (this._player.position.x > eo.position.x - 150 && !eo.hasAttacked) {
                    eo.attack();
                }
            }
            
            this._spawnEnemy();
            this._updateScore();
        }

        // Key down events
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

        // Key up events
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

        // Scroll elements
        private _scrollBG(speed : number) : void{
            if(dimension == config.Dimension.firstDimension){
                this._bg.scroll(speed);
                this._fg.scroll(speed * 10);
                for (var i= 0; i < this._scrollableObjContainer.numChildren; i++) {
                    var child = this._scrollableObjContainer.getChildAt(i) as objects.DimensionObject;
                    child.position.x -= speed * 10;
                }
                // Scroll end of level sign
                this._nextLvlSign.x -= speed * 10;
            } else {
                this._bg.scroll(speed * config.Zone.alternateZone);
                this._fg.scroll(speed * 10 * config.Zone.alternateZone);
                this._player.resetAcceleration();
                for (var i= 0; i < this._scrollableObjContainer.numChildren; i++) {
                    var child = this._scrollableObjContainer.getChildAt(i) as objects.DimensionObject;
                    child.position.x -= speed * 10 * config.Zone.alternateZone;
                }
                // Scroll end of level sign
                this._nextLvlSign.x -= speed * 10 * config.Zone.alternateZone;
            }
        }

        // Check bounds if need to scroll
        private _checkScroll() : boolean {
            if(this._player.position.x > this._scrollTrigger && controls.RIGHT || 
                this._player.position.x < this._scrollTrigger / 4 && controls.LEFT) {
                    
                return true;
            }
            else {
                return false;
            }
        }
        
        // Keep player above ground
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
            this.removeChild(this._nextLvlSign);
            this.addChild(this._nextLvlSign);
            this.removeChild(this._player);
            this.addChild(this._player);
            this.removeChild(this._fg);
            this.addChild(this._fg);
            this.removeChild(this._fg2);
            this.addChild(this._fg2);
            this.removeChild(this._levelLabel);
            this.addChild(this._levelLabel);
            this.removeChild(this._timerLabel);
            this.addChild(this._timerLabel);
            
            // Change dimension of objects
            this._switchDimensionObjects();
        }
        
        // Populate level
        private _buildLevel():void{
            
            // Dimension 1
            var platforms1 =[[7.4,6],[8.7,5.5],[10,5],[12.5,0],[18,5],[20,4],[22,2], [28,5.5], [30,4], [34, 0], [33,6], [33.5,5.5], [34,5],[34.5,5.5], [35,5], [35.5,5.5], [36,6], [38,1], [38.5,1.5], [41,2.5], [41.5,2], [54, 2], [65, 2], [67, 2], [69, 4], [71, 4], [76,3.5]];
            platforms1.forEach(el => {
                var currentBlock = new objects.Platform("platformVines", new objects.Vector2(tileSize*el[0]+tileSize/2,100+tileSize/2*(el[1]-1)+tileSize/2))
                this._platforms1.push(currentBlock);
                this._dimensionObjects.push(currentBlock);
                this._scrollableObjContainer.addChild(currentBlock);                
            });
            
            // Dimension Two
            var platforms2 =[[14,2], [25,0], [44, 1.5], [43.5, 4.5], [45, 4.5], [64, 3], [66, 1], [68, 3], [70, 1.5], [73.5, 4]];
            platforms2.forEach(el => {
                var currentBlock = new objects.Platform("platformVines",new objects.Vector2(tileSize*el[0]+tileSize/2,100+tileSize/2*(el[1]-1)+tileSize/2), 
                                   config.Dimension.secondDimension);
                                   
                this._platforms1.push(currentBlock);
                this._dimensionObjects.push(currentBlock);
                this._scrollableObjContainer.addChild(currentBlock);                
            });
            
            var enemyObstacles1 =[[12,6.5], [34.5,6.5], [41,7.5], [44,1.5], [66,6.5], [68,9], [70,1.5], [73.5, 4], [79, 8]];
            enemyObstacles1.forEach(el => {
                var currentBlock = new objects.EnemyObstacle(new objects.Vector2(tileSize*el[0]+tileSize/2,100+tileSize/2*(el[1]-1)+tileSize/2))
                this._enemyObstacles.push(currentBlock);
                this._dimensionObjects.push(currentBlock);
                this._scrollableObjContainer.addChild(currentBlock);                
            });
            
            var invVerticalMovePlat =[[27,3], [49, 3], [54, 1]];
            invVerticalMovePlat.forEach(el => {
                var currentBlock = new objects.InvPlatform("platform1_3_alt", new objects.Vector2(tileSize*el[0]+tileSize/2,100+tileSize/2*(el[1]-1)+tileSize/2), true, "horizontal", 4)
                this._invVerticalMovePlat.push(currentBlock);
                this._dimensionObjects.push(currentBlock);
                this._scrollableObjContainer.addChild(currentBlock);                
            });
            
            
            var spikes1 =[ 23, 24, 25, 26.5, 45, 51, 55, 59.5, 61, 65];
            spikes1.forEach(el => {
                var currentBlock =new objects.Spike(tileSize*el+tileSize/2, false, 
                                  "spike", config.Dimension.dualDimension);
                this._spikes1.push(currentBlock);
                this._dimensionObjects.push(currentBlock);
                this._scrollableObjContainer.addChild(currentBlock);                
            });
            
            var movingSpikes1 =[14, 15, 16, 28, 46, 47, 48, 49, 50, 52, 53, 54, 56, 58, 63, 64];
            movingSpikes1.forEach(el => {
                var currentBlock =new objects.Spike(tileSize*el+tileSize/2, true, "b_spike");
                this._movingSpikes1.push(currentBlock);
                this._dimensionObjects.push(currentBlock);
                this._scrollableObjContainer.addChild(currentBlock);                
            });
            
            // End of level
            this._nextLvlSign = new createjs.Bitmap(assets.getResult("signVillage"));
            this._nextLvlSign.y = 350;
            this._nextLvlSign.x = 10000;
            this.addChild(this._nextLvlSign);
            this._shortcut = new objects.HugeWall(new objects.Vector2(-500, config.Screen.CENTER_Y));
            this._endArea = new objects.HugeWall(new objects.Vector2(11000, config.Screen.CENTER_Y));
            this._scrollableObjContainer.addChild(this._endArea);
            this._scrollableObjContainer.addChild(this._shortcut);
            
        }
        
        // Populate enemies
        private _addEnemies(x : number, y : number):void{
            var newEnemy = new objects.Enemy(enemy1_anim, this._player.position);
            newEnemy.position.x = x;
            newEnemy.position.y = y;
            this._enemies.push(newEnemy);
            this._scrollableObjContainer.addChild(newEnemy);
        }
        
        // Spawn Enemy
        private _spawnEnemy(): void {
            if (createjs.Ticker.getTime() >= this._spawnTime){  
                // Generate enemy on left edge
                this._addEnemies(0, 0);
                
                this._currentTick = createjs.Ticker.getTime();
                this._spawnTime = this._currentTick + this._spawnDelay;
                this._enemiesSpawned += 1;
            }
        }
        
        // Random number
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
                if(this._checkDimensionCollision(this._player, a)) {
                    collisionCount += 1;
                    
                    // Check if collision is with top of object
                    if (this._checkTopFace(this._player, a)){
                        this._player.setIsGrounded(true);
                    } 
                }
            }
            if (collisionCount == 0 && this._player.y < config.Screen.CENTER_Y + 130){
                this._player.setIsGrounded(false);
            }
            
            if (dimension == config.Dimension.secondDimension){
                for(let a of this._invVerticalMovePlat ) {
                // Check for collision
                if(this._checkCollision(this._player, a)) {
                    collisionCount += 1;
                    
                    // Check if collision is with top of object
                    if (this._checkTopFace(this._player, a)){
                        this._player.setIsGrounded(true);
                    } 
                }
            }
            }
        }
        
        // Move to new level
        private _switchLevel() : void {
            if (this._checkCollision(this._player, this._shortcut)){
                stage.removeAllChildren();
                scene = config.Scene.LEVEL3;
                changeScene();
            }
            
            if (this._checkCollision(this._player, this._endArea)){
                level2HS = Math.abs(levelScore / 1000);;
                
                stage.removeAllChildren();
                scene = config.Scene.LEVEL3;
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
        
        // Collision detection for multi dimension objects
        private _checkDimensionCollision(player : objects.Player, obj2 : objects.DimensionObject) : boolean {
            // Check for intersection
            if( obj2.leftSide < player.rightSide - player.width / 2 &&
                obj2.rightSide > player.leftSide + player.width / 2 &&
                obj2.topSide < player.botSide &&
                obj2.botSide > player.topSide &&
                (obj2.physicalDimension == dimension ||
                 obj2.physicalDimension == config.Dimension.dualDimension) ) {

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
        
        private _updateScore():void{
            globalScore = this._prevScore + this._timeStamp - new Date().getTime();
            levelScore = this._timeStamp - new Date().getTime();
            this._timerLabel.text = Math.abs(globalScore / 1000).toFixed(2);
        }
        
    }
}