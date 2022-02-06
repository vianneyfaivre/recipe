
export class ImageDTO {

    width: number = 100;
    
    constructor(
        readonly path: string,
    ) {}

    isMaximized(): boolean {
        return this.width > 100;
    }

    maximize(): void {
        this.width = 400;
    }

    minimize(): void {
        this.width = 100;
    }
}