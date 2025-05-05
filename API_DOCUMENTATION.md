# Cache API Documentation

This API provides a simple key-value cache service with MongoDB as the backend storage.

## Base URL

```
http://localhost:7071/api
```

## Endpoints

### Get Value

Retrieves a value from the cache by key.

- **URL**: `/cache/{key}`
- **Method**: `GET`
- **URL Parameters**:
  - `key` (required): The key to retrieve from the cache
- **Response**:
  - **Success**:
    - Code: 200
    - Content: The stored value
  - **Error**:
    - Code: 404
    - Content: "Key not found"

**Example**:

```bash
curl http://localhost:7071/api/cache/myKey
```

### Set Value

Stores a value in the cache.

- **URL**: `/cache/{key}`
- **Method**: `PUT` or `POST`
- **URL Parameters**:
  - `key` (required): The key under which to store the value
- **Request Body**: The value to store (plain text)
- **Response**:
  - **Success**:
    - Code: 200
    - Content: "Value put successfully"

**Example**:

```bash
curl -X PUT http://localhost:7071/api/cache/myKey -d "My value to store"
```

### Delete Value

Deletes a value from the cache.

- **URL**: `/cache/{key}`
- **Method**: `DELETE`
- **URL Parameters**:
  - `key` (required): The key to delete from the cache
- **Response**:
  - **Success**:
    - Code: 200
    - Content: "Value deleted successfully"
  - **Error**:
    - Code: 404
    - Content: "Key not found"

**Example**:

```bash
curl -X DELETE http://localhost:7071/api/cache/myKey
```

## Environment Configuration

The service requires the following environment variables:

- `MONGO_URI`: MongoDB connection string
- `MONGO_DB`: MongoDB database name

The service uses a collection named `cache` in the specified database.
