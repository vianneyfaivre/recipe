<style>
    :root {
        /* Theme - Blue/Pink 
        --border-color: #F38BA0;
        --header-bg-color: #B5EAEA; 
        --content-side-bg-color: #B5EAEA; 
        --content-main-bg-color: #EDF6E5;
        --footer-bg-color: var(--header-bg-color);
        --behind-bg-color: #EDF6E5;
        */

        /* Theme - Purple/Yellow */
        --border-color: #AA96DA;
        --header-bg-color: #F7EBEF;
        --content-side-bg-color: var(--header-bg-color); 
        --content-main-bg-color: #FDFCE5;
        --footer-bg-color: var(--header-bg-color);
        --behind-bg-color: #fbf9ea;
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
        padding: 15px 0 35px 0; 
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

    :global(a) {
        color: var(--border-color);
    }

    :global(a:visited) {
        color: var(--border-color);
    }

    @media all and (max-width: 700px) { 
        :global(h3) {
            display: block;
            text-align: center;
        }
    }
</style>