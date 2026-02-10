# SuperPOS Frontend - Contexto del Proyecto

## Objetivo del Proyecto

**El objetivo principal es aprender e implementar conceptos avanzados de desarrollo de software a través de un proyecto práctico y completo siendo asistido por IA.**

Este proyecto sirve como plataforma de aprendizaje para:

- Arquitecturas modernas de frontend (React 19, TypeScript, Vite)
- Patrones de diseño y mejores prácticas
- Integración con APIs RESTful
- Gestión de estado y formularios
- UI/UX con componentes accesibles
- Desarrollo asistido por IA

## Descripción General del Proyecto

**SuperPOS** es un sistema moderno y completo de Punto de Venta (Point of Sale) basado en web, diseñado para gestionar ventas, inventarios, productos, clientes, usuarios, roles, cortes de caja y devoluciones. Este es el **frontend** de la aplicación, construido con las últimas tecnologías web para ofrecer una experiencia rápida, type-safe y accesible.

---

## Stack Tecnológico

### Core

- **React** (`^19.2.0`) - Framework UI con React Compiler habilitado
- **TypeScript** (`~5.9.3`) - Tipado estático para mayor seguridad
- **Vite** (`^7.2.4`) - Build tool ultrarrápido con HMR

### Styling & UI

- **Tailwind CSS** (`^4.1.18`) - Framework CSS utility-first
- **shadcn/ui** - Sistema de componentes basado en Radix UI
- **Radix UI Primitives** - Componentes accesibles y sin estilos
- **Lucide React** (`^0.562.0`) - Librería de iconos
- **class-variance-authority**, **clsx**, **tailwind-merge** - Gestión de clases CSS
- **tw-animate-css** - Animaciones con Tailwind

### Estado y Datos

- **Zustand** (`5.0.10`) - Gestión de estado global
- **TanStack React Query** (`^5.90.20`) - Gestión de estado del servidor y caché
- **React Hook Form** (`7.71.0`) - Manejo de formularios
- **Zod** (`^4.3.5`) - Validación de esquemas y tipos
- **Axios** (`1.13.2`) - Cliente HTTP

### Routing

- **React Router DOM** (`7.12.0`) - Navegación client-side

### Visualización de Datos

- **Recharts** (`^3.6.0`) - Librería de gráficos

### Notificaciones

- **Sonner** (`^2.0.7`) - Sistema de toast notifications

### Herramientas de Desarrollo

- **ESLint** (`^9.39.1`) con plugins de TypeScript, React Hooks y React Refresh
- **Babel Plugin React Compiler** (`^1.0.0`) - Optimización automática de React
- **TanStack React Query DevTools** (`^5.91.3`) - Herramientas de desarrollo para React Query

---

## Arquitectura del Proyecto

### Paradigma: Feature-First / Modular Architecture

El proyecto sigue una **arquitectura modular orientada a dominios**, donde cada módulo encapsula toda la lógica, componentes, API y modelos relacionados con una funcionalidad específica del negocio.

### Estructura de Directorios Detallada

