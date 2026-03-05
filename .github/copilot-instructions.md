# AI Coding Instructions for Activos Fijos Project

## Architecture Overview
This is a full-stack asset management system with a Django REST API backend and React/TypeScript frontend. The backend uses MSSQL Server and is structured with multiple Django apps (activos, usuarios, mantenimientos, movimientos), though currently only the activos app has implemented views. The frontend uses Vite, Tailwind CSS, and shadcn/ui components, with mock data for development.

## Key Patterns
- **Backend Models**: All models are defined in `backend/activos/models.py` with Spanish field names (e.g., `nombre`, `descripcion`). Use DRF ModelViewSets for CRUD operations.
- **Frontend Components**: Use shadcn/ui components from `src/app/components/ui/`. Forms are controlled components with TypeScript interfaces from `src/app/types/database.ts`.
- **Data Flow**: Frontend currently uses mock data from `src/app/data/mockData.ts`. API calls should target `/api/` endpoints (e.g., `fetch('/api/activos/')`).
- **Authentication**: Implemented via React Context in `src/app/contexts/AuthContext.tsx` with localStorage persistence. Backend auth endpoints not yet implemented.

## Development Workflows
- **Frontend**: Run `npm run dev` from project root. Uses Vite with `@` alias for `src/`.
- **Backend**: `cd backend && python manage.py runserver`. Requires MSSQL Server with connection details in `.env` (see `backend/config/settings.py`).
- **Database**: Uses `mssql-django` with pyodbc. Environment variables: `ACTIVOS_FIJOS` (DB name), `sa` (user), `abc123` (password), `DB_HOST` (server).
- **Building**: `npm run build` for frontend production build.

## Project Conventions
- **Naming**: Spanish for domain terms (activos, mantenimientos), English for technical code.
- **Forms**: Use `ActivoForm.tsx` pattern - controlled inputs, mock data for selects, toast notifications on success.
- **Tabs**: Dashboard uses `Tabs` component with separate tab components in `src/app/components/tabs/`.
- **Mock Data**: Update `src/app/data/mockData.ts` when adding new entities or fields.
- **Backend URLs**: Register new ViewSets in respective app's `urls.py`, include in `config/urls.py` under `/api/`.

## Integration Points
- **External DB**: MSSQL with ODBC Driver 17. Trust server certificate enabled.
- **Dependencies**: Backend requires `pyodbc` and MSSQL driver. Frontend uses Radix UI primitives.
- **Cross-Component**: Auth state shared via Context. Components receive data as props, manage local state for forms.</content>
<parameter name="filePath">c:\Users\Soporte Sistemas\Documents\activos-\.github\copilot-instructions.md