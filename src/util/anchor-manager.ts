
export function getAnchor(): string | undefined {

    return decodeURI(window.location.hash.split("#")[1]);
}

export function setAnchor(anchor: string): void {
    console.debug(`Changed anchor to '${anchor}'`);
    window.location.hash = anchor;
}