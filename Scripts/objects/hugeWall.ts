module objects {
    export class HugeWall extends objects.DimensionObject {
        constructor(defaultPosition : objects.Vector2) {
            super("invisibleWall",config.Dimension.firstDimension,"invisible","invisible", defaultPosition.x, defaultPosition.y);
        }
    }
}