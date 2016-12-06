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
        
        get leftSide() : number {
            return this._position.x - this._width / 2;
        }
        
        get rightSide() : number {
            return this._position.x + this._width / 2;
        }
        
        get topSide() : number {
            return this._position.y - this._height / 2;
        }
        
        get botSide() : number {
            return this._position.y + this._height / 2;
        }

        set position(p:objects.Vector2) {
            this._position = p;
        }
        
        constructor(animation : createjs.SpriteSheet, objectName:string, singleImageString:string=null,w:number =0, h:number=0,  dimImageString:string=null) {
            if(animation != null)
                super(animation,"idle");
            else{
                let newData = {
                    "images": [assets.getResult(singleImageString), assets.getResult(dimImageString)],
                    "frames": [
                        [0, 0, w, h, 0, w/2, h/2],
                        [0, 0, w, h, 1, w/2, h/2]
                    ],
                    "animations": {                        
                        "idle": 0,
                        "alt": 1
                    }
                }
                var temp_anim = new createjs.SpriteSheet(newData);

                super(temp_anim,"idle");
            }                
            this.name = objectName;
            this._initialize();
            this.start();
        }
        
        private _initialize():void {
            this._width = this.getBounds().width;
            this._height = this.getBounds().height;
            this.position = new Vector2(this.x, this.y);
        }

        public start():void {}
        
        public update():void {
            this.x = this.position.x;
            this.y = this.position.y;
        }
    }
}