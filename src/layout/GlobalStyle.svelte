<style>
    :root {
        /* Darkest -> Lightest */
        --border-color: #40514E;
        --header-bg-color: #11999E; 
        --content-side-bg-color: #30E3CA; 
        --content-main-bg-color: #E4F9F5;
        --behind-bg-color: #fbf9ea;

        /* Theme 1 
        --border-color: #F38BA0;
        --header-bg-color: #B5EAEA; 
        --content-side-bg-color: #FFBCBC; 
        --content-main-bg-color: #EDF6E5;
        --behind-bg-color: #EDF6E5;
        */

        /* Theme 2
        --border-color: #FF7878;
        --header-bg-color: #E0C097; 
        --content-side-bg-color: #F3F0D7; 
        --content-main-bg-color: #CEE5D0;
        --behind-bg-color: #fbf9ea;
        */

        /* Theme 3
        --border-color: #95E1D3;
        --header-bg-color: #F38181; 
        --content-side-bg-color: #f4e5ac; 
        --content-main-bg-color: #EAFFD0;
        --behind-bg-color: #fbf9ea;
        */
    }

    :global(body) {
        background-color: var(--behind-bg-color);
    }

    :global(main) {
        background-color: var(--content-main-bg-color);
    }

    :global(h1) { 
        font-size: 45px; 
        text-align: center; 
        text-decoration: 3px underline wavy var(--border-color);
        padding-bottom: 35px; 
        margin-bottom: 0px; 
        background-color: var(--header-bg-color);
    }

    :global(h2) {
        font-size: 35px;
        padding-left: 5px;
        padding-bottom: 3px;
        border-bottom: 3px solid var(--border-color);
        text-align: center;
    }

    :global(h3) {
        font-size: 20px;
        padding: 0px 5px 3px 5px;
        border-bottom: 1px solid var(--border-color);
        display: inline-block;
    }

    @media all and (max-width: 700px) { 
        :global(h3) {
            display: block;
            text-align: center;
        }
    }
</style>