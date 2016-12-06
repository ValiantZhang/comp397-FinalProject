module objects {
    export class HugeWall extends objects.DimensionObject {
        constructor(defaultPosition : objects.Vector2) {
            super("invisibleWall",config.Dimension.firstDimension,"invisibleWall","invisibleWall", 500, 640);
            
            this.x = this.position.x = defaultPosition.x;
            this.y = this.position.y = defaultPosition.y;
        }
    }
}