# MCP Memory Server Implementation

## Overview

The Memory component of the Model Context Protocol (MCP) servers project implements a knowledge graph-based persistent memory system. This implementation allows AI assistants like Claude to remember information about users across conversations, enhancing personalization and contextual awareness.

## Repository Structure

The MCP Memory Server is located in the `src/memory` directory of the MCP servers repository. The main components include:

- `README.md`: Documentation of the memory server
- `index.ts`: Main implementation file containing the knowledge graph logic
- `Dockerfile`: Container configuration for deployment
- `package.json`: Node.js package configuration
- `tsconfig.json`: TypeScript configuration

## Core Concepts

The memory server implements a knowledge graph with three primary components:

### Entities

Entities are the primary nodes in the knowledge graph. Each entity has:
- A unique name (identifier)
- An entity type (e.g., "person", "organization", "event")
- A list of observations (facts about the entity)

Example:
```json
{
  "name": "John_Smith",
  "entityType": "person",
  "observations": ["Speaks fluent Spanish"]
}
```

### Relations

Relations define directed connections between entities. They are always stored in active voice and describe how entities interact or relate to each other.

Example:
```json
{
  "from": "John_Smith",
  "to": "Anthropic",
  "relationType": "works_at"
}
```

### Observations

Observations are discrete pieces of information about an entity. They are:
- Stored as strings
- Attached to specific entities
- Can be added or removed independently
- Should be atomic (one fact per observation)

Example:
```json
{
  "entityName": "John_Smith",
  "observations": [
    "Speaks fluent Spanish",
    "Graduated in 2019",
    "Prefers morning meetings"
  ]
}
```

## Technical Implementation

The memory server is implemented in TypeScript and uses a simple file-based storage system. The main components of the implementation include:

### Data Model

The implementation defines TypeScript interfaces for the core data structures:

```typescript
interface Entity {
  name: string;
  entityType: string;
  observations: string[];
}

interface Relation {
  from: string;
  to: string;
  relationType: string;
}

interface KnowledgeGraph {
  entities: Entity[];
  relations: Relation[];
}
```

### Storage Mechanism

The knowledge graph is stored in a JSON file, with the path configurable via environment variables. The default location is `memory.json` in the server directory.

The file format uses a line-delimited JSON approach, where each line contains either an entity or a relation object with a type field to distinguish them.

### KnowledgeGraphManager Class

The core of the implementation is the `KnowledgeGraphManager` class, which provides methods for interacting with the knowledge graph:

- `loadGraph()`: Reads the graph from the storage file
- `saveGraph()`: Writes the graph to the storage file
- `createEntities()`: Adds new entities to the graph
- `createRelations()`: Adds new relations to the graph
- `addObservations()`: Adds observations to existing entities
- `deleteEntities()`: Removes entities and their relations
- `deleteObservations()`: Removes specific observations from entities
- `deleteRelations()`: Removes specific relations from the graph
- `readGraph()`: Returns the entire knowledge graph
- `searchNodes()`: Searches for nodes based on a query
- `openNodes()`: Retrieves specific nodes by name

### MCP Server Integration

The memory server integrates with the MCP framework by:

1. Creating a Server instance with the appropriate name and version
2. Registering tool handlers for the various operations
3. Setting up request handlers for listing tools and calling tools
4. Connecting to the standard I/O transport for communication

## API Tools

The memory server exposes the following tools through the MCP interface:

- **create_entities**: Create multiple new entities in the knowledge graph
- **create_relations**: Create multiple new relations between entities
- **add_observations**: Add new observations to existing entities
- **delete_entities**: Remove entities and their relations
- **delete_observations**: Remove specific observations from entities
- **delete_relations**: Remove specific relations from the graph
- **read_graph**: Read the entire knowledge graph
- **search_nodes**: Search for nodes based on query
- **open_nodes**: Retrieve specific nodes by name

Each tool has a defined input schema that specifies the expected parameters and their types.

## Deployment Options

The memory server can be deployed in several ways:

### Docker

```json
{
  "mcpServers": {
    "memory": {
      "command": "docker",
      "args": ["run", "-i", "-v", "claude-memory:/app/dist", "--rm", "mcp/memory"]
    }
  }
}
```

### NPX

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    }
  }
}
```

### Custom Configuration

The server can be configured using environment variables:

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ],
      "env": {
        "MEMORY_FILE_PATH": "/path/to/custom/memory.json"
      }
    }
  }
}
```

## System Prompt Integration

To effectively use the memory server with Claude, a specific system prompt is recommended. This prompt guides Claude in:

1. Identifying the user
2. Retrieving relevant information from the knowledge graph
3. Identifying new information to store during conversations
4. Updating the memory with new entities, relations, and observations

The prompt can be customized based on the specific use case, such as chat personalization, domain-specific knowledge, or task tracking.

## Implementation Strengths

1. **Simplicity**: The implementation is straightforward and easy to understand
2. **Flexibility**: The knowledge graph structure can represent a wide variety of information
3. **Extensibility**: The code is modular and can be extended with additional functionality
4. **Persistence**: Information is stored across sessions in a simple file format
5. **Searchability**: The implementation includes basic search functionality

## Implementation Limitations

1. **Scalability**: The simple file-based approach may not scale to very large knowledge graphs
2. **Query Complexity**: The search functionality is basic compared to dedicated graph databases
3. **Concurrency**: No built-in support for concurrent access to the knowledge graph
4. **Schema Enforcement**: Limited validation of entity and relation types
5. **Performance**: Loading the entire graph into memory may become inefficient for large graphs

## Conclusion

The MCP Memory Server provides a simple but effective implementation of a knowledge graph for persistent memory in AI assistants. Its straightforward approach makes it accessible for developers while still offering the core functionality needed for maintaining context across conversations.
