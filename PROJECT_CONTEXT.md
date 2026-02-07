# SuperPOS Frontend - Contexto del Proyecto

## Descripción General del Proyecto

**SuperPOS** es un sistema moderno de Punto de Venta (Point of Sale) basado en web, diseñado para gestionar ventas, inventarios, productos, clientes, usuarios y roles. Este es el **frontend** de la aplicación, construido con las últimas tecnologías web para ofrecer una experiencia rápida, type-safe y accesible.

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
- **Lucide React** - Librería de iconos
- **class-variance-authority** & **clsx** & **tailwind-merge** - Gestión de clases CSS
- **tw-animate-css** - Animaciones con Tailwind

### Estado y Datos
- **Zustand** (`5.0.10`) - Gestión de estado global
- **React Hook Form** (`7.71.0`) - Manejo de formularios
- **Zod** (`^4.3.5`) - Validación de esquemas y tipos
- **Axios** (`1.13.2`) - Cliente HTTP

### Routing
- **React Router DOM** (`7.12.0`) - Navegación client-side

### Visualización de Datos
- **Recharts** (`^3.6.0`) - Librería de gráficos

### Herramientas de Desarrollo
- **ESLint** (`^9.39.1`) con `typescript-eslint`, `react-hooks`, y `react-refresh` plugins
- **Babel Plugin React Compiler** (`^1.0.0`) - Optimización automática de React

---

## Arquitectura del Proyecto

### Paradigma: Feature-First / Modular Architecture

El proyecto sigue una **arquitectura modular orientada a dominios**, donde cada módulo encapsula toda la lógica, componentes, API y modelos relacionados con una funcionalidad específica del negocio.

### Estructura de Directorios Detallada

```
src/
├── modules/                    # ⭐ Corazón de la aplicación - Lógica de negocio por dominio
│   ├── customers/              # Gestión de clientes
│   │   ├── api/                # Llamadas API específicas de clientes
│   │   │   └── customerApi.ts
│   │   ├── components/         # Componentes UI específicos de clientes
│   │   ├── models/             # Tipos TypeScript para Customer
│   │   │   └── Customer.ts
│   │   ├── pages/              # Páginas/vistas de clientes
│   │   │   └── catalog/
│   │   │       ├── CustomerCatalog.tsx
│   │   │       ├── customerCatalogHandler.tsx
│   │   │       └── components/
│   │   │           ├── CustomerColumns.tsx
│   │   │           └── CustomerForm.tsx
│   │   └── schemes/            # Esquemas de validación Zod
│   │       └── CustomerScheme.ts
│   │
│   ├── products/               # Gestión de productos
│   │   ├── productApi.ts
│   │   ├── models/Product.ts
│   │   ├── pages/catalog/
│   │   └── schemes/ProductScheme.ts
│   │
│   ├── inventories/            # Gestión de inventarios
│   │   ├── api/inventoryApi.ts
│   │   ├── models/Inventory.ts
│   │   └── pages/crud/
│   │
│   ├── users/                  # Gestión de usuarios
│   │   ├── userApi.ts
│   │   ├── models/User.ts
│   │   ├── pages/catalog/
│   │   └── schemes/UserScheme.ts
│   │
│   ├── roles/                  # Gestión de roles/permisos
│   │   ├── api/roleApi.ts
│   │   ├── models/Role.ts
│   │   ├── pages/catalog/
│   │   └── schemes/RoleScheme.ts
│   │
│   └── sales/                  # Módulo de ventas y POS
│       ├── api/saleApi.ts
│       ├── models/Sale.ts
│       ├── components/
│       └── pages/
│           ├── POS.tsx         # Pantalla principal de Punto de Venta
│           └── SalesHistory.tsx
│
├── components/                 # Componentes reutilizables UI
│   ├── elements/               # Componentes atómicos (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── command.tsx
│   │   ├── popover.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   └── tooltip.tsx
│   │
│   ├── widgets/                # Componentes complejos reutilizables
│   │   ├── ConfirmDialog.tsx   # Diálogo de confirmación
│   │   ├── DataTable.tsx       # Tabla de datos genérica
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
│   │   ├── Router.tsx          # Componente de router
│   │   ├── Routes.ts           # Definición de rutas
│   │   └── index.ts
│   │
│   ├── stores/                 # Stores globales de Zustand (vacío actualmente)
│   │
│   └── material/               # Utilidades de Material/UI
│       └── utils.ts
│
├── shared/                     # Código compartido transversal
│   ├── consts/                 # Constantes globales
│   ├── helpers/                # Funciones helper
│   ├── hooks/                  # Hooks personalizados
│   │   └── use-mobile.ts       # Hook para detectar dispositivos móviles
│   └── models/                 # Tipos/interfaces compartidos
│
├── styles/                     # Estilos globales
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
  └── schemes/        # Validaciones Zod
```

#### 2. **Custom Hooks para API**
Ejemplo: `useCustomerApi()`, `useProductApi()`, `useSaleApi()`
- Utilizan `useHttpClient()` internamente
- Encapsulan lógica de llamadas HTTP
- Retornan funciones para operaciones CRUD

#### 3. **Validación con Zod**
```typescript
export const customerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").optional(),
});
export type CustomerFormValues = z.infer<typeof customerSchema>;
```

#### 4. **Formularios con React Hook Form**
Integrados con `@hookform/resolvers` y Zod para validación

