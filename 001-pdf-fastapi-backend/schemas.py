from pydantic import BaseModel
from typing import Optional

# Definición de los modelos de datos para las solicitudes y respuestas de la API
class PDFRequest(BaseModel):
    name: str
    selected: bool
    file: str

# Modelo de respuesta para la API, que incluye un ID generado automáticamente y los mismos campos que la solicitud
class PDFResponse(BaseModel):
    id: int
    name: str
    selected: bool
    file: str

    class Config:
        from_attributes = True # Permite que Pydantic modele a partir de atributos de clase, lo que es útil para convertir objetos ORM a modelos Pydantic.

#  El modelo es utilizado para validar y estructurar los datos que se envían a la API, asegurando que se cumplan los tipos de datos esperados y facilitando la conversión entre objetos ORM y modelos Pydantic.