```
src/
├── modules/                    # ⭐ Corazón de la aplicación - Lógica de negocio por dominio
│   ├── sales/                  # 🛒 Módulo de ventas y POS
│   │   ├── api/
│   │   │   └── saleApi.ts      # API: getAllSales, getSaleById, createSale, downloadTicketPdf, cancelSale
│   │   ├── models/
│   │   │   └── Sale.ts         # Tipos: Sale, SaleDetail, CreateSaleRequest
│   │   ├── pages/
│   │   │   ├── POS.tsx         # Pantalla principal de Punto de Venta
│   │   │   ├── SalesHistory.tsx # Historial de ventas con filtros
│   │   │   └── SaleDetail.tsx  # Detalle de venta con PDF y cancelación
│   │   └── components/
│   │
│   ├── cashRegister/           # 💰 Módulo de Corte de Caja
│   │   ├── api/
│   │   │   └── cashRegisterApi.ts # API: getAllCashRegisters, getCashRegisterById, createCashRegister, downloadCashRegisterReport
│   │   ├── models/
│   │   │   └── CashRegister.ts # Tipos: CashRegister, CreateCashRegisterRequest
│   │   ├── pages/
│   │   │   ├── CashRegisterList.tsx # Lista de cortes de caja
│   │   │   ├── CreateCashRegister.tsx # Crear nuevo corte
│   │   │   └── CashRegisterDetail.tsx # Detalle de corte con PDF
│   │   └── components/
│   │
│   ├── returns/                # 🔄 Módulo de Devoluciones
│   │   ├── api/
│   │   │   └── returnApi.ts    # API: getAllReturns, getReturnById, createReturn, approveReturn, rejectReturn
│   │   ├── models/
│   │   │   └── Return.ts       # Tipos: Return, ReturnItem, ReturnType, ReturnStatus
│   │   ├── pages/
│   │   │   ├── ReturnsList.tsx # Lista de devoluciones con filtros
│   │   │   ├── CreateReturn.tsx # Crear nueva devolución
│   │   │   └── ReturnDetail.tsx # Detalle con aprobación/rechazo
│   │   └── components/
│   │
│   ├── products/               # 📦 Gestión de productos
│   │   ├── productApi.ts
│   │   ├── models/Product.ts
│   │   ├── pages/catalog/
│   │   └── schemes/ProductScheme.ts
│   │
│   ├── customers/              # 👥 Gestión de clientes
│   │   ├── api/customerApi.ts
│   │   ├── models/Customer.ts
│   │   ├── pages/catalog/
│   │   └── schemes/CustomerScheme.ts
│   │
│   ├── users/                  # 👤 Gestión de usuarios
│   │   ├── userApi.ts
│   │   ├── models/User.ts
│   │   ├── pages/catalog/
│   │   └── schemes/UserScheme.ts
│   │
│   ├── roles/                  # 🔐 Gestión de roles/permisos
│   │   ├── api/roleApi.ts
│   │   ├── models/Role.ts
│   │   ├── pages/catalog/
│   │   └── schemes/RoleScheme.ts
│   │
│   └── inventories/            # 📊 Gestión de inventarios
│       ├── api/inventoryApi.ts
│       ├── models/Inventory.ts
│       └── pages/
│
├── components/                 # Componentes reutilizables UI
│   ├── elements/               # Componentes atómicos (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx        # ✨ Nuevo
│   │   ├── label.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── command.tsx
│   │   ├── popover.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── tabs.tsx
│   │   └── tooltip.tsx
│   │
│   ├── widgets/                # Componentes complejos reutilizables
│   │   ├── ConfirmDialog.tsx   # Diálogo de confirmación
│   │   ├── DataTable.tsx       # Tabla de datos genérica con onRowClick
│   │   ├── FormSheet.tsx       # Sheet lateral para formularios
│   │   ├── PageHeader.tsx      # Encabezado de página
│   │   ├── SearchableSelect.tsx # Select con búsqueda
│   │   ├── StatCard.tsx        # Tarjeta de estadísticas
│   │   └── TableToolbar.tsx    # Barra de herramientas de tabla
│   │
│   ├── layouts/                # Layouts de aplicación
│   │   ├── index.ts
│   │   └── mainLayout/
│   │       ├── MainLayout.tsx
│   │       └── components/
│   │           └── Sidebar.tsx
│   │
│   └── providers/              # Context Providers
│       └── theme-provider.tsx  # Proveedor de temas (dark/light)
│
├── config/                     # Configuración global
│   ├── httpClient/             # Cliente HTTP centralizado
│   │   ├── HttpClient.ts       # Custom hook useHttpClient con AbortController
│   │   ├── Interceptors.ts     # Interceptores de Axios
│   │   └── index.ts
│   │
│   ├── router/                 # Configuración de rutas
│   │   ├── Router.tsx          # Componente de router con todas las rutas
│   │   ├── Routes.ts           # Definición de rutas
│   │   └── index.ts
│   │
│   ├── queryClient.ts          # Configuración de React Query
│   ├── stores/                 # Stores globales de Zustand
│   └── material/               # Utilidades de Material/UI
│       └── utils.ts
│
├── shared/                     # Código compartido transversal
│   └── hooks/
│       └── use-mobile.ts       # Hook para detectar dispositivos móviles
│
├── main.tsx                    # Punto de entrada de la aplicación
└── index.css                   # Estilos CSS globales
```

