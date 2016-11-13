module objects {
    enum PipeSize {SMALL, MEDIUM, LARGE}
    
    export class Pipe extends objects.GameObject {
        private _pipeSize : string;

        constructor(pipeSize : string, defaultPosition : objects.Vector2) {
            super(pipeSize);
            this.x = defaultPosition.x;
            this.y = defaultPosition.y;
        }
    }
}