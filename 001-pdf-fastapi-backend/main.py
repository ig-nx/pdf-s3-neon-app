from dotenv import load_dotenv
load_dotenv()

from functools import lru_cache
from typing import Union

from fastapi import FastAPI, Depends
from fastapi.responses import PlainTextResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware


# routers: comment out next line till create them
from routers import pdfs

import config

app = FastAPI()

# router: comment out next line till create it
app.include_router(pdfs.router) # Este es el router para manejar los endpoints relacionados con los PDFs. Asegúrate de crear el archivo routers/pdfs.py y definir el router allí. Esto hara que todos los endpoints definidos en routers/pdfs.py estén disponibles bajo el prefijo /pdfs, por ejemplo, GET /pdfs para obtener todos los PDFs, POST /pdfs para crear un nuevo PDF, etc.



# Esto es para permitir que el frontend, que probablemente esté corriendo en un puerto diferente (como localhost:3000), pueda hacer solicitudes a este backend sin ser bloqueado por el navegador debido a políticas de CORS. En producción, deberías restringir esto a los dominios específicos que necesiten acceder a tu API. Por ejemplo:
#origins = [
#    "http://localhost:3000",
#    "https://todo-frontend-khaki.vercel.app/",
#]

# CORS configuration, needed for frontend development
# Esto es para permitir que el frontend, que probablemente esté corriendo en un puerto diferente (como localhost:3000), pueda hacer solicitudes a este backend sin ser bloqueado por el navegador debido a políticas de CORS. En producción, deberías restringir esto a los dominios específicos que necesiten acceder a tu API. Por ejemplo: 
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["https://tu-frontend.vercel.app"], o usar domains específicos en lugar de *, para mejorar la seguridad en producción. por ejemplo en un vps o en un hosting propio, no es recomendable usar *, sino especificar los dominios que pueden acceder a la API. no api publica, no frontend publico, sino frontend privado, entonces se puede usar el dominio específico del frontend privado.
#     allow_credentials=True, # allow_credentials=True es para permitir el envío de cookies o encabezados de autenticación, pero en producción podrías querer establecer esto en False si no necesitas esta funcionalidad.
#     allow_methods=["*"], * es para permitir todos los métodos HTTP (GET, POST, PUT, DELETE, etc.), pero en producción podrías querer restringir esto a solo los métodos que realmente necesitas.
#     allow_headers=["*"], es * para permitir todos los headers, pero en producción podrías querer restringir esto a solo los headers que realmente necesitas.
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://s3-pdf.restak.cl"], # En desarrollo, puedes permitir localhost:3000 para el frontend, pero en producción deberías restringir esto a los dominios específicos que necesiten acceder a tu API. Por ejemplo, si tu frontend está desplegado en Vercel, podrías usar el dominio específico de tu frontend en lugar de *, para mejorar la seguridad.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# global http exception handler, to handle errors
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    print(f"{repr(exc)}")
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)

# to use the settings
@lru_cache()
def get_settings():
    return config.Settings()


@app.get("/")
def read_root(settings: config.Settings = Depends(get_settings)):
    # print the app_name configuration
    print(settings.app_name)
    return "Hola mundo desde FastAPI! Esta es la raíz de la API. Puedes acceder a los endpoints relacionados con los PDFs en /pdfs y a la documentación automática de la API en /docs. ¡Explora y disfruta usando esta API para manejar tus PDFs!"


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}