---

## Convenciones de Desarrollo

### Aliases de Path (definidos en `tsconfig.json`)

```typescript
"@/*": "./src/*"
"@components/*": "./src/components/*"
"@config/*": "./src/config/*"
"@features/*": "./src/features/*"
"@shared/*": "./src/shared/*"
"@styles/*": "./src/styles/*"
"@modules/*": "./src/modules/*"
```

### Patrones de Código

#### 1. **Módulos de Dominio**

Cada módulo sigue esta estructura:

```
modules/{domain}/
  ├── api/            # Lógica de llamadas API
  ├── components/     # Componentes específicos del dominio
  ├── models/         # Tipos TypeScript
  ├── pages/          # Vistas/páginas
  └── schemes/        # Validaciones Zod (opcional)
```

#### 2. **Custom Hooks para API**

Ejemplo: `useCustomerApi()`, `useProductApi()`, `useSaleApi()`, `useCashRegisterApi()`, `useReturnApi()`

- Utilizan `useHttpClient()` internamente
- Encapsulan lógica de llamadas HTTP
- Retornan funciones para operaciones CRUD
- Usan `useCallback` para memoización

#### 3. **HTTP Client Custom**

- Hook `useHttpClient()` que retorna métodos `get`, `post`, `put`, `remove`
- Gestión automática de `AbortController` para cancelación de requests
- URL base configurada via `VITE_API_URL`
- Interceptores de Axios centralizados

#### 4. **DataTable con onRowClick**

```typescript
<DataTable
    columns={columns}
    data={items}
    onRowClick={(item) => navigate(`/detail/${item.id}`)}
/>
```

#### 5. **Descarga de PDFs**

Patrón para descargar archivos PDF desde el backend:

```typescript
const response = await fetch(`${import.meta.env.VITE_API_URL}/endpoint`, {
  method: "GET",
  headers: { Accept: "application/pdf" },
});
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
// Trigger download...
```

---

## Funcionalidades Principales

### 1. **Punto de Venta (POS)** ✅

- **Ubicación**: `src/modules/sales/pages/POS.tsx`
- Gestión de carrito de compras
- Selección de productos con búsqueda
- Asignación de cliente y vendedor
- Verificación de stock en tiempo real
- Procesamiento de ventas

### 2. **Historial de Ventas** ✅

- **Ubicación**: `src/modules/sales/pages/SalesHistory.tsx`
- Visualización de todas las ventas
- Columna de estado (Active/Cancelled)
- Navegación a detalle mediante click en fila
- Estadísticas de ventas totales

### 3. **Detalle de Venta** ✅

- **Ubicación**: `src/modules/sales/pages/SaleDetail.tsx`
- Información completa de la venta
- Descarga de ticket PDF
- Cancelación de venta con razón
- Indicador visual de ventas canceladas
- Restauración automática de inventario al cancelar

### 4. **Gestión de Corte de Caja** ✅

- **Lista**: `src/modules/cashRegister/pages/CashRegisterList.tsx`
  - Visualización de todos los cortes
  - Estadísticas de ventas y diferencias
  - Navegación a detalle
- **Crear**: `src/modules/cashRegister/pages/CreateCashRegister.tsx`
  - Formulario con validación
  - Selección de usuario (cajero)
  - Fechas de apertura y cierre
  - Cálculo automático de diferencias
  - Vista previa de resultados
- **Detalle**: `src/modules/cashRegister/pages/CashRegisterDetail.tsx`
  - Información general y financiera
  - Estadísticas (transacciones, items, ticket promedio)
  - Descarga de reporte PDF

### 5. **Gestión de Devoluciones** ✅

- **Lista**: `src/modules/returns/pages/ReturnsList.tsx`
  - Visualización de todas las devoluciones
  - Filtros por estado (All, Pending, Approved, Rejected)
  - Badges de estado con colores
  - Navegación a detalle
