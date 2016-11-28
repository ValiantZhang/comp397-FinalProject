module objects {
    export class Parallax extends createjs.Container {
        
        // Images that will recycle for scrolling
        private _img : createjs.Bitmap;
        private _img2 : createjs.Bitmap;
        private _imgWidth : number;
        private _imgHeight : number;
        private _scrollSpeed : number;
        
        private _blurFilter : createjs.BlurFilter;

        constructor(imgString : string) {
            super();
            this._img = new createjs.Bitmap(imgString);
            this._img2 = new createjs.Bitmap(imgString);
            this.start();
        }

        public start() : void {
            this.addChild(this._img);
            this.addChild(this._img2);
            this._imgWidth = this._img.getBounds().width;
            this._imgHeight = this._img.getBounds().height;
            this._scrollSpeed = 0.2;
            this._img.x = 0;
            this._img2.x = this._imgWidth;
        }

        public update() : void {
            this._scrollImgs();
        }
        
        public setSpeed(scrollSpeed : number) : void {
            this._scrollSpeed = scrollSpeed;
        }
        
        public blurImg(blurAmount : number) : void {
            // Add blur filter
            this._blurFilter = new createjs.BlurFilter(blurAmount, blurAmount, 4);
            this._img.filters = [this._blurFilter];
            this._img.cache(this._img.x, this._img.y, this._imgWidth, this._imgHeight);
            this._img2.filters = [this._blurFilter];
            this._img2.cache(this._img2.x, this._img2.y, this._imgWidth, this._imgHeight);
        }
        
        // Scroll and recycle image
        private _scrollImgs() : void {
            // Scroll backgrounds
            this._img.x -= this._scrollSpeed;
            this._img2.x -= this._scrollSpeed;
            
            // Recycle backgrounds
            if (this._img.x < -this._imgWidth){
                this._img.x = this._imgWidth - this._scrollSpeed;
            } if (this._img2.x < -this._imgWidth){
                this._img2.x = this._imgWidth - this._scrollSpeed;
            }
        }
    }
}