#### 5. **HTTP Client Custom**
- Hook `useHttpClient()` que retorna métodos `get`, `post`, `put`, `patch`, `delete`
- Gestión automática de `AbortController` para cancelación de requests
- URL base configurada via `VITE_API_URL`
- Interceptores de Axios centralizados

#### 6. **Routing Type-Safe**
```typescript
export const Routes = {
    Home: "/",
    Products: "/products",
    POS: "/sales/pos",
    // ...
} as const;
```

---

## Funcionalidades Principales

### 1. **Punto de Venta (POS)**
- Ubicación: [`src/modules/sales/pages/POS.tsx`](src/modules/sales/pages/POS.tsx)
- Gestión de carrito de compras
- Selección de productos con búsqueda
- Asignación de cliente y vendedor
- Verificación de stock en tiempo real
- Procesamiento de ventas

### 2. **Gestión de Inventarios**
- Control de stock de productos
- API para verificar disponibilidad

### 3. **Gestión de Productos**
- CRUD completo de productos
- Catálogo con DataTable
- Formularios con validación

### 4. **Gestión de Clientes**
- CRUD de clientes
- Validación de datos (nombre, email, teléfono)
- Integración con módulo de ventas

### 5. **Gestión de Usuarios y Roles**
- Administración de usuarios del sistema
- Sistema de roles y permisos
- Asignación de vendedores a ventas

### 6. **Historial de Ventas**
- Visualización de ventas realizadas
- Filtros y búsqueda

---

## Variables de Entorno

El proyecto utiliza variables de entorno de Vite (prefijo `VITE_`):

```env
VITE_API_URL=http://localhost:3000/api  # URL base del backend
```

**Nota**: No existe archivo `.env` en el repositorio actual. Debe crearse basándose en las necesidades del proyecto.

---

## Scripts Disponibles

```bash
pnpm dev      # Inicia servidor de desarrollo (http://localhost:5173)
pnpm build    # Construye para producción (TypeScript + Vite)
pnpm lint     # Ejecuta ESLint
pnpm preview  # Previsualiza build de producción
```

---

## Herramientas y Configuración

### ESLint
- Configuración moderna con formato flat config (`eslint.config.js`)
- Plugins: `@typescript-eslint`, `react-hooks`, `react-refresh`
- Reglas estrictas para React y TypeScript

### TypeScript
- Configuración dividida:
  - `tsconfig.json` - Config principal
  - `tsconfig.app.json` - Config de aplicación
  - `tsconfig.node.json` - Config de Node (Vite)
- Modo estricto habilitado
- Path aliases configurados

### Vite
- Plugin React con Babel
- React Compiler habilitado (optimización automática)
- Tailwind CSS via `@tailwindcss/vite`

### Tailwind CSS
- Versión 4.1.18
- Integración con shadcn/ui
- Utilidades de animación personalizadas

---

## Componentes UI Destacados

### Widgets Reutilizables

#### `DataTable<T>`
Tabla genérica con tipos:
```typescript
interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
    className?: string;
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

---

## Integración con Backend

### Estructura de API Esperada

El frontend espera endpoints REST en formato:
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
```

Similar para: `/api/customers`, `/api/users`, `/api/roles`, `/api/sales`, `/api/inventories`

### Gestión de Errores
- Interceptores de Axios centralizados
- Manejo de cancelación de requests
- Timeouts configurables

---

## Estado de Implementación

### ✅ Implementado
- Arquitectura modular completa
- Sistema de componentes con shadcn/ui
- Routing con React Router
- Cliente HTTP con AbortController
- Validación de formularios con Zod
- Módulos: Products, Customers, Users, Roles, Sales, Inventories
- Pantalla POS funcional
- DataTable genérica
- Theme Provider (dark/light mode)

### 🚧 En Progreso / Por Implementar
- Stores globales de Zustand (directorio vacío)
- Features compartidas
- Tests unitarios y de integración
- Configuración de CI/CD
- Documentación de componentes
- Storybook para componentes UI
- Gestión de autenticación/autorización
- Manejo avanzado de errores y toasts
- Optimización de rendimiento
- PWA capabilities

---

## Mejores Prácticas del Proyecto

1. **Type Safety First**: Todo tipado con TypeScript, evitar `any`
2. **Component Composition**: Reutilizar componentes de shadcn/ui
3. **Feature Modules**: Encapsular lógica por dominio
4. **Custom Hooks**: Abstraer lógica compleja en hooks
5. **Validation Schemas**: Usar Zod para validación unificada
6. **Path Aliases**: Usar aliases `@/*` para imports limpios
7. **Separation of Concerns**: API, UI, y lógica de negocio separadas
8. **Accessible UI**: Usar Radix UI para accesibilidad garantizada
9. **Performance**: React Compiler habilitado para optimizaciones automáticas
10. **Code Style**: Seguir convenciones de ESLint y Prettier

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

---

## Próximos Pasos Sugeridos

1. **Configurar variables de entorno** - Crear archivo `.env.example`
2. **Implementar autenticación** - JWT tokens, protected routes
3. **Agregar tests** - Vitest + React Testing Library
4. **Documentar API contracts** - OpenAPI/Swagger para backend
5. **Implementar toast notifications** - Para feedback de usuario
6. **Agregar loading states** - Skeletons y spinners
7. **Optimizar bundles** - Code splitting y lazy loading
8. **Implementar error boundaries** - Manejo de errores React
9. **Agregar analytics** - Tracking de eventos
10. **Preparar para producción** - Configuración de build y deploy

---

**Última actualización**: 6 de febrero de 2026
**Versión del documento**: 1.0.0
