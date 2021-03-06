module scenes {
    export class End extends objects.Scene {

        private _bg : objects.Parallax;
        private _fg : objects.Parallax;
        private _fg2 : createjs.Bitmap;
        private _dimensionFilter : createjs.Bitmap;
        private _dimensionFilter2 : createjs.Bitmap;
        private _normalView : boolean;
        private _shifting : boolean;
        private _dimensionTimer : number;
        private _babyAtEnd : createjs.Bitmap;
        private _platforms1 : objects.Platform[];
        private _spikes1 : objects.Spike[];
        private _movingSpikes1 : objects.Spike[];
        private _enemySpawners : objects.EnemySpawner[];
        private _dimensionObjects : objects.DimensionObject[];
        private _player : objects.Player;
        private _enemies : objects.Enemy[];
        private _endArea : objects.HugeWall;
        private _shortcut : objects.HugeWall;
        private _moreEnemiesTrigger : objects.HugeWall;
        private _showArea1 : objects.HugeWall;
        private _showArea2 : objects.HugeWall;
        private _showArea3 : objects.HugeWall;
        private _showHighScore : objects.HugeWall;
        private _showThanks : objects.HugeWall;
        private _scrollTrigger : number;
        private _spawnFaster : boolean;
        private _spawnTime : number;
        private _spawnDelay : number;
        private _currentTick : number;
        private _maxEnemies : number;
        private _enemiesSpawned : number;
        private _scrollableObjContainer : createjs.Container;
        private _levelLabel : objects.Label;
        private _levelString : string;
        private _showLabel : objects.Label;


        constructor() {
            super();
            //this.start();
        }

        public start() : void {
            // Initialize level values
            {
            // Set level label
            this._levelString = "The End";
            this._levelLabel = new objects.Label(this._levelString, "28px Consolas", "#999",  
                               config.Screen.CENTER_X, 550);
            this.addChild(this._levelLabel);
                
            this._showLabel = new objects.Label(" ", "20px Consolas", "#0F0",  
                               config.Screen.CENTER_X - 150, 600);
            this.addChild(this._showLabel);    
            // Set dimension
            dimension = config.Dimension.firstDimension;
            
            this._spawnDelay = 3000 - this._getRandomNum();
            this._currentTick = 0;
            this._currentTick = createjs.Ticker.getTime();
            this._spawnTime = this._currentTick + this._spawnDelay;
            this._maxEnemies = 15;
            this._enemiesSpawned = 0;
            this._spawnFaster = false;
            // Create an empty array to store platforms and dimension objects
            this._platforms1 = [];
            this._spikes1 = [];
            this._movingSpikes1 = [];
            this._enemies = [];
            this._enemySpawners = [];
            this._dimensionObjects = [];

            // Set scroll trigger
            this._scrollTrigger = 400;
            
            this._normalView = true;
            this._shifting = false;
            
            // Set slow-mo timer for dimension shift
            this._dimensionTimer = 3;
            }

            // Add GameObjects to the scene
            {
            // Add bg
            this._bg = new objects.Parallax(assets.getResult("bgBack3"));
            this._bg.setAutoScroll(false);
            this.addChild(this._bg);

            // Add filters
            this._dimensionFilter = new createjs.Bitmap(assets.getResult("filterLvl3"));
            this.addChild(this._dimensionFilter);
            this._dimensionFilter2 = new createjs.Bitmap(assets.getResult("filterAlt"));
            
            // Scrollable object container
            this._scrollableObjContainer = new createjs.Container();
            
            this._buildLevel();
            
            // Add foreground
            this._fg = new objects.Parallax(assets.getResult("bgFront"));
            this._fg.setAutoScroll(false);
            this.addChild(this._fg);
            this._fg2 = new createjs.Bitmap(assets.getResult("blackBox"));
            this._fg2.y = 497;
            this.addChild(this._fg2);
            
            this._player = new objects.Player(player_anim,"player");
            this._player.position.x = config.Screen.CENTER_X;
            this._player.position.y = config.Screen.CENTER_Y + 150;
            this.addChild(this._player);
            
            this.addChild(this._scrollableObjContainer);
            }

            // Force child index on foreground
            this.setChildIndex(this._fg, this.getNumChildren()-1);
            this.setChildIndex(this._levelLabel, this.getNumChildren()-1);
            this.setChildIndex(this._showLabel, this.getNumChildren()-1);
            
            // Bind keys
            window.onkeydown = this._onKeyDown;
            window.onkeyup = this._onKeyUp;

            stage.addChild(this);
            
            createjs.Sound.stop();
            // var ambientSound = createjs.Sound.play("villageSound",{loop: -1});
            // ambientSound.play();
            // ambientSound.volume = 0.2;
        }

        public update() : void {

            // Player Controls
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
            
            // Player collision
            this._keepAboveGround();
            this._checkPlatformCol();

            // Game Object Updates
            {
            this._player.update();
            this._switchLevel();
            
            for(let o of this._dimensionObjects ) {
                o.update();
            }
            // for(let enemy of this._enemies ) {
            //     enemy.update();
            //     // Check if enemies are dead and call cleanup
            //     if (!enemy.isAlive){
            //         var index = this._enemies.indexOf(enemy);
            //         this._enemies.splice(index, 1);
            //     }
                
            //     // Check collision with player
            //     if (this._checkCollision(this._player, enemy)){
            //         enemy.endGame();
            //     }
            // }
            // for(let spike of this._spikes1 ) {
            //     if (this._checkDimensionCollision(this._player, spike)){
            //         spike.endGame();
            //     }
            // }
            // for(let spike of this._movingSpikes1 ) {
            //     if (this._checkDimensionCollision(this._player, spike)){
            //         spike.endGame();
            //     }
            // }
            }
            
            // this._spawnEnemy();
            
            this._presentScores();
        }

        // Keydown events
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

        // Keyup events
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

        // Move scrollable elements
        private _scrollBG(speed : number) : void{
            if(dimension == config.Dimension.firstDimension){
                this._bg.scroll(speed);
                this._fg.scroll(speed * 10);
                for (var i= 0; i < this._scrollableObjContainer.numChildren; i++) {
                    var child = this._scrollableObjContainer.getChildAt(i) as objects.DimensionObject;
                    child.position.x -= speed * 10;
                }
                // Scroll end of level sign
                this._babyAtEnd.x -= speed * 10;
            } else {
                this._bg.scroll(speed * config.Zone.alternateZone);
                this._fg.scroll(speed * 10 * config.Zone.alternateZone);
                this._player.resetAcceleration();
                for (var i= 0; i < this._scrollableObjContainer.numChildren; i++) {
                    var child = this._scrollableObjContainer.getChildAt(i) as objects.DimensionObject;
                    child.position.x -= speed * 10 * config.Zone.alternateZone;
                }
                // Scroll end of level sign
                this._babyAtEnd.x -= speed * 10 * config.Zone.alternateZone;
            }
        }

        // Check if player is at scroll counds
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
                controls.JUMP = false;
                dimension = config.Dimension.firstDimension;
            }
            this.removeChild(this._scrollableObjContainer);
            this.addChild(this._scrollableObjContainer);
            this.removeChild(this._babyAtEnd);
            this.addChild(this._babyAtEnd);
            this.removeChild(this._player);
            this.addChild(this._player);
            this.removeChild(this._fg);
            this.addChild(this._fg);
            this.removeChild(this._fg2);
            this.addChild(this._fg2);
            this.removeChild(this._levelLabel);
            this.addChild(this._levelLabel);
            this.removeChild(this._showLabel);
            this.addChild(this._showLabel);
            
            // Change dimension of objects
            this._switchDimensionObjects();
        }
        
        // Populate level
        private _buildLevel():void{
            
            // Dimension One
            var platforms1 =[[55,5]];
            platforms1.forEach(el => {
                var currentBlock = new objects.Platform("platformWood",new objects.Vector2(tileSize*el[0]+tileSize/2,100+tileSize/2*(el[1]-1)+tileSize/2));
                this._platforms1.push(currentBlock);
                this._dimensionObjects.push(currentBlock);
                this._scrollableObjContainer.addChild(currentBlock);                
            });
            
            // Dimension Two
            // var platforms2 =[[11,1], [12.6,1], [14.2,1], [20,5], [29,4], [35,4], [40,4], [42,5], [44,6], [48,4], [52,2], [56,2], [60,4]];
            // platforms2.forEach(el => {
            //     var currentBlock = new objects.Platform("platformWood",new objects.Vector2(tileSize*el[0]+tileSize/2,100+tileSize/2*(el[1]-1)+tileSize/2), 
            //                       config.Dimension.secondDimension);
                                   
            //     this._platforms1.push(currentBlock);
            //     this._dimensionObjects.push(currentBlock);
            //     this._scrollableObjContainer.addChild(currentBlock);                
            // });
            
            // Dual Dimension
            // var spikes1 =[11,12.3,13.6,14.9,16.2,17.3,18.6];
            // spikes1.forEach(el => {
            //     var currentBlock =new objects.Spike(tileSize*el+tileSize/2, false, 
            //                       "b_spike", config.Dimension.dualDimension);
            //     this._spikes1.push(currentBlock);
            //     this._dimensionObjects.push(currentBlock);
            //     this._scrollableObjContainer.addChild(currentBlock);                
            // });
            
            // var movingSpikes1 =[20, 21.3, 22.6, 23.9, 25.2, 26.5, 27.8, 29.1, 30.4, 31.7, 33, 34.3, 35.6, 
            //                     36.9, 38.2, 39.5, 40.8, 42.1, 43.4, 44.7, 46, 47.3, 48.6, 49.9, 51.2, 52.5, 
            //                     53.8, 55.1, 56.4, 57.7, 59, 60.3];
            // movingSpikes1.forEach(el => {
            //     var currentBlock =new objects.Spike(tileSize*el+tileSize/2, true, 
            //                       "b_spike", config.Dimension.dualDimension);
                                    
            //     this._movingSpikes1.push(currentBlock);
            //     this._dimensionObjects.push(currentBlock);
            //     this._scrollableObjContainer.addChild(currentBlock);                
            // });
            
            // Faster spawn trigger
            // this._moreEnemiesTrigger = new objects.HugeWall(new objects.Vector2(5000, config.Screen.CENTER_Y));
            // this._scrollableObjContainer.addChild(this._moreEnemiesTrigger);
            
            // End of level
            this._babyAtEnd = new createjs.Bitmap(assets.getResult("baby"));
            this._babyAtEnd.y = 290;
            this._babyAtEnd.x = 7100;
            this.addChild(this._babyAtEnd);
            
            this._shortcut = new objects.HugeWall(new objects.Vector2(-100, config.Screen.CENTER_Y));
            this._endArea = new objects.HugeWall(new objects.Vector2(7000, config.Screen.CENTER_Y));
            this._showArea1 = new objects.HugeWall(new objects.Vector2(1000, config.Screen.CENTER_Y));
            this._showArea2 = new objects.HugeWall(new objects.Vector2(2000, config.Screen.CENTER_Y));
            this._showArea3 = new objects.HugeWall(new objects.Vector2(3000, config.Screen.CENTER_Y));
            this._showHighScore = new objects.HugeWall(new objects.Vector2(4000, config.Screen.CENTER_Y));
            this._showThanks = new objects.HugeWall(new objects.Vector2(5000, config.Screen.CENTER_Y));
            
            this._scrollableObjContainer.addChild(this._endArea);
            this._scrollableObjContainer.addChild(this._shortcut);
            this._scrollableObjContainer.addChild(this._showArea1);
            this._scrollableObjContainer.addChild(this._showArea2);
            this._scrollableObjContainer.addChild(this._showArea3);
            this._scrollableObjContainer.addChild(this._showHighScore);
            this._scrollableObjContainer.addChild(this._showThanks);
            
        }
        
        // Populate enemies
        private _addEnemies(x : number, y : number):void{
            var newEnemy = new objects.Enemy(enemy1_anim, this._player.position);
            newEnemy.position.x = x;
            newEnemy.position.y = y;
            this._scrollableObjContainer.addChild(newEnemy);
            this._enemies.push(newEnemy);
        }
        
        // Spawn enemies
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
        }
        
        // Move to new level
        private _switchLevel() : void {
            if (this._checkCollision(this._player, this._endArea) ||
                this._checkCollision(this._player, this._shortcut)){
                
                config.Game.PLAYED = false;
                stage.removeAllChildren();
                scene = config.Scene.MENU;
                changeScene();
            }
        }
        
        // Spawn enemies faster
        private _fasterSpawn() : void {
            if (!this._spawnFaster && this._checkCollision(this._player, this._moreEnemiesTrigger)){
                this._spawnDelay *= 0.25;
                this._spawnFaster = true;
                console.log("SpawningFaster");
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
        
        private _presentScores() : void {
            if (this._checkCollision(this._player, this._showArea1)){
                this._showLabel.text = "Your traversed the city in " + level1HS.toFixed(2);
            }
            
            if (this._checkCollision(this._player, this._showArea2)){
                this._showLabel.text = "Your traversed the woods in " + level2HS.toFixed(2);
            }
            
            if (this._checkCollision(this._player, this._showArea3)){
                this._showLabel.text = "Your traversed the village in " + level3HS.toFixed(2);
                createjs.Sound.stop();
                var ambientSound = createjs.Sound.play("babySounds",{loop: 3});
                ambientSound.play();
                ambientSound.volume = 0.2;
            }
            
            if (this._checkCollision(this._player, this._showHighScore)){
                this._showLabel.text = "Your total time is " + Math.abs(globalScore/ 1000).toFixed(2);
                this._showLabel.x = config.Screen.CENTER_X - 120;
            }
            
            if (this._checkCollision(this._player, this._showThanks)){
                this._showLabel.text = "Thank you for playing";
                this._showLabel.x = config.Screen.CENTER_X - 100;
            }
        }
    }
}