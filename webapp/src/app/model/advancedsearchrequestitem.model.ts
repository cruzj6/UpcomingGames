export class AdvancedSearchRequestItem {
    constructor(private platform: string,
        private month: number,
        private year: number,
        private keywords: string) { }

    get Platform(): string {
        return this.platform;
    }

    get Month(): number {
        return this.month;
    }

    get Year(): number {
        return this.year;
    }

    get Keywords(): string {
        return this.keywords;
    }
}