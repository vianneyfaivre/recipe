# Recipe v2 for my personal blog

Svelte application to be used as a recipe template for vianneyfaivre.com

## Get started

```bash
npm install
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080)

## Building and running in production mode

```bash
npm run build
npm run start
```

Copy files to the right folder in my local:
```
cp public/build/* /Users/vianneyfaivre/IdeaProjects/vianneyfaivre.github.io/assets/recipe-v2 
```

## Migrate Recipe v1 to Recipe v2

1. Copy the recipe `.md` file to the folder `assets/recipes/`
2. Change the file extension to `.yaml`
3. Edit the `.md` file
  - Remove the recipe data
  - Change the `layout` to `recipe-v2`
4. Edit the `.yaml` file
  - Remove the `---` 
  - If the recipe has pictures
    - add the property `pictures` on each variation of the recipe
    - make sure that the pictures are named the right way: `assets/images/cooking/recipes/{title}/{recipeId}-{count}.jpg`
  - Rename some properties
    - `nom` into `label`
    - `qte` into `qty`
    - `lien` into `link`
    - `unite` into `unit`
    - `etapes` into `steps`
    - `variantes` into `variations`