- **Crear**: `src/modules/returns/pages/CreateReturn.tsx`
  - Formulario de creación
  - Selección de tipo (Refund/Exchange)
  - Razón de devolución
- **Detalle**: `src/modules/returns/pages/ReturnDetail.tsx`
  - Información completa de la devolución
  - Aprobación de devolución (restaura inventario)
  - Rechazo de devolución con razón
  - Alertas visuales según estado

### 6. **Gestión de Productos** ✅

- CRUD completo de productos
- Catálogo con DataTable
- Formularios con validación
- Búsqueda de productos

### 7. **Gestión de Clientes** ✅

- CRUD de clientes
- Validación de datos
- Integración con módulo de ventas

### 8. **Gestión de Usuarios y Roles** ✅

- Administración de usuarios del sistema
- Sistema de roles y permisos
- Asignación de vendedores a ventas

### 9. **Gestión de Inventarios** ✅

- Control de stock de productos
- API para verificar disponibilidad
- Actualización automática al vender/cancelar/devolver

---

## Rutas de la Aplicación

```typescript
/                           # Home (MainLayout)
/products                   # Catálogo de productos
/users                      # Gestión de usuarios
/customers                  # Gestión de clientes
/roles                      # Gestión de roles
/sales                      # Historial de ventas
/sales/detail/:id           # Detalle de venta
/pos                        # Punto de venta
/inventory                  # Gestión de inventario
/cash-register              # Lista de cortes de caja
/cash-register/create       # Crear corte de caja
/cash-register/detail/:id   # Detalle de corte
/returns                    # Lista de devoluciones
/returns/create             # Crear devolución
/returns/detail/:id         # Detalle de devolución
```

---

## Variables de Entorno

El proyecto utiliza variables de entorno de Vite (prefijo `VITE_`):

```env
VITE_API_URL=http://localhost:3000/api  # URL base del backend
```

**Archivo**: `.env` en la raíz del proyecto

---

## Scripts Disponibles

```bash
pnpm dev      # Inicia servidor de desarrollo (http://localhost:5173)
pnpm build    # Construye para producción (TypeScript + Vite)
pnpm lint     # Ejecuta ESLint
pnpm preview  # Previsualiza build de producción
```

---

## Componentes UI Destacados

### Widgets Reutilizables

#### `DataTable<T>`

Tabla genérica con tipos y soporte para click en filas:

```typescript
interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void; // ✨ Nuevo
}
```

#### `SearchableSelect`

Select con búsqueda integrada usando `cmdk`

#### `FormSheet`

Sheet lateral (Radix Dialog) para formularios

#### `ConfirmDialog`

Diálogo de confirmación reutilizable

#### `PageHeader`

Encabezado consistente para páginas

#### `StatCard`

Tarjeta de estadísticas con iconos y variaciones

#### `Textarea`

Componente de textarea con estilos consistentes

---

## Integración con Backend

### Estructura de API Esperada

El frontend espera endpoints REST en formato:

#### Sales

```
GET    /api/Sale
GET    /api/Sale/{id}
POST   /api/Sale
GET    /api/Sale/{id}/ticket          # PDF
POST   /api/Sale/{id}/cancel
```

#### Cash Register

```
GET    /api/CashRegister
GET    /api/CashRegister/{id}
POST   /api/CashRegister
GET    /api/CashRegister/{id}/report  # PDF
```

#### Returns

```
GET    /api/Return
GET    /api/Return/{id}
GET    /api/Return/status/{status}
POST   /api/Return
POST   /api/Return/{id}/approve
POST   /api/Return/{id}/reject
```

Similar para: `/api/Product`, `/api/Customer`, `/api/User`, `/api/Role`, `/api/Inventory`

### Gestión de Errores

- Interceptores de Axios centralizados
- Manejo de cancelación de requests con AbortController
- Toast notifications con Sonner
- Navegación automática en caso de errores críticos

---

## Estado de Implementación

### ✅ Completamente Implementado

