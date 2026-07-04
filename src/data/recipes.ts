import type { RecipeDefinition } from '../engine/types'
export const recipes: Record<string, RecipeDefinition> = {
 produce_wood:{id:'produce_wood',name:'Bosque gestionado',inputs:{},outputs:{wood:5},cycleSeconds:60},
 wood_to_planks:{id:'wood_to_planks',name:'Madera a tablones',inputs:{wood:2},outputs:{planks:1},cycleSeconds:20,requiredTech:'basic_carpentry'},
 produce_stone:{id:'produce_stone',name:'Extracción de piedra',inputs:{},outputs:{stone:4},cycleSeconds:60},
 stone_wood_to_bricks:{id:'stone_wood_to_bricks',name:'Piedra y madera a ladrillos',inputs:{stone:2,wood:1},outputs:{bricks:1},cycleSeconds:30,requiredTech:'brickmaking'},
 produce_food:{id:'produce_food',name:'Cultivo intensivo',inputs:{},outputs:{food:6},cycleSeconds:60},
 food_to_bread:{id:'food_to_bread',name:'Comida a pan',inputs:{food:2},outputs:{bread:1},cycleSeconds:24,requiredTech:'baking'},
 mine_metal:{id:'mine_metal',name:'Minería inicial',inputs:{planks:0.2},outputs:{metal:1},cycleSeconds:45,requiredTech:'early_metallurgy'},
 housing_basic:{id:'housing_basic',name:'Vivienda básica',inputs:{food:0.3},outputs:{population:0.08},cycleSeconds:60},
 housing_improved:{id:'housing_improved',name:'Vivienda mejorada',inputs:{planks:0.4,bricks:0.4,bread:0.2},outputs:{population:0.18},cycleSeconds:60,requiredTech:'brickmaking'},
 teach:{id:'teach',name:'Formación técnica',inputs:{food:0.8},outputs:{knowledge:2.2},cycleSeconds:60},
 regulate:{id:'regulate',name:'Regulación de inventario',inputs:{},outputs:{},cycleSeconds:60},
 resilience_ops:{id:'resilience_ops',name:'Mitigación operativa',inputs:{knowledge:0.35,food:0.3},outputs:{resilience:1.8},cycleSeconds:60},
}
