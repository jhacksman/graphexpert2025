# Implementing Zod Validation for MCP Memory Server

This document provides a comprehensive guide on implementing Zod validation for the Model Context Protocol (MCP) memory server to prevent LLM hallucinations by ensuring data integrity.

## What is Zod?

Zod is a TypeScript-first schema declaration and validation library that allows you to define schemas for your data structures and validate them at runtime. It provides:

- Strong type inference
- Runtime type checking
- Detailed error messages
- Data transformation capabilities
- Composable schemas

## Why Add Zod Validation to MCP Memory Server?

The MCP memory server implements a knowledge graph for storing persistent memory across conversations with AI assistants. Adding Zod validation provides several benefits:

1. **Prevents LLM Hallucinations**: By strictly validating input data, we can prevent AI models from creating invalid data structures.
2. **Runtime Type Safety**: Ensures that data conforms to expected shapes at runtime.
3. **Better Error Messages**: Provides detailed error messages that pinpoint exactly what's wrong with the data.
4. **TypeScript Integration**: Generates TypeScript types from schemas, ensuring consistency between runtime and compile-time types.
5. **Input Sanitization**: Can transform and normalize data during validation.

## Implementation Steps

### 1. Create Schema Definitions

First, create a `schemas.ts` file with Zod schemas for all data structures:

```typescript
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

// Additional schemas for relations, inputs, etc.
```

### 2. Update Request Handler

Modify the request handler to validate inputs using Zod schemas:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "create_entities": {
        const validatedInput = createEntitiesInputSchema.parse(args);
        const createdEntities = await knowledgeGraphManager.createEntities(validatedInput.entities);
        return { content: [{ type: "text", text: JSON.stringify(createdEntities, null, 2) }] };
      }
      // Other cases...
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [{
          type: "text",
          text: `Validation error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
        }]
      };
    }
    throw error;
  }
});
```

### 3. Enhance KnowledgeGraphManager

Add validation to the KnowledgeGraphManager methods:

```typescript
async createEntities(entities: Entity[]): Promise<Entity[]> {
  // Validate entities with Zod schema
  const validatedEntities = entities.map(entity => entitySchema.parse(entity));
  
  const graph = await this.loadGraph();
  const newEntities = validatedEntities.filter(e => !graph.entities.some(existingEntity => existingEntity.name === e.name));
  graph.entities.push(...newEntities);
  await this.saveGraph(graph);
  return newEntities;
}
```

### 4. Create Tests

Create tests to verify schema validations:

```typescript
describe('Entity Schema', () => {
  test('valid entity passes validation', () => {
    const validEntity = {
      name: 'TestEntity',
      entityType: 'person',
      observations: ['Observation 1', 'Observation 2']
    };
    expect(entitySchema.parse(validEntity)).toEqual(validEntity);
  });

  test('entity without observations gets default empty array', () => {
    const entityWithoutObservations = {
      name: 'TestEntity',
      entityType: 'person'
    };
    expect(entitySchema.parse(entityWithoutObservations)).toEqual({
      name: 'TestEntity',
      entityType: 'person',
      observations: []
    });
  });
});
```

## Benefits of This Implementation

1. **Data Integrity**: Ensures all data conforms to expected shapes
2. **Error Prevention**: Catches invalid data before it enters the system
3. **Developer Experience**: Provides clear error messages for debugging
4. **Type Safety**: Maintains TypeScript type safety at runtime
5. **Documentation**: Self-documenting schemas with descriptions

## Conclusion

Implementing Zod validation in the MCP memory server significantly improves data integrity and reduces the potential for LLM hallucinations by ensuring that all data conforms to expected shapes. The detailed error messages and runtime type checking make it easier to debug issues and maintain a robust system.
