# Recipe v2 for my personal blog

Svelte application to be integrated into vianneyfaivre.com

## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

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