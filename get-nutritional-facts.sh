#!/bin/bash

# Data Format https://world.openfoodfacts.org/data/data-fields.txt

wget https://world.openfoodfacts.org/api/v0/product/3451790012358.json -O extract.json

energy=$( cat extract.json | jq '.product | .nutriments | ."energy_value"' )
unit=$( cat extract.json | jq '.product | .nutriments | ."energy_unit"' )
carbs=$( cat extract.json | jq '.product | .nutriments | .carbohydrates_100g' )
fat=$( cat extract.json | jq '.product | .nutriments | .fat_100g' )
prot=$( cat extract.json | jq '.product | .nutriments | .proteins_100g' )
salt=$( cat extract.json | jq '.product | .nutriments | .salt_100g' )
fib=$( cat extract.json | jq '.product | .nutriments | .fiber_100g' )

echo $unit

echo "const FOOD = new NutritionFactsDTO($energy, $carbs, $fat, $prot, $salt, ViscosityDTO.REPLACEME);"