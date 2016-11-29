var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
        function GameObject(animation, objectName, singleImageString, w, h) {
            if (singleImageString === void 0) { singleImageString = null; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            if (animation != null)
                _super.call(this, animation, "idle");
            else {
                var newData = {
                    "images": [assets.getResult(singleImageString)],
                    "frames": { width: w, height: h },
                    "animations": {
                        "idle": { "frames": [0] }
                    }
                };
                var temp_anim = new createjs.SpriteSheet(newData);
                _super.call(this, temp_anim, "idle");
            }
            //this._deathAnim = deathAnimString;
            this.name = objectName;
            this._initialize();
            this.start();
        }
        Object.defineProperty(GameObject.prototype, "width", {
            // PUBLIC PROPERTIES
            get: function () {
                return this._width;
            },
            set: function (w) {
                this._width = w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (h) {
                this._height = h;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (s) {
                this._name = s;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (p) {
                this._position = p;
            },
            enumerable: true,
            configurable: true
        });
        /*constructor(imageString : string) {
            super(atlas, imageString);

            this._initialize(imageString);
            this.start();
        }*/
        GameObject.prototype._initialize = function () {
            this.width = this.getBounds().width;
            this.height = this.getBounds().height;
            //this.regX = this.width * 0.5;
            //this.regY = this.height * 0.5;
            this.position = new objects.Vector2(this.x, this.y);
        };
        GameObject.prototype.start = function () { };
        GameObject.prototype.update = function () {
            this.x = this.position.x;
            this.y = this.position.y;
        };
        return GameObject;
    }(createjs.Sprite));
    objects.GameObject = GameObject;
})(objects || (objects = {}));
//# sourceMappingURL=gameobject.js.map