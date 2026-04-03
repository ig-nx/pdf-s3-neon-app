# MVP para Subir PDFs a la Nube (Fullstack)

Proyecto realizado en conjunto con el curso Bootcamp 2026 IA Generativa, LLM Apps, Agentes IA, Cursor AI, impartido por el instructor Julio Colomer.

Este proyecto es un MVP fullstack para subir archivos PDF a la nube y gestionarlos a traves de una API REST y una interfaz web. Permite cargar, listar, renombrar, seleccionar, filtrar, abrir y eliminar documentos.

## Enlaces rapidos

- Docker Compose: [docker-compose.yml](./docker-compose.yml)
- Backend (FastAPI): [001-pdf-fastapi-backend/](./001-pdf-fastapi-backend)
- Frontend (Next.js): [002-pdf-vercel-frontend/pdf-app/](./002-pdf-vercel-frontend/pdf-app)

## Tecnologias

- Frontend: Next.js (React)
- Backend: FastAPI (Python)
- Base de datos: Neon Postgres
- Almacenamiento de archivos: Cloudflare R2 (API compatible con S3)

## Arquitectura (resumen)

- El frontend consume una API REST y muestra la biblioteca de PDFs.
- La API del backend recibe el archivo PDF, lo sube a R2 y guarda metadatos en Postgres (nombre, URL, selected).

## Objetivo del MVP

Este MVP sirve como ejemplo de un patron escalable para manejo de archivos en la nube: los PDFs viven en un almacenamiento compatible con S3 (Cloudflare R2) y la aplicacion los administra via una API REST, guardando solo metadatos en Postgres (Neon).

## Limitaciones del MVP (por costos)

- Maximo 5 PDFs cargados (limite global).
- Maximo 1 MB por PDF.
- Si ya hay 5 PDFs, se debe eliminar 1 para subir otro.

## Creditos

- Instructor: Julio Colomer
- Repositorio base / referencia del instructor: https://github.com/AI-LLM-Bootcamp/1019-pdf-app-fastapi-vercel-fullstack

## Requisitos

- Node.js 18+ (recomendado 20+)
- Python 3.11+
- Credenciales de Neon (DATABASE_URL)
- Credenciales de Cloudflare R2

## Configuracion

### Backend (FastAPI)

Crear un archivo `001-pdf-fastapi-backend/.env` con:

```bash
DATABASE_URL="postgresql://..."
R2_ACCESS_KEY="..."
R2_SECRET_KEY="..."
R2_BUCKET="..."
R2_ENDPOINT="https://<accountid>.r2.cloudflarestorage.com"
```

Nota: actualmente la URL publica del PDF se arma en `001-pdf-fastapi-backend/crud.py`. Si usas un dominio publico distinto para tu bucket, ajusta esa base URL.

### Frontend (Next.js)

Crear un archivo `002-pdf-vercel-frontend/pdf-app/.env.local` con:

```bash
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

Para Docker Compose (VPS o local), puedes crear un `.env` en la raiz (mismo nivel que `docker-compose.yml`) con:

```bash
NEXT_PUBLIC_API_URL="http://127.0.0.1:8001"
```

## Ejecutar en local

### 1) Backend

Desde `001-pdf-fastapi-backend`:

```bash
python -m venv .venv
```

Activar entorno:

- Windows (PowerShell): `.\.venv\Scripts\Activate.ps1`
- Windows (CMD): `.\.venv\Scripts\activate.bat`
- macOS/Linux: `source .venv/bin/activate`

Instalar dependencias y ejecutar:

```bash
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API: `http://localhost:8000`
Docs (Swagger): `http://localhost:8000/docs`

### 2) Frontend

Desde `002-pdf-vercel-frontend/pdf-app`:

```bash
npm install
npm run dev
```

App: `http://localhost:3000`

Nota Windows: si tu PowerShell bloquea scripts (`npm.ps1`), puedes usar `npm.cmd` en lugar de `npm`.

## Despliegue (alto nivel)

- Docker Compose: `docker compose up -d --build`
- Frontend (alternativa): Vercel (setear `NEXT_PUBLIC_API_URL`).
- Backend: cualquier hosting que ejecute FastAPI (VPS, container, etc) seteando variables `.env`.

## API (URLs y endpoints)

URLs en desarrollo local:

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- App: `http://localhost:3000`

URLs con Docker Compose (por defecto, bind a localhost):

- API: `http://127.0.0.1:8001`
- App: `http://127.0.0.1:3001`

URLs en produccion (ejemplo con subdominios):

- App: https://s3-pdf.restak.cl
- API: https://api.s3-pdf.restak.cl
- Swagger (bloqueado por seguridad): https://api.s3-pdf.restak.cl/docs

Nota (seguridad):

- En produccion se recomienda bloquear la documentacion (`/docs`, `/redoc`, `/openapi.json`) y dejar la API en modo solo lectura (bloquear `POST/PUT/DELETE`) si es un MVP publico. Esto se puede aplicar en Nginx.

Endpoints principales (FastAPI):

- `GET /` (healthcheck simple)
- `GET /pdfs` (lista PDFs, opcional: `?selected=true|false`)
- `POST /pdfs/upload` (sube un PDF via multipart/form-data)
- `PUT /pdfs/{id}` (actualiza nombre, selected, etc.)
- `DELETE /pdfs/{id}` (elimina el registro y el objeto en R2)
