var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var Parallax = (function (_super) {
        __extends(Parallax, _super);
        function Parallax(imgString) {
            _super.call(this);
            this._img = new createjs.Bitmap(imgString);
            this._img2 = new createjs.Bitmap(imgString);
            this.start();
        }
        Parallax.prototype.start = function () {
            this.addChild(this._img);
            this.addChild(this._img2);
            this._imgWidth = this._img.getBounds().width;
            this._scrollSpeed = 0.2;
            this._img.x = 0;
            this._img2.x = this._imgWidth;
        };
        Parallax.prototype.update = function () {
            this._scrollImgs();
        };
        Parallax.prototype.setSpeed = function (scrollSpeed) {
            this._scrollSpeed = scrollSpeed;
        };
        // Scroll and recycle image
        Parallax.prototype._scrollImgs = function () {
            // Scroll backgrounds
            this._img.x -= this._scrollSpeed;
            this._img2.x -= this._scrollSpeed;
            // Recycle backgrounds
            if (this._img.x < -this._imgWidth) {
                this._img.x = this._imgWidth - this._scrollSpeed;
            }
            if (this._img2.x < -this._imgWidth) {
                this._img2.x = this._imgWidth - this._scrollSpeed;
            }
        };
        return Parallax;
    }(createjs.Container));
    objects.Parallax = Parallax;
})(objects || (objects = {}));
//# sourceMappingURL=parallax.js.map