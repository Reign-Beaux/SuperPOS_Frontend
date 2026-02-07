# SuperPOS Backend - API Documentation

Documentación completa de endpoints para integración con el Frontend.

**Base URL:** `http://localhost:5000/api` (ajustar según configuración)

---

## 📋 Tabla de Contenidos

1. [Customer (Clientes)](#customer-clientes)
2. [Product (Productos)](#product-productos)
3. [User (Usuarios)](#user-usuarios)
4. [Role (Roles)](#role-roles)
5. [Sale (Ventas)](#sale-ventas)
6. [Inventory (Inventario)](#inventory-inventario)
7. [Respuestas de Error](#respuestas-de-error)
8. [Notas Importantes](#notas-importantes)

---

## Customer (Clientes)

**Ruta Base:** `/api/customer`

### 1. Crear Cliente
```
POST /api/customer
```

**Body (JSON):**
```json
{
  "name": "string (requerido)",
  "firstLastname": "string (requerido)",
  "secondLastname": "string (opcional)",
  "phone": "string (opcional)",
  "email": "string (opcional)",
  "birthDate": "datetime (opcional, formato ISO: 2024-01-01T00:00:00Z)"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "id": "guid",
  "name": "string",
  "firstLastname": "string",
  "secondLastname": "string",
  "phone": "string",
  "email": "string",
  "birthDate": "datetime"
}
```

---

### 2. Obtener Cliente por ID
```
GET /api/customer/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del cliente

**Respuesta exitosa (200 OK):**
```json
{
  "id": "guid",
  "name": "string",
  "firstLastname": "string",
  "secondLastname": "string",
  "phone": "string",
  "email": "string",
  "birthDate": "datetime"
}
```

---

### 3. Obtener Todos los Clientes
```
GET /api/customer
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "guid",
    "name": "string",
    "firstLastname": "string",
    "secondLastname": "string",
    "phone": "string",
    "email": "string",
    "birthDate": "datetime"
  }
]
```

---

### 4. Buscar Clientes
```
GET /api/customer/search?term={term}
```

**Parámetros:**
- `term` (string, query, requerido): Término de búsqueda. Debe tener al menos 3 caracteres. Busca en nombre, primer apellido y segundo apellido.

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "guid",
    "name": "string",
    "firstLastname": "string",
    "secondLastname": "string",
    "phone": "string",
    "email": "string",
    "birthDate": "datetime"
  }
]
```

**Respuesta de error (400 Bad Request):**
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Bad Request",
  "status": 400,
  "detail": "El término de búsqueda debe tener al menos 3 caracteres."
}
```

---

### 5. Actualizar Cliente
```
PUT /api/customer/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del cliente a actualizar

**Body (JSON):**
```json
{
  "id": "guid (debe coincidir con el de la ruta)",
  "name": "string (requerido)",
  "firstLastname": "string (requerido)",
  "secondLastname": "string (opcional)",
  "phone": "string (opcional)",
  "email": "string (opcional)",
  "birthDate": "datetime (opcional)"
}
```

**Respuesta exitosa (204 No Content):** Sin contenido

---

### 6. Eliminar Cliente
```
DELETE /api/customer/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del cliente a eliminar

**Respuesta exitosa (204 No Content):** Sin contenido

---

## Product (Productos)

**Ruta Base:** `/api/product`

### 1. Crear Producto
```
POST /api/product
```

**Body (JSON):**
```json
{
  "name": "string (requerido)",
  "description": "string (opcional)",
  "barcode": "string (opcional)",
  "unitPrice": "decimal (requerido, ej: 99.99)"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "id": "guid",
  "name": "string",
  "description": "string",
  "barcode": "string",
  "unitPrice": "decimal"
}
```

---

### 2. Obtener Producto por ID
```
GET /api/product/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del producto

**Respuesta exitosa (200 OK):**
```json
{
  "id": "guid",
  "name": "string",
  "description": "string",
  "barcode": "string",
  "unitPrice": "decimal"
}
```

---

### 3. Obtener Todos los Productos
```
GET /api/product
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "guid",
    "name": "string",
    "description": "string",
    "barcode": "string",
    "unitPrice": "decimal"
  }
]
```

---

### 4. Actualizar Producto
```
PUT /api/product/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del producto a actualizar

**Body (JSON):**
```json
{
  "id": "guid (debe coincidir con el de la ruta)",
  "name": "string (requerido)",
  "description": "string (opcional)",
  "barcode": "string (opcional)",
  "unitPrice": "decimal (requerido)"
}
```

**Respuesta exitosa (204 No Content):** Sin contenido

---

### 5. Eliminar Producto
```
DELETE /api/product/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del producto a eliminar

**Respuesta exitosa (204 No Content):** Sin contenido

---

## User (Usuarios)

**Ruta Base:** `/api/user`

### 1. Crear Usuario
```
POST /api/user
```

**Body (JSON):**
```json
{
  "name": "string (requerido)",
  "firstLastname": "string (requerido)",
  "secondLastname": "string (opcional)",
  "email": "string (requerido, único)",
  "password": "string (requerido, será hasheada automáticamente)",
  "phone": "string (opcional)",
  "roleId": "guid (requerido, debe existir en la tabla de roles)"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "id": "guid",
  "name": "string",
  "firstLastname": "string",
  "secondLastname": "string",
  "email": "string",
  "phone": "string",
  "role": {
    "id": "guid",
    "name": "string"
  }
}
```

---

### 2. Obtener Usuario por ID
```
GET /api/user/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del usuario

**Respuesta exitosa (200 OK):**
```json
{
  "id": "guid",
  "name": "string",
  "firstLastname": "string",
  "secondLastname": "string",
  "email": "string",
  "phone": "string",
  "role": {
    "id": "guid",
    "name": "string"
  }
}
```

---

### 3. Obtener Todos los Usuarios
```
GET /api/user
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "guid",
    "name": "string",
    "firstLastname": "string",
    "secondLastname": "string",
    "email": "string",
    "phone": "string",
    "role": {
      "id": "guid",
      "name": "string"
    }
  }
]
```

---

### 4. Buscar Usuarios
```
GET /api/user/search?term={term}
```

**Parámetros:**
- `term` (string, query, requerido): Término de búsqueda. Debe tener al menos 3 caracteres. Busca en nombre, primer apellido y segundo apellido.

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "guid",
    "name": "string",
    "firstLastname": "string",
    "secondLastname": "string",
    "email": "string",
    "phone": "string",
    "role": {
      "id": "guid",
      "name": "string"
    }
  }
]
```

**Respuesta de error (400 Bad Request):**
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Bad Request",
  "status": 400,
  "detail": "El término de búsqueda debe tener al menos 3 caracteres."
}
```

---

### 5. Actualizar Usuario
```
PUT /api/user/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del usuario a actualizar

**Body (JSON):**
```json
{
  "id": "guid (debe coincidir con el de la ruta)",
  "name": "string (requerido)",
  "firstLastname": "string (requerido)",
  "secondLastname": "string (opcional)",
  "email": "string (requerido)",
  "password": "string (opcional, si se proporciona se actualiza)",
  "phone": "string (opcional)",
  "roleId": "guid (requerido)"
}
```

**Respuesta exitosa (204 No Content):** Sin contenido

---

### 6. Eliminar Usuario
```
DELETE /api/user/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del usuario a eliminar

**Respuesta exitosa (204 No Content):** Sin contenido

---

## Role (Roles)

**Ruta Base:** `/api/role`

### 1. Crear Rol
```
POST /api/role
```

**Body (JSON):**
```json
{
  "name": "string (requerido, único)",
  "description": "string (opcional)"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "id": "guid",
  "name": "string",
  "description": "string"
}
```

---

### 2. Obtener Rol por ID
```
GET /api/role/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del rol

**Respuesta exitosa (200 OK):**
```json
{
  "id": "guid",
  "name": "string",
  "description": "string"
}
```

---

### 3. Obtener Todos los Roles
```
GET /api/role
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "guid",
    "name": "string",
    "description": "string"
  }
]
```

---

### 4. Actualizar Rol
```
PUT /api/role/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del rol a actualizar

**Body (JSON):**
```json
{
  "id": "guid (debe coincidir con el de la ruta)",
  "name": "string (requerido)",
  "description": "string (opcional)"
}
```

**Respuesta exitosa (204 No Content):** Sin contenido

---

### 5. Eliminar Rol
```
DELETE /api/role/{id}
```

**Parámetros:**
- `id` (Guid, route): ID del rol a eliminar

**Respuesta exitosa (204 No Content):** Sin contenido

---

## Sale (Ventas)

**Ruta Base:** `/api/sale`

### 1. Crear Venta
```
POST /api/sale
```

**Body (JSON):**
```json
{
  "customerId": "guid (requerido, debe existir)",
  "userId": "guid (requerido, vendedor que realiza la venta)",
  "items": [
    {
      "productId": "guid (requerido, debe existir)",
      "quantity": "int (requerido, mayor a 0)"
    }
  ]
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "id": "guid",
  "customerId": "guid",
  "customerName": "string",
  "userId": "guid",
  "userName": "string",
  "totalAmount": "decimal",
  "createdAt": "datetime",
  "details": [
    {
      "id": "guid",
      "productId": "guid",
      "productName": "string",
      "quantity": "int",
      "unitPrice": "decimal",
      "total": "decimal"
    }
  ]
}
```

---

### 2. Obtener Venta por ID
```
GET /api/sale/{id}
```

**Parámetros:**
- `id` (Guid, route): ID de la venta

**Respuesta exitosa (200 OK):**
```json
{
  "id": "guid",
  "customerId": "guid",
  "customerName": "string",
  "userId": "guid",
  "userName": "string",
  "totalAmount": "decimal",
  "createdAt": "datetime",
  "details": [
    {
      "id": "guid",
      "productId": "guid",
      "productName": "string",
      "quantity": "int",
      "unitPrice": "decimal",
      "total": "decimal"
    }
  ]
}
```

---

### 3. Obtener Todas las Ventas
```
GET /api/sale
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "guid",
    "customerId": "guid",
    "customerName": "string",
    "userId": "guid",
    "userName": "string",
    "totalAmount": "decimal",
    "createdAt": "datetime",
    "details": [
      {
        "id": "guid",
        "productId": "guid",
        "productName": "string",
        "quantity": "int",
        "unitPrice": "decimal",
        "total": "decimal"
      }
    ]
  }
]
```

---

## Inventory (Inventario)

**Ruta Base:** `/api/inventory`

### 1. Ajustar Stock
```
POST /api/inventory/adjust
```

**Body (JSON):**
```json
{
  "productId": "guid (requerido, debe existir)",
  "quantity": "int (requerido)",
  "operation": "int (requerido: 0 = Add, 1 = Set)"
}
```

**Operaciones:**
- `0 (Add)`: Agrega la cantidad especificada al stock actual
- `1 (Set)`: Establece el stock al valor especificado

**Respuesta exitosa (200 OK):**
```json
{
  "id": "guid",
  "productId": "guid",
  "productName": "string",
  "quantity": "int",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### 2. Obtener Inventario por Producto
```
GET /api/inventory/product/{productId}
```

**Parámetros:**
- `productId` (Guid, route): ID del producto

**Respuesta exitosa (200 OK):**
```json
{
  "id": "guid",
  "productId": "guid",
  "productName": "string",
  "quantity": "int",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### 3. Obtener Todo el Inventario
```
GET /api/inventory
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "guid",
    "productId": "guid",
    "productName": "string",
    "quantity": "int",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

---

## Respuestas de Error

Todos los endpoints siguen el mismo patrón de respuestas de error:

### Códigos de Estado HTTP

- **200 OK**: Solicitud exitosa (GET)
- **201 Created**: Recurso creado exitosamente (POST)
- **204 No Content**: Actualización o eliminación exitosa
- **400 Bad Request**: Datos inválidos o validación fallida
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: email o nombre duplicado)
- **500 Internal Server Error**: Error no manejado en el servidor

