export class GameItem{
    constructor(
        public name: string,
        public imageLink: string,
        public platforms: string[],
        public releaseMonth: number,
        public releaseYear: number,
        public releaseDay: number,
        public gbGameId: string
    ){}
}