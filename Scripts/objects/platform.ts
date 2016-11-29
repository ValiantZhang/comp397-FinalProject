module objects {
    export class Platform extends objects.GameObject {

        constructor(defaultPosition : objects.Vector2) {
            super(null,"platform1","platform1_3",192,47);
           
            //console.log("block" + defaultPosition.x+ " : "+ defaultPosition.y);
            
           this.x = defaultPosition.x;
           this.y = defaultPosition.y
           //this.position =defaultPosition;
        }

          




    }
}