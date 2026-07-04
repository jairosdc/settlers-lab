import type { ResourceDefinition, ResourceId } from '../engine/types'
export const resources: Record<ResourceId, ResourceDefinition> = {
 wood:{id:'wood',name:'Madera',category:'basic',initiallyVisible:true,storage:true,baseCapacity:300,icon:'wood'},
 stone:{id:'stone',name:'Piedra',category:'basic',initiallyVisible:true,storage:true,baseCapacity:260,icon:'stone'},
 food:{id:'food',name:'Comida',category:'basic',initiallyVisible:true,storage:true,baseCapacity:240,icon:'food'},
 population:{id:'population',name:'Población',category:'population',initiallyVisible:true,storage:false,baseCapacity:10,icon:'population'},
 knowledge:{id:'knowledge',name:'Conocimiento',category:'advanced',initiallyVisible:true,storage:true,baseCapacity:180,icon:'knowledge'},
 resilience:{id:'resilience',name:'Resiliencia',category:'resilience',initiallyVisible:true,storage:true,baseCapacity:100,icon:'resilience'},
 planks:{id:'planks',name:'Tablones',category:'intermediate',initiallyVisible:false,storage:true,baseCapacity:160,unlockedBy:'basic_carpentry',icon:'planks'},
 bricks:{id:'bricks',name:'Ladrillos',category:'intermediate',initiallyVisible:false,storage:true,baseCapacity:140,unlockedBy:'brickmaking',icon:'bricks'},
 metal:{id:'metal',name:'Metal',category:'advanced',initiallyVisible:false,storage:true,baseCapacity:100,unlockedBy:'early_metallurgy',icon:'metal'},
 bread:{id:'bread',name:'Pan',category:'intermediate',initiallyVisible:false,storage:true,baseCapacity:120,unlockedBy:'baking',icon:'bread'},
 tools:{id:'tools',name:'Herramientas',category:'advanced',initiallyVisible:false,storage:true,baseCapacity:80,unlockedBy:'flow_prioritization',icon:'tools'},
 energy:{id:'energy',name:'Energía',category:'advanced',initiallyVisible:false,storage:true,baseCapacity:100,unlockedBy:'network_capacity',icon:'energy'},
}
export const resourceLabels = resources
