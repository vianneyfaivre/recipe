<script lang="ts">
    import type { RecipeDTO } from "./model";
    import { ImageDTO } from "./utils";
    
    export let recipeId: string;
    export let recipe: RecipeDTO;
    export let title: string;

    const picturesCount = recipe.pictures || 0;

    let images: ImageDTO[] = [];

    for(let i = 1; i <= picturesCount; i++) {

        const imagePath = `/assets/images/cooking/recipes/${title}/${recipeId}-${i}.jpg`;

        images.push(new ImageDTO(imagePath));
    }


    function onPictureClick(clickedImage: ImageDTO) {

        const alreadyEnlarged: boolean = clickedImage.width > 100;

        if(!clickedImage.isMaximized()) {

            // Minimize other pictures
            images.forEach(image => image.minimize());

            // Maximize clicked picture
            clickedImage.maximize();

            // Trigger a UI refresh
            images = images;
        }
    }

</script>

{#if picturesCount > 0}

    <div id="{recipeId}-pictures" class="variante-pictures">

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
                    on:click={e => onPictureClick(image)} 
                />
            {/each}
            
        </div>

    </div>
{/if}