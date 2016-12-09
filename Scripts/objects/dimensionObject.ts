module objects {
    export class DimensionObject extends objects.GameObject {
        
        private _dimension : number;
        private _physicalDimension : number;
        private _shadowImage : string;
        private _normalImage : string;
        
        constructor(objectName : string,  physicalDimension : number, 
                    normalImage : string, shadowImage : string, width:number=100, height:number=100) {
                        
            super(null, objectName, normalImage, width, height, shadowImage);
            this._physicalDimension = physicalDimension;
            this._normalImage = normalImage;
            this._shadowImage = shadowImage;
            this.start();
        }

        public start() : void {
            this._dimension = config.Dimension.firstDimension;
            // Check if object exists in both worlds
            if (this._physicalDimension != config.Dimension.dualDimension){
                // Check if object is first dimension
                if (this._dimension == this._physicalDimension){
                    this.gotoAndPlay("idle");
                    this.alpha = 1;
                // check if object is second dimension
                } else if (this._dimension + 1 == this._physicalDimension) {
                    this.gotoAndPlay("alt");
                    this.alpha = 0.5;
                }
            } else {
                this.gotoAndPlay("idle");
            }
        }

        public update() : void {
            super.update();
        }
        
        get physicalDimension() : number {
            return this._physicalDimension;
        }
        
        // Switch main image with shadow and vice versa
        public dimensionShift(){
            // Swap dimensions
            this._dimension = this._dimension == config.Dimension.firstDimension ? 
                                                 config.Dimension.secondDimension :
                                                 config.Dimension.firstDimension;
                     
            if (this._physicalDimension != config.Dimension.dualDimension){
                if (this._dimension == this._physicalDimension){
                    this.gotoAndPlay("idle");
                    this.alpha = 1;
                } else {
                    this.gotoAndPlay("alt");
                    this.alpha = 0.5;
                }
            }                            
        }
        
    }
}