const QUERY_PARAM_SELECTED_RECIPE = 'sr';

function getCurrentURL(): URL {
    return new URL(window.location.href); 
}

function replaceURL(newURL: URL) {

    // Update the current URL without refreshing the page
    window.history.replaceState(null, '', newURL); 
}

export const anchorManager = {

    get(): string | null {

        const url = getCurrentURL();
    
        return url.searchParams.get(QUERY_PARAM_SELECTED_RECIPE);
    },
    
    set(anchor: string): void {
        console.debug(`Changed anchor to '${anchor}'`);
    
        const url = getCurrentURL();
    
        url.searchParams.set(QUERY_PARAM_SELECTED_RECIPE, anchor);
    
        replaceURL(url);   
    },
    
    remove(): void {
        
        const url = getCurrentURL();

        if(url.searchParams.has(QUERY_PARAM_SELECTED_RECIPE)) {

            console.debug(`Removed invalid anchor`);
        
            url.searchParams.delete(QUERY_PARAM_SELECTED_RECIPE);
        
            replaceURL(url);  
        }
    }
};