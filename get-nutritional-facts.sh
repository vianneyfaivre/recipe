#!/bin/bash

# Input params
foodIds=("3451790012358" "3068110702235" "3564700370315" "20057251" "3174660000896" "3412290011074" "3068110361869" "3451790012358")

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
    mv $destFile "nutrition-facts/$name.json"

    # Data Format https://world.openfoodfacts.org/data/data-fields.txt
    energy=$( cat $destFile | jq '.product | .nutriments | ."energy_value"' )
    unit=$( cat $destFile | jq '.product | .nutriments | ."energy_unit"' )
    carbs=$( cat $destFile | jq '.product | .nutriments | .carbohydrates_100g' )
    fat=$( cat $destFile | jq '.product | .nutriments | .fat_100g' )
    prot=$( cat $destFile | jq '.product | .nutriments | .proteins_100g' )
    salt=$( cat $destFile | jq '.product | .nutriments | .salt_100g' )
    fib=$( cat $destFile | jq '.product | .nutriments | .fiber_100g' )


    # Poor's man code generation
    echo "const $name = new NutritionFactsDTO($energy, $carbs, $fat, $prot, $salt, ViscosityDTO.REPLACEME);"
done
