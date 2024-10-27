#!/bin/bash

# Input params
foodIds=("3558630110806", "3558630111100")

for foodId in "${foodIds[@]}"
do : 
    # HTTP call
    url="https://world.openfoodfacts.org/api/v0/product/$foodId.json"
    destFile="nutrition-facts/$foodId.json"

    wget $url --quiet --output-document=$destFile 

    # Get a human readable name
    name=$( cat $destFile | jq --raw-output '.product | .categories_hierarchy[-1]' )
    name=${name//:/_}
    name=${name// /_}
    name=${name//-/_}

    # Rename dest file
    destFileRenamed="nutrition-facts/$name.json"
    mv $destFile $destFileRenamed

    # Data Format https://world.openfoodfacts.org/data/data-fields.txt
    energy=$( cat $destFileRenamed | jq '.product | .nutriments | ."energy-kcal_100g"' )
    carbs=$( cat $destFileRenamed | jq '.product | .nutriments | .carbohydrates_100g' )
    fat=$( cat $destFileRenamed | jq '.product | .nutriments | .fat_100g' )
    prot=$( cat $destFileRenamed | jq '.product | .nutriments | .proteins_100g' )
    salt=$( cat $destFileRenamed | jq '.product | .nutriments | .salt_100g' )
    fib=$( cat $destFileRenamed | jq '.product | .nutriments | .fiber_100g' )

    # Poor's man code generation
    echo "const $name = new NutritionFactsDTO($energy, $carbs, $fat, $prot, $salt, HydrationDTO.REPLACEME);"
done
