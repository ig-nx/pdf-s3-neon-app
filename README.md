# MVP para Subir PDFs a la Nube (Fullstack)

Proyecto realizado en conjunto con el curso Bootcamp 2026 IA Generativa, LLM Apps, Agentes IA, Cursor AI, impartido por el instructor Julio Colomer.

Este proyecto es un MVP fullstack para subir archivos PDF a la nube y gestionarlos desde una interfaz web. Permite cargar, listar, renombrar, seleccionar, filtrar, abrir y eliminar documentos.

## Tecnologias

- Frontend: Next.js (React)
- Backend: FastAPI (Python)
- Base de datos: Neon Postgres
- Almacenamiento de archivos: Cloudflare R2 (API compatible con S3)

## Arquitectura (resumen)

- El frontend consume una API REST y muestra la biblioteca de PDFs.
- El backend recibe el archivo PDF, lo sube a R2 y guarda metadatos en Postgres (nombre, URL, selected).

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

### 2) Frontend

Desde `002-pdf-vercel-frontend/pdf-app`:

```bash
npm install
npm run dev
```

App: `http://localhost:3000`

Nota Windows: si tu PowerShell bloquea scripts (`npm.ps1`), puedes usar `npm.cmd` en lugar de `npm`.

## Despliegue (alto nivel)

- Frontend: Vercel (setear `NEXT_PUBLIC_API_URL`).
- Backend: cualquier hosting que ejecute FastAPI (VPS, container, etc) seteando variables `.env`.
