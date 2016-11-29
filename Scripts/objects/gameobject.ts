module objects {
    export class GameObject extends createjs.Sprite {
        private _width:number;
        private _height:number;
        private _name:string;
        private _position:objects.Vector2;

        // PUBLIC PROPERTIES
        get width() : number {
            return this._width
        }

        set width(w:number) {
            this._width = w;
        }

        get height() : number {
            return this._height
        }

        set height(h:number) {
            this._height = h;
        }

        get name() : string {
            return this._name;
        }

        set name(s:string) {
            this._name = s;
        }

        get position() : objects.Vector2 {
            return this._position
        }

        set position(p:objects.Vector2) {
            this._position = p;
        }
        
        constructor(animation : createjs.SpriteSheet, objectName:string, singleImageString:string=null,w:number =0, h:number=0) {
            if(animation != null)
                super(animation,"idle");
            else{
                 let newData = {
                    "images": [assets.getResult(singleImageString)],
                    "frames": {width:w, height:h},
                    "animations": {                        
                        "idle": {"frames": [0]}
                    }
                }
                var temp_anim = new createjs.SpriteSheet(newData);

                super(temp_anim,"idle");
            }                
            //this._deathAnim = deathAnimString;
            this.name = objectName;
            this._initialize();
            this.start();
        }

        /*constructor(imageString : string) {
            super(atlas, imageString);

            this._initialize(imageString);
            this.start();
        }*/
        
        private _initialize():void {
           
            this.width = this.getBounds().width;
            this.height = this.getBounds().height;
            //this.regX = this.width * 0.5;
            //this.regY = this.height * 0.5;
            this.position = new Vector2(this.x, this.y);
        }

        public start():void {}
        public update():void {
            this.x = this.position.x;
            this.y = this.position.y;
        }
    }
}