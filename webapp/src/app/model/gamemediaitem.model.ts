export class GameMediaItem {
    constructor(
        public thumbnail: Thumbnail,
        public url: string,
        public title: string
    ) { }
}

class Thumbnail {
    constructor(public __metadata: string, public MediaUrl: string) { }
}