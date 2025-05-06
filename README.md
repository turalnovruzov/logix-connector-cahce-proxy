# Cache Proxy

A simple key-value caching service using Azure Functions and MongoDB for storage.

## Features

- Store and retrieve any data using simple HTTP requests
- REST API for cache operations (GET, PUT/POST, DELETE)
- MongoDB backend for persistent storage

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Azure Functions Core Tools
- MongoDB instance (local or cloud)

### Setup

1. Clone the repository

```bash
git clone <repository-url>
cd cache-proxy
```

2. Install dependencies

```bash
npm install
```

3. Create a `local.settings.json` file with your MongoDB connection details:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "MONGO_URI": "your-mongodb-connection-string",
    "MONGO_DB": "cache"
  }
}
```

4. Start the service

```bash
npm start
```

The service will be available at `http://localhost:7071/api`

## API Usage

### Get a value

```bash
curl http://localhost:7071/api/cache/myKey
```

### Store a value

```bash
curl -X PUT http://localhost:7071/api/cache/myKey -d "My value to store"
```

### Delete a value

```bash
curl -X DELETE http://localhost:7071/api/cache/myKey
```

## Development

- Build: `npm run build`
- Watch mode: `npm run watch`
- Clean build: `npm run clean`

## Tech Stack

- TypeScript
- Azure Functions v4
- MongoDB
