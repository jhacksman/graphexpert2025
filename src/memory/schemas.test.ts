import { expect, test, describe } from 'vitest';
import {
  entitySchema,
  relationSchema,
  createEntitiesInputSchema,
  createRelationsInputSchema,
  addObservationsInputSchema,
  deleteEntitiesInputSchema,
  deleteObservationsInputSchema,
  deleteRelationsInputSchema,
  searchNodesInputSchema,
  openNodesInputSchema
} from './schemas.js';
import { z } from 'zod';

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

  test('empty name fails validation', () => {
    const entityWithEmptyName = {
      name: '',
      entityType: 'person',
      observations: ['Observation']
    };
    expect(() => entitySchema.parse(entityWithEmptyName)).toThrow(z.ZodError);
  });
});

describe('Relation Schema', () => {
  test('valid relation passes validation', () => {
    const validRelation = {
      from: 'Entity1',
      to: 'Entity2',
      relationType: 'knows'
    };
    expect(relationSchema.parse(validRelation)).toEqual(validRelation);
  });

  test('empty relationType fails validation', () => {
    const relationWithEmptyType = {
      from: 'Entity1',
      to: 'Entity2',
      relationType: ''
    };
    expect(() => relationSchema.parse(relationWithEmptyType)).toThrow(z.ZodError);
  });
});

describe('Create Entities Input Schema', () => {
  test('valid input passes validation', () => {
    const validInput = {
      entities: [
        {
          name: 'Entity1',
          entityType: 'person',
          observations: ['Observation 1']
        }
      ]
    };
    expect(createEntitiesInputSchema.parse(validInput)).toEqual(validInput);
  });

  test('empty entities array fails validation', () => {
    const inputWithEmptyEntities = {
      entities: []
    };
    expect(() => createEntitiesInputSchema.parse(inputWithEmptyEntities)).toThrow(z.ZodError);
  });
});

describe('Create Relations Input Schema', () => {
  test('valid input passes validation', () => {
    const validInput = {
      relations: [
        {
          from: 'Entity1',
          to: 'Entity2',
          relationType: 'knows'
        }
      ]
    };
    expect(createRelationsInputSchema.parse(validInput)).toEqual(validInput);
  });

  test('empty relations array fails validation', () => {
    const inputWithEmptyRelations = {
      relations: []
    };
    expect(() => createRelationsInputSchema.parse(inputWithEmptyRelations)).toThrow(z.ZodError);
  });
});

describe('Add Observations Input Schema', () => {
  test('valid input passes validation', () => {
    const validInput = {
      observations: [
        {
          entityName: 'Entity1',
          contents: ['Observation 1']
        }
      ]
    };
    expect(addObservationsInputSchema.parse(validInput)).toEqual(validInput);
  });

  test('empty contents array fails validation', () => {
    const inputWithEmptyContents = {
      observations: [
        {
          entityName: 'Entity1',
          contents: []
        }
      ]
    };
    expect(() => addObservationsInputSchema.parse(inputWithEmptyContents)).toThrow(z.ZodError);
  });
});

describe('Search Nodes Input Schema', () => {
  test('valid input passes validation', () => {
    const validInput = {
      query: 'search term'
    };
    expect(searchNodesInputSchema.parse(validInput)).toEqual(validInput);
  });

  test('empty query fails validation', () => {
    const inputWithEmptyQuery = {
      query: ''
    };
    expect(() => searchNodesInputSchema.parse(inputWithEmptyQuery)).toThrow(z.ZodError);
  });
});

describe('Open Nodes Input Schema', () => {
  test('valid input passes validation', () => {
    const validInput = {
      names: ['Entity1', 'Entity2']
    };
    expect(openNodesInputSchema.parse(validInput)).toEqual(validInput);
  });

  test('empty names array fails validation', () => {
    const inputWithEmptyNames = {
      names: []
    };
    expect(() => openNodesInputSchema.parse(inputWithEmptyNames)).toThrow(z.ZodError);
  });
});
