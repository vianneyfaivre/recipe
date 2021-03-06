const PLURALIZABLE_WORDS = [
    { singular: "cuillère", plural: "cuillères" },
    { singular: "gousse", plural: "gousses" },
    { singular: "jaune", plural: "jaunes" },
    { singular: "blanc", plural: "blancs" },
    { singular: "pincée", plural: "pincées" },
    { singular: "feuille", plural: "feuilles" },
    { singular: "cosse", plural: "cosses" },
    { singular: "étoile", plural: "étoiles" },
    { singular: "baton", plural: "batons" },
    { singular: "carreau", plural: "carreaux" },
    { singular: "grain", plural: "grains" }
];

export const pluralizer = {

    convert(unit: string, pluralize: boolean): string {

        const unitParts = unit?.split(" ");

        return unitParts.map(unitPart => {

            // singular => plural
            if(pluralize) {
                return PLURALIZABLE_WORDS.find(w => w.singular === unitPart)?.plural || unitPart;
            }
            // plural => singular 
            else {
                return PLURALIZABLE_WORDS.find(w => w.plural === unitPart)?.singular || unitPart;
            }
            
        }).join(" ");
    }
}