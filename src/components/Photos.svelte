<script lang="ts">
    import type { RecipeDTO } from "../model/recipe";
    import { ImageDTO } from "../model/pictures";
    
    export let recipeId: string;
    export let recipe: RecipeDTO;
    export let title: string;

    const picturesCount = recipe.pictures || 0;

    let images: ImageDTO[] = [];

    for(let i = 1; i <= picturesCount; i++) {

        const imagePath = `/assets/images/cooking/recipes/${title}/${recipeId}-${i}.jpg`;

        images.push(new ImageDTO(imagePath));
    }

    function onPictureClick(clickedImage: ImageDTO): void {

        if(!clickedImage.isMaximized()) {

            // Minimize other pictures
            images.forEach(image => image.minimize());

            // Maximize clicked picture
            clickedImage.maximize();
        } 
        // minimize image when clicking on an already maximized image
        else {
            clickedImage.minimize();
        }

        // Trigger a UI refresh
        images = images;
    }

    function onPictureLoadingError(img: EventTarget): void {
        img.remove();
    }

</script>

{#if picturesCount > 0}

    <div class="variante-pictures">

        <h4>📷 Photos</h4>

        <div class="recipe-pictures">

            {#each images as image}
                <img 
                    src={image.path}
                    itemprop='image'
                    class="recipe-picture" 
                    width={image.width}
                    alt={title}
                    title={title}
                    on:click={_ => onPictureClick(image)} 
                    on:error={e => onPictureLoadingError(e.target)}
                />
            {/each}
            
        </div>

    </div>
{/if}