### Formato de Error

Cuando ocurre un error, la respuesta incluye:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Bad Request",
  "status": 400,
  "detail": "Mensaje descriptivo del error"
}
```

---

## Notas Importantes

### Formato de Datos

- **Guid**: Formato estándar UUID (ej: `"550e8400-e29b-41d4-a716-446655440000"`)
- **DateTime**: Formato ISO 8601 (ej: `"2024-01-15T10:30:00Z"`)
- **Decimal**: Formato numérico con punto decimal (ej: `99.99`)

### Soft Delete

Todos los endpoints DELETE realizan **soft delete** (eliminación lógica):
- Los registros NO se eliminan físicamente de la base de datos
- Se marca el campo `DeletedAt` con la fecha de eliminación
- Los registros eliminados no aparecen en los listados GET

### Validaciones Comunes

- Los campos marcados como **"requerido"** deben estar presentes en el body
- Los emails deben tener formato válido
- Los campos `Id` en el body de PUT deben coincidir con el `id` de la ruta
- Los IDs de relaciones (customerId, userId, roleId, productId) deben existir en la base de datos

### Headers Recomendados

```
Content-Type: application/json
Accept: application/json
```

### Características de la Arquitectura

- **CQRS Pattern**: Separación de Commands (POST, PUT, DELETE) y Queries (GET)
- **Mediator Pattern**: Todas las operaciones pasan por un mediador central
- **Result Pattern**: Respuestas estandarizadas con manejo de errores
- **Clean Architecture**: Separación de capas (Domain, Application, Infrastructure, Web.API)

---

## Ejemplos de Uso

### Crear un Cliente
```bash
curl -X POST http://localhost:5000/api/customer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "firstLastname": "Pérez",
    "secondLastname": "García",
    "phone": "1234567890",
    "email": "juan.perez@email.com",
    "birthDate": "1990-01-15T00:00:00Z"
  }'
```

### Obtener Todos los Productos
```bash
curl -X GET http://localhost:5000/api/product \
  -H "Accept: application/json"
```

### Crear una Venta
```bash
curl -X POST http://localhost:5000/api/sale \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "660e8400-e29b-41d4-a716-446655440001",
    "items": [
      {
        "productId": "770e8400-e29b-41d4-a716-446655440002",
        "quantity": 2
      },
      {
        "productId": "880e8400-e29b-41d4-a716-446655440003",
        "quantity": 1
      }
    ]
  }'
```

### Ajustar Inventario (Agregar Stock)
```bash
curl -X POST http://localhost:5000/api/inventory/adjust \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "770e8400-e29b-41d4-a716-446655440002",
    "quantity": 50,
    "operation": 0
  }'
```

---

**Versión:** 1.0
**Fecha de Actualización:** Febrero 2026
**Backend:** .NET 10 / C# 13 con Clean Architecture
