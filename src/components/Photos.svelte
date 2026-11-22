<script lang="ts">
    import type { RecipeDTO } from "../model/recipe";
    
    interface Props {
        recipeId: string;
        recipe: RecipeDTO;
        title: string;
    }

    interface Picture {
        path: string;
        width: number;
    }

    let { recipeId, recipe, title }: Props = $props();

    let picturesCount: number = $derived(recipe.pictures || 0);

    // Plain objects (not class instances) so that $state makes `width` deeply reactive
    let images: Picture[] = $state(buildImages());

    function buildImages(): Picture[] {

        const result: Picture[] = [];

        for(let i = 1; i <= picturesCount; i++) {

            const imagePath = `/assets/images/cooking/recipes/${title}/${recipeId}-${i}.jpg`;

            result.push({ path: imagePath, width: 100 });
        }

        return result;
    }

    function onPictureClick(clickedImage: Picture): void {

        if(clickedImage.width <= 100) {

            // Minimize other pictures
            images.forEach(image => image.width = 100);

            // Maximize clicked picture
            clickedImage.width = 400;
        } 
        // minimize image when clicking on an already maximized image
        else {
            clickedImage.width = 100;
        }
    }

    function onPictureLoadingError(e: Event): void {
        (e.target as HTMLElement).remove();
    }

</script>

<style>
    .recipe-pictures { display: flex; flex-wrap: wrap; flex-shrink: 0; align-items: flex-start; }
    .picture-button { padding: 0; border: 0; background: none; cursor: pointer; }
    img { padding: 5px; border-radius: 10px; transition: width 500ms; }
</style>

{#if picturesCount > 0}
<section>
    
    <h3>📷 Photos</h3>
    
    <div class="recipe-pictures">
        
        {#each images as image}
            <button type="button" class="picture-button" onclick={_ => onPictureClick(image)}>
                <img 
                    src={image.path}
                    itemprop='image'
                    width={image.width}
                    alt={title}
                    title={title}
                    onerror={onPictureLoadingError}
                />
            </button>
        {/each}
        
    </div>
</section>
{/if}