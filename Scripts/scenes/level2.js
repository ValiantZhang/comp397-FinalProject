var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var scenes;
(function (scenes) {
    var Level2 = (function (_super) {
        __extends(Level2, _super);
        function Level2() {
            _super.call(this);
            //this.start();
        }
        Level2.prototype.start = function () {
            this._spawnDelay = 5000 - this._getRandomNum();
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
            // Scrollable object container
            this._scrollableObjContainer = new createjs.Container();
            this._buildLevel();
            this._player = new objects.Player(player_anim, "player");
            this._player.position.x = config.Screen.CENTER_X;
            this._player.position.y = config.Screen.CENTER_Y + 150;
            this.addChild(this._player);
            //this._scrollableObjContainer.addChild(this._bg);
            //this._scrollableObjContainer.addChild(this._player);
            //this._scrollableObjContainer.addChild(this._ground);
            // this._ground.y = 535;
            this.addChild(this._scrollableObjContainer);
            this.setChildIndex(this._fg, this.getNumChildren() - 1);
            window.onkeydown = this._onKeyDown;
            window.onkeyup = this._onKeyUp;
            stage.addChild(this);
        };
        Level2.prototype.update = function () {
            if (controls.SHIFT) {
                this._dimensionTimer = 10;
                this._shifting = true;
                this._dimensionShift();
                controls.SHIFT = false;
                this._normalView = this._normalView ? false : true;
                this._shifting = this._normalView ? false : true;
            }
            if (controls.LEFT) {
                controls.RIGHT = false;
                this._player.moveLeft();
                if (this._checkScroll()) {
                    this._scrollBG(-1);
                    this._player.position.x = this._scrollTrigger / 4;
                }
            }
            else if (controls.RIGHT) {
                controls.LEFT = false;
                this._player.moveRight();
                if (this._checkScroll()) {
                    this._scrollBG(1);
                    this._player.position.x = this._scrollTrigger;
                }
            }
            if (controls.JUMP) {
                this._player.jump();
            }
            if (!controls.RIGHT && !controls.LEFT) {
                this._player.resetAcceleration();
                this._player.idle();
            }
            this._keepAboveGround();
            this._checkPlatformCol();
            this._player.update();
            this._switchLevel();
            for (var _i = 0, _a = this._dimensionObjects; _i < _a.length; _i++) {
                var o = _a[_i];
                o.update();
            }
            // for(let enemy of this._enemies ) {
            //     enemy.update();
            //     if (this._checkCollision(this._player, enemy)){
            //         enemy.endGame();
            //     }
            // }
            // for(let enemyOb of this._enemyObstacles ) {
            //     enemyOb.update();
            //     if (this._checkCollision(this._player, enemyOb)){
            //         enemyOb.endGame();
            //     }
            // }
            for (var _b = 0, _c = this._spikes1; _b < _c.length; _b++) {
                var spike = _c[_b];
                if (this._checkCollision(this._player, spike)) {
                    spike.endGame();
                }
            }
            for (var _d = 0, _e = this._movingSpikes1; _d < _e.length; _d++) {
                var spike = _e[_d];
                if (this._checkCollision(this._player, spike)) {
                    spike.endGame();
                }
            }
            this._spawnEnemy();
        };
        Level2.prototype._onKeyDown = function (event) {
            switch (event.keyCode) {
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
        };
        Level2.prototype._onKeyUp = function (event) {
            switch (event.keyCode) {
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
        };
        Level2.prototype._scrollBG = function (speed) {
            if (dimension == config.Dimension.firstDimension) {
                this._bg.scroll(speed);
                this._fg.scroll(speed * 10);
                // this._scrollableObjContainer.regX += speed * 10;
                for (var i = 0; i < this._scrollableObjContainer.numChildren; i++) {
                    var child = this._scrollableObjContainer.getChildAt(i);
                    child.position.x -= speed * 10;
                }
            }
            else {
                this._bg.scroll(speed * config.Zone.alternateZone);
                this._fg.scroll(speed * 10 * config.Zone.alternateZone);
                this._player.resetAcceleration();
                // this._scrollableObjContainer.regX += speed * 10 * config.Zone.alternateZone;
                for (var i = 0; i < this._scrollableObjContainer.numChildren; i++) {
                    var child = this._scrollableObjContainer.getChildAt(i);
                    child.position.x -= speed * 10 * config.Zone.alternateZone;
                }
            }
        };
        Level2.prototype._checkScroll = function () {
            if (this._player.position.x > this._scrollTrigger && controls.RIGHT ||
                this._player.position.x < this._scrollTrigger / 4 && controls.LEFT) {
                return true;
            }
            else {
                return false;
            }
        };
        Level2.prototype._keepAboveGround = function () {
            if (this._player.position.y > config.Screen.CENTER_Y + 130) {
                this._player.position.y = config.Screen.CENTER_Y + 130;
                this._player.setIsGrounded(true);
            }
        };
        // Switch dimensions
        Level2.prototype._dimensionShift = function () {
            if (this._normalView) {
                this.removeChild(this._dimensionFilter);
                this.addChild(this._dimensionFilter2);
                this._player.changeZone(config.Zone.alternateZone);
                this._bg.setSpeed(this._bg.getSpeed() * config.Zone.alternateZone);
                this._fg.setSpeed(this._fg.getSpeed() * config.Zone.alternateZone);
                dimension = config.Dimension.secondDimension;
            }
            else {
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
        };
        // Populate level
        Level2.prototype._buildLevel = function () {
            var _this = this;
            var platforms1 = [[8, 6], [9, 5], [9, 5.5], [10, 6], [12.5, 0], [14, 2], [16, 5], [19, 4], [20, 2], [23, 0], [28, 5.5], [30, 4], [34, 0], [33, 6], [33.5, 5.5], [34, 5], [34.5, 5.5], [35, 5], [35.5, 5.5], [36, 6]];
            platforms1.forEach(function (el) {
                var currentBlock = new objects.Platform("platformVines", new objects.Vector2(tileSize * el[0] + tileSize / 2, 100 + tileSize / 2 * (el[1] - 1) + tileSize / 2));
                _this._platforms1.push(currentBlock);
                _this._dimensionObjects.push(currentBlock);
                _this._scrollableObjContainer.addChild(currentBlock);
            });
            var enemyObstacles1 = [[13.5, 5.5], [35.5, 8]];
            enemyObstacles1.forEach(function (el) {
                var currentBlock = new objects.EnemyObstacle(new objects.Vector2(tileSize * el[0] + tileSize / 2, 100 + tileSize / 2 * (el[1] - 1) + tileSize / 2));
                _this._enemyObstacles.push(currentBlock);
                _this._dimensionObjects.push(currentBlock);
                _this._scrollableObjContainer.addChild(currentBlock);
            });
            var invVerticalMovePlat = [[24, 3]];
            invVerticalMovePlat.forEach(function (el) {
                var currentBlock = new objects.InvPlatform("platform1_3_alt", new objects.Vector2(tileSize * el[0] + tileSize / 2, 100 + tileSize / 2 * (el[1] - 1) + tileSize / 2), true, "horizontal", 3);
                _this._invVerticalMovePlat.push(currentBlock);
                _this._dimensionObjects.push(currentBlock);
                _this._scrollableObjContainer.addChild(currentBlock);
            });
            var spikes1 = [23, 24, 25, 26.5];
            spikes1.forEach(function (el) {
                var currentBlock = new objects.Spike(tileSize * el + tileSize / 2);
                _this._spikes1.push(currentBlock);
                _this._dimensionObjects.push(currentBlock);
                _this._scrollableObjContainer.addChild(currentBlock);
            });
            var movingSpikes1 = [16, 28];
            movingSpikes1.forEach(function (el) {
                var currentBlock = new objects.Spike(tileSize * el + tileSize / 2, true, "b_spike");
                _this._movingSpikes1.push(currentBlock);
                _this._dimensionObjects.push(currentBlock);
                _this._scrollableObjContainer.addChild(currentBlock);
            });
            var enemySpawners = [45, 47];
            enemySpawners.forEach(function (el) {
                var currentBlock = new objects.EnemySpawner(tileSize * el + tileSize / 2);
                _this._enemySpawners.push(currentBlock);
                _this._dimensionObjects.push(currentBlock);
                _this._scrollableObjContainer.addChild(currentBlock);
            });
            this._endArea = new objects.HugeWall(new objects.Vector2(9000, 0));
            this._scrollableObjContainer.addChild(this._endArea);
        };
        // Populate enemies
        Level2.prototype._addEnemies = function (x, y) {
            var newEnemy = new objects.Enemy(enemy1_anim, this._player.position);
            newEnemy.position.x = x;
            newEnemy.position.y = y;
            this._enemies.push(newEnemy);
            this._scrollableObjContainer.addChild(newEnemy);
        };
        Level2.prototype._spawnEnemy = function () {
            if (createjs.Ticker.getTime() >= this._spawnTime && this._enemiesSpawned < this._maxEnemies) {
                this._addEnemies(this._player.position.x - 500, this._player.position.y - 500);
                this._currentTick = createjs.Ticker.getTime();
                this._spawnTime = this._currentTick + this._spawnDelay;
                this._enemiesSpawned += 1;
            }
        };
        Level2.prototype._getRandomNum = function () {
            return Math.floor(Math.random() * ((200 + 200 - 200) + 200));
        };
        // Platform collision detection
        Level2.prototype._checkPlatformCol = function () {
            // Check if player is colliding with any platforms
            var collisionCount = 0;
            // Loops through each platform
            for (var _i = 0, _a = this._platforms1; _i < _a.length; _i++) {
                var a = _a[_i];
                // Check for collision
                if (this._checkCollision(this._player, a)) {
                    collisionCount += 1;
                    // Check if collision is with top of object
                    if (this._checkTopFace(this._player, a)) {
                        this._player.setIsGrounded(true);
                    }
                }
            }
            if (collisionCount == 0 && this._player.y < config.Screen.CENTER_Y + 130) {
                this._player.setIsGrounded(false);
            }
            if (dimension == config.Dimension.secondDimension) {
                for (var _b = 0, _c = this._invVerticalMovePlat; _b < _c.length; _b++) {
                    var a = _c[_b];
                    // Check for collision
                    if (this._checkCollision(this._player, a)) {
                        collisionCount += 1;
                        // Check if collision is with top of object
                        if (this._checkTopFace(this._player, a)) {
                            this._player.setIsGrounded(true);
                        }
                    }
                }
            }
        };
        // Move to new level
        Level2.prototype._switchLevel = function () {
            if (this._checkCollision(this._player, this._endArea)) {
                stage.removeAllChildren();
                scene = config.Scene.LEVEL2;
                changeScene();
            }
        };
        // Collision detection
        Level2.prototype._checkCollision = function (player, obj2) {
            // Check for intersection
            if (obj2.leftSide < player.rightSide - player.width / 2 &&
                obj2.rightSide > player.leftSide + player.width / 2 &&
                obj2.topSide < player.botSide &&
                obj2.botSide > player.topSide) {
                return true;
            }
            return false;
        };
        // Check if collision happened on top face of object2 and bottom of object1
        Level2.prototype._checkTopFace = function (player, obj2) {
            if (player.botSide > obj2.topSide - 1 &&
                player.topSide < obj2.topSide - player.height / 8) {
                // Bump player up to platform if slightly below
                player.position.y = obj2.topSide - player.height / 2 + 1;
                return true;
            }
            return false;
        };
        // Check if collision happened on other faces
        Level2.prototype._checkOtherFaces = function (player, obj2) {
            // Check if player is colliding with left side
            if (player.rightSide < obj2.leftSide) {
                player.x = obj2.leftSide - player.width / 2;
                player.setVelocity(new objects.Vector2(0, player.getVelocity().y));
                console.log("Left hit");
            }
            else if (player.leftSide > obj2.rightSide) {
                player.x = obj2.rightSide + player.width / 2;
                player.setVelocity(new objects.Vector2(0, player.getVelocity().y));
                console.log("Right hit");
            }
            else if (player.topSide < obj2.botSide - 7) {
                player.y = obj2.botSide + player.height / 2;
                player.setVelocity(new objects.Vector2(0, -player.getVelocity().y));
                console.log("Bottom hit");
            }
        };
        // Switch dimensional objects
        Level2.prototype._switchDimensionObjects = function () {
            for (var _i = 0, _a = this._dimensionObjects; _i < _a.length; _i++) {
                var a = _a[_i];
                a.dimensionShift();
            }
        };
        return Level2;
    }(objects.Scene));
    scenes.Level2 = Level2;
})(scenes || (scenes = {}));
//# sourceMappingURL=level2.js.map