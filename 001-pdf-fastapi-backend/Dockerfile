# Usamos una imagen base de Python 3.11 slim para mantener la imagen ligera.
FROM python:3.11-slim 

# Esto es para evitar problemas con la instalación de paquetes que requieren compilación.
WORKDIR /app

# Establecemos variables de entorno para mejorar el rendimiento y evitar problemas con la escritura de bytecode.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Instalamos las dependencias necesarias para la aplicación.    
COPY requirements.txt .
# Usamos --no-cache-dir para evitar que pip almacene en caché los paquetes descargados, lo que reduce el tamaño de la imagen.
RUN pip install --no-cache-dir -r requirements.txt

# Copy only what the app needs (avoid venv/.env/node caches in build context).
# Esto asegura que solo se copien los archivos necesarios para la aplicación, evitando archivos innecesarios que podrían aumentar el tamaño de la imagen.
COPY alembic.ini .
COPY alembic ./alembic
COPY routers ./routers
COPY *.py ./

# Exponemos el puerto 8000 para que la aplicación sea accesible desde fuera del contenedor.
EXPOSE 8000 

# Comando para ejecutar la aplicación usando Uvicorn, que es un servidor ASGI recomendado para aplicaciones FastAPI.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

