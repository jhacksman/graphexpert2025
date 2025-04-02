import { z } from "zod";

export const entitySchema = z.object({
  name: z.string()
    .min(1, "Entity name cannot be empty")
    .max(100, "Entity name too long (max 100 characters)")
    .describe("The unique identifier name of the entity"),
  
  entityType: z.string()
    .min(1, "Entity type cannot be empty")
    .describe("The type/category of the entity"),
  
  observations: z.array(
    z.string()
      .min(1, "Observation cannot be empty")
      .max(1000, "Observation too long (max 1000 characters)")
  )
  .default([])
  .describe("Array of observations about this entity")
}).strict();

export const relationSchema = z.object({
  from: z.string()
    .min(1, "Source entity name cannot be empty")
    .describe("The name of the entity where the relation starts"),
  
  to: z.string()
    .min(1, "Target entity name cannot be empty")
    .describe("The name of the entity where the relation ends"),
  
  relationType: z.string()
    .min(1, "Relation type cannot be empty")
    .describe("The type of the relation between entities")
}).strict();

export const createEntitiesInputSchema = z.object({
  entities: z.array(entitySchema)
    .nonempty("Must provide at least one entity")
    .describe("Array of entities to create")
}).strict();

export const createRelationsInputSchema = z.object({
  relations: z.array(relationSchema)
    .nonempty("Must provide at least one relation")
    .describe("Array of relations to create")
}).strict();

export const addObservationsInputSchema = z.object({
  observations: z.array(
    z.object({
      entityName: z.string()
        .min(1, "Entity name cannot be empty")
        .describe("The name of the entity to add observations to"),
      
      contents: z.array(
        z.string()
          .min(1, "Observation cannot be empty")
          .max(1000, "Observation too long (max 1000 characters)")
      )
      .nonempty("Must provide at least one observation")
      .describe("Array of observations to add")
    })
  )
  .nonempty("Must provide at least one entity with observations")
  .describe("Array of entities and their observations")
}).strict();

export const deleteEntitiesInputSchema = z.object({
  entityNames: z.array(
    z.string()
      .min(1, "Entity name cannot be empty")
  )
  .nonempty("Must provide at least one entity name")
  .describe("Array of entity names to delete")
}).strict();

export const deleteObservationsInputSchema = z.object({
  deletions: z.array(
    z.object({
      entityName: z.string()
        .min(1, "Entity name cannot be empty")
        .describe("The name of the entity containing the observations"),
      
      observations: z.array(
        z.string()
          .min(1, "Observation cannot be empty")
      )
      .nonempty("Must provide at least one observation")
      .describe("Array of observations to delete")
    })
  )
  .nonempty("Must provide at least one entity with observations")
  .describe("Array of entities and their observations to delete")
}).strict();

export const deleteRelationsInputSchema = z.object({
  relations: z.array(relationSchema)
    .nonempty("Must provide at least one relation")
    .describe("Array of relations to delete")
}).strict();

export const searchNodesInputSchema = z.object({
  query: z.string()
    .min(1, "Search query cannot be empty")
    .describe("The search query to match against entity names, types, and observation content")
}).strict();

export const openNodesInputSchema = z.object({
  names: z.array(
    z.string()
      .min(1, "Entity name cannot be empty")
  )
  .nonempty("Must provide at least one entity name")
  .describe("Array of entity names to retrieve")
}).strict();

export type Entity = z.infer<typeof entitySchema>;
export type Relation = z.infer<typeof relationSchema>;
export type KnowledgeGraph = {
  entities: Entity[];
  relations: Relation[];
};
