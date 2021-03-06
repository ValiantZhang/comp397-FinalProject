var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var scenes;
(function (scenes) {
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            _super.call(this);
            //this.start();
        }
        Play.prototype.start = function () {
            this._timeStamp = new Date().getTime();
            levelScore = 0;
            // Set dimension
            dimension = config.Dimension.firstDimension;
            this._spawnDelay = 3000 - this._getRandomNum();
            this._currentTick = createjs.Ticker.getTime();
            this._spawnTime = this._currentTick + this._spawnDelay;
            this._maxEnemies = 15;
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
            this._fg2 = new createjs.Bitmap(assets.getResult("blackBox"));
            this._fg2.y = 497;
            this.addChild(this._fg2);
            this._player = new objects.Player(player_anim, "player");
            this._player.position.x = config.Screen.CENTER_X;
            this._player.position.y = config.Screen.CENTER_Y + 150;
            this.addChild(this._player);
            this.addChild(this._scrollableObjContainer);
            // Set level label
            this._levelString = "City Outskirts";
            this._levelLabel = new objects.Label(this._levelString, "28px Consolas", "#999", config.Screen.CENTER_X, 550);
            this.addChild(this._levelLabel);
            this._timerLabel = new objects.Label(Math.abs(globalScore / 1000).toFixed(2), "24px Consolas", "#0F0", config.Screen.CENTER_X, 600);
            this.addChild(this._timerLabel);
            this.setChildIndex(this._fg, this.getNumChildren() - 1);
            this.setChildIndex(this._levelLabel, this.getNumChildren() - 1);
            this.setChildIndex(this._timerLabel, this.getNumChildren() - 1);
            window.onkeydown = this._onKeyDown;
            window.onkeyup = this._onKeyUp;
            stage.addChild(this);
            createjs.Sound.stop();
            var ambientSound = createjs.Sound.play("citySound", { loop: -1 });
            ambientSound.play();
            ambientSound.volume = 0.2;
        };
        Play.prototype.update = function () {
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
            for (var _b = 0, _c = this._enemies; _b < _c.length; _b++) {
                var enemy = _c[_b];
                enemy.update();
                // Check if enemies are dead and call cleanup
                if (!enemy.isAlive) {
                    var index = this._enemies.indexOf(enemy);
                    this._enemies.splice(index, 1);
                }
                // Check collision with player
                if (this._checkCollision(this._player, enemy)) {
                    enemy.endGame();
                }
            }
            for (var _d = 0, _e = this._spikes1; _d < _e.length; _d++) {
                var spike = _e[_d];
                if (this._checkDimensionCollision(this._player, spike)) {
                    spike.endGame();
                }
            }
            for (var _f = 0, _g = this._movingSpikes1; _f < _g.length; _f++) {
                var spike = _g[_f];
                if (this._checkDimensionCollision(this._player, spike)) {
                    spike.endGame();
                }
            }
            this._spawnEnemy();
            this._updateScore();
        };
        Play.prototype._onKeyDown = function (event) {
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
        Play.prototype._onKeyUp = function (event) {
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
        Play.prototype._scrollBG = function (speed) {
            if (dimension == config.Dimension.firstDimension) {
                this._bg.scroll(speed);
                this._fg.scroll(speed * 10);
                for (var i = 0; i < this._scrollableObjContainer.numChildren; i++) {
                    var child = this._scrollableObjContainer.getChildAt(i);
                    child.position.x -= speed * 10;
                }
                // Scroll end of level sign
                this._nextLvlSign.x -= speed * 10;
            }
            else {
                this._bg.scroll(speed * config.Zone.alternateZone);
                this._fg.scroll(speed * 10 * config.Zone.alternateZone);
                this._player.resetAcceleration();
                for (var i = 0; i < this._scrollableObjContainer.numChildren; i++) {
                    var child = this._scrollableObjContainer.getChildAt(i);
                    child.position.x -= speed * 10 * config.Zone.alternateZone;
                }
                // Scroll end of level sign
                this._nextLvlSign.x -= speed * 10 * config.Zone.alternateZone;
            }
        };
        Play.prototype._checkScroll = function () {
            if (this._player.position.x > this._scrollTrigger && controls.RIGHT ||
                this._player.position.x < this._scrollTrigger / 4 && controls.LEFT) {
                return true;
            }
            else {
                return false;
            }
        };
        Play.prototype._keepAboveGround = function () {
            if (this._player.position.y > config.Screen.CENTER_Y + 130) {
                this._player.position.y = config.Screen.CENTER_Y + 130;
                this._player.setIsGrounded(true);
            }
        };
        // Switch dimensions
        Play.prototype._dimensionShift = function () {
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
                controls.JUMP = false;
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
        };
        // Populate level
        Play.prototype._buildLevel = function () {
            var _this = this;
            // Dimension One
            var platforms1 = [[10, 5], [12, 4], [18, 1], [22, 1], [24, 2], [26, 3], [29.6, 4], [34.4, 4], [38, 3], [42, 3], [46, 3], [50, 3]];
            platforms1.forEach(function (el) {
                var currentBlock = new objects.Platform("platform1_3", new objects.Vector2(tileSize * el[0] + tileSize / 2, 100 + tileSize / 2 * (el[1] - 1) + tileSize / 2));
                _this._platforms1.push(currentBlock);
                _this._dimensionObjects.push(currentBlock);
                _this._scrollableObjContainer.addChild(currentBlock);
            });
            // Dimension Two
            var platforms2 = [[16, 4], [32, 3], [40, 3], [44, 3], [48, 3], [52, 3]];
            platforms2.forEach(function (el) {
                var currentBlock = new objects.Platform("platform1_3", new objects.Vector2(tileSize * el[0] + tileSize / 2, 100 + tileSize / 2 * (el[1] - 1) + tileSize / 2), config.Dimension.secondDimension);
                _this._platforms1.push(currentBlock);
                _this._dimensionObjects.push(currentBlock);
                _this._scrollableObjContainer.addChild(currentBlock);
            });
            // Dual Dimension
            var spikes1 = [13, 15, 17, 19, 20, 21, 30, 31, 32, 33, 34];
            spikes1.forEach(function (el) {
                var currentBlock = new objects.Spike(tileSize * el + tileSize / 2, false, "b_spike", config.Dimension.dualDimension);
                _this._spikes1.push(currentBlock);
                _this._dimensionObjects.push(currentBlock);
                _this._scrollableObjContainer.addChild(currentBlock);
            });
            var movingSpikes1 = [39, 40, 41, 43, 44, 46, 48, 49, 50];
            movingSpikes1.forEach(function (el) {
                var currentBlock = new objects.Spike(tileSize * el + tileSize / 2, true, "b_spike", config.Dimension.dualDimension);
                _this._movingSpikes1.push(currentBlock);
                _this._dimensionObjects.push(currentBlock);
                _this._scrollableObjContainer.addChild(currentBlock);
            });
            // End of level
            this._nextLvlSign = new createjs.Bitmap(assets.getResult("signWoods"));
            this._nextLvlSign.y = 350;
            this._nextLvlSign.x = 7500;
            this.addChild(this._nextLvlSign);
            this._endArea = new objects.HugeWall(new objects.Vector2(8000, config.Screen.CENTER_Y));
            this._shortcut = new objects.HugeWall(new objects.Vector2(-500, config.Screen.CENTER_Y));
            this._scrollableObjContainer.addChild(this._endArea);
            this._scrollableObjContainer.addChild(this._shortcut);
        };
        // Populate enemies
        Play.prototype._addEnemies = function (x, y) {
            var newEnemy = new objects.Enemy(enemy1_anim, this._player.position);
            newEnemy.position.x = x;
            newEnemy.position.y = y;
            this._scrollableObjContainer.addChild(newEnemy);
            this._enemies.push(newEnemy);
        };
        Play.prototype._spawnEnemy = function () {
            if (createjs.Ticker.getTime() >= this._spawnTime) {
                // Generate enemy on left edge
                this._addEnemies(0, 0);
                this._currentTick = createjs.Ticker.getTime();
                this._spawnTime = this._currentTick + this._spawnDelay;
                this._enemiesSpawned += 1;
            }
        };
        Play.prototype._getRandomNum = function () {
            return Math.floor(Math.random() * ((200 + 200 - 200) + 200));
        };
        // Platform collision detection
        Play.prototype._checkPlatformCol = function () {
            // Check if player is colliding with any platforms
            var collisionCount = 0;
            // Loops through each platform
            for (var _i = 0, _a = this._platforms1; _i < _a.length; _i++) {
                var a = _a[_i];
                // Check for collision
                if (this._checkDimensionCollision(this._player, a)) {
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
        };
        // Move to new level
        Play.prototype._switchLevel = function () {
            if (this._checkCollision(this._player, this._shortcut)) {
                stage.removeAllChildren();
                scene = config.Scene.LEVEL2;
                changeScene();
            }
            if (this._checkCollision(this._player, this._endArea)) {
                level1HS = Math.abs(levelScore / 1000);
                stage.removeAllChildren();
                scene = config.Scene.LEVEL2;
                changeScene();
            }
        };
        // Collision detection
        Play.prototype._checkCollision = function (player, obj2) {
            // Check for intersection
            if (obj2.leftSide < player.rightSide - player.width / 2 &&
                obj2.rightSide > player.leftSide + player.width / 2 &&
                obj2.topSide < player.botSide &&
                obj2.botSide > player.topSide) {
                return true;
            }
            return false;
        };
        // Collision detection for multi dimension objects
        Play.prototype._checkDimensionCollision = function (player, obj2) {
            // Check for intersection
            if (obj2.leftSide < player.rightSide - player.width / 2 &&
                obj2.rightSide > player.leftSide + player.width / 2 &&
                obj2.topSide < player.botSide &&
                obj2.botSide > player.topSide &&
                (obj2.physicalDimension == dimension ||
                    obj2.physicalDimension == config.Dimension.dualDimension)) {
                return true;
            }
            return false;
        };
        // Check if collision happened on top face of object2 and bottom of object1
        Play.prototype._checkTopFace = function (player, obj2) {
            if (player.botSide > obj2.topSide - 1 &&
                player.topSide < obj2.topSide - player.height / 8) {
                // Bump player up to platform if slightly below
                player.position.y = obj2.topSide - player.height / 2 + 1;
                return true;
            }
            return false;
        };
        // Check if collision happened on other faces
        Play.prototype._checkOtherFaces = function (player, obj2) {
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
        Play.prototype._switchDimensionObjects = function () {
            for (var _i = 0, _a = this._dimensionObjects; _i < _a.length; _i++) {
                var a = _a[_i];
                a.dimensionShift();
            }
        };
        Play.prototype._updateScore = function () {
            globalScore = this._timeStamp - new Date().getTime();
            levelScore = this._timeStamp - new Date().getTime();
            this._timerLabel.text = Math.abs(globalScore / 1000).toFixed(2);
        };
        return Play;
    }(objects.Scene));
    scenes.Play = Play;
})(scenes || (scenes = {}));
//# sourceMappingURL=play.js.map