- ✅ Arquitectura modular completa
- ✅ Sistema de componentes con shadcn/ui
- ✅ Routing con React Router (todas las rutas configuradas)
- ✅ Cliente HTTP con AbortController
- ✅ Validación de formularios con Zod
- ✅ **Módulo de Ventas** (POS, History, Detail, PDF, Cancellation)
- ✅ **Módulo de Corte de Caja** (List, Create, Detail, PDF Report)
- ✅ **Módulo de Devoluciones** (List, Create, Detail, Approve, Reject)
- ✅ Módulo de Productos (CRUD completo)
- ✅ Módulo de Clientes (CRUD completo)
- ✅ Módulo de Usuarios (CRUD completo)
- ✅ Módulo de Roles (CRUD completo)
- ✅ Módulo de Inventarios
- ✅ DataTable genérica con onRowClick
- ✅ Theme Provider (dark/light mode)
- ✅ Toast notifications (Sonner)
- ✅ Textarea component

### 🚧 Pendiente de Backend

- ⚠️ Campos de cancelación en `GET /api/Sale` (isCancelled, cancelledAt, etc.)
  - Ver: `CLIENT_REQUIREMENT.MD` para detalles

### 📋 Por Implementar (Futuro)

- Tests unitarios y de integración
- Configuración de CI/CD
- Storybook para componentes UI
- Gestión de autenticación/autorización
- PWA capabilities
- Optimización avanzada de rendimiento
- Error boundaries

---

## Mejores Prácticas del Proyecto

1. **Type Safety First**: Todo tipado con TypeScript, evitar `any`
2. **Component Composition**: Reutilizar componentes de shadcn/ui
3. **Feature Modules**: Encapsular lógica por dominio
4. **Custom Hooks**: Abstraer lógica compleja en hooks con `useCallback`
5. **Validation Schemas**: Usar Zod para validación unificada
6. **Path Aliases**: Usar aliases `@/*` para imports limpios
7. **Separation of Concerns**: API, UI, y lógica de negocio separadas
8. **Accessible UI**: Usar Radix UI para accesibilidad garantizada
9. **Performance**: React Compiler habilitado para optimizaciones automáticas
10. **User Feedback**: Toast notifications para todas las acciones importantes
11. **Error Handling**: Try-catch en todas las operaciones async
12. **Null Safety**: Usar optional chaining y nullish coalescing

---

## Consideraciones Especiales

### React Compiler

El proyecto tiene habilitado el **React Compiler** (Babel plugin), que:

- Optimiza automáticamente componentes React
- Reduce necesidad de `useMemo` y `useCallback` manuales
- Puede impactar rendimiento de dev/build (trade-off por optimización runtime)

### Monorepo

El proyecto usa `pnpm-workspace.yaml`, sugiriendo una estructura monorepo o preparación para múltiples paquetes.

### shadcn/ui

Los componentes UI NO son una librería npm, sino archivos copiados al proyecto (`components.json`). Esto permite:

- Personalización total de componentes
- Sin dependencias externas de UI library
- Control completo sobre el código fuente

### PDF Downloads

Los PDFs se descargan usando `fetch` con `Accept: application/pdf` en lugar de usar el httpClient de Axios, para mejor manejo de blobs.

---

## Recursos y Referencias

- [React 19 Docs](https://react.dev)
- [Vite Docs](https://vite.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [React Router](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Zustand](https://zustand-demo.pmnd.rs)
- [TanStack Query](https://tanstack.com/query)
- [Sonner](https://sonner.emilkowal.ski)

---

## Próximos Pasos Sugeridos

1. **Solicitar campos de cancelación al backend** - Ver `CLIENT_REQUIREMENT.MD`
2. **Implementar autenticación** - JWT tokens, protected routes
3. **Agregar tests** - Vitest + React Testing Library
4. **Documentar API contracts** - OpenAPI/Swagger para backend
5. **Implementar error boundaries** - Manejo de errores React
6. **Optimizar bundles** - Code splitting y lazy loading
7. **Agregar analytics** - Tracking de eventos
8. **Preparar para producción** - Configuración de build y deploy
9. **Mejorar UX** - Loading states, skeletons, animaciones
10. **Documentación de componentes** - Storybook o similar

---

**Última actualización**: 10 de febrero de 2026  
**Versión del documento**: 2.0.0  
**Estado del proyecto**: Módulos principales completamente implementados
