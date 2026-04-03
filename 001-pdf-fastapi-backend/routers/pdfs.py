from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
import schemas
import crud
from database import SessionLocal
from uuid import uuid4
from botocore.exceptions import NoCredentialsError, BotoCoreError
from sqlalchemy.exc import SQLAlchemyError
import os


router = APIRouter(prefix="/pdfs")

MAX_PDFS = 5
MAX_PDF_BYTES = 1 * 1024 * 1024  # 1 MB

# Este es un ejemplo de cómo podrías manejar la conexión a la base de datos en cada endpoint. En un proyecto real, podrías querer usar un enfoque más sofisticado para manejar las sesiones de la base de datos, como un middleware o un contexto de aplicación.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints CRUD para PDFs

# Crear un nuevo PDF, ya sea subiendo un archivo o proporcionando un enlace
@router.post("", response_model=schemas.PDFResponse, status_code=status.HTTP_201_CREATED)
def create_pdf(pdf: schemas.PDFRequest, db: Session = Depends(get_db)):
    return crud.create_pdf(db, pdf)

# Post para subir un PDF directamente como archivo
# @router.post("/upload", response_model=schemas.PDFResponse, status_code=status.HTTP_201_CREATED)
# def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
#     file_name = f"{uuid4()}-{file.filename}"
#     return crud.upload_pdf(db, file, file_name)

@router.post("/upload", response_model=schemas.PDFResponse)
def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("application/pdf"):
            raise HTTPException(status_code=400, detail={"code": "INVALID_TYPE"})

        # Limit total PDFs for MVP cost control
        if crud.count_pdfs(db) >= MAX_PDFS:
            raise HTTPException(status_code=400, detail={"code": "LIMIT_REACHED", "max_files": MAX_PDFS})
        
        # Check file size
        file_size = getattr(file, "size", None)
        if file_size is None:
            try:
                file.file.seek(0, os.SEEK_END)
                file_size = file.file.tell()
                file.file.seek(0)
            except Exception:
                file_size = None

        if file_size is not None and file_size > MAX_PDF_BYTES:
            raise HTTPException(
                status_code=400,
                detail={"code": "FILE_TOO_LARGE", "max_bytes": MAX_PDF_BYTES},
            )
        
        file_name = f"{uuid4()}-{file.filename}"
        return crud.upload_pdf(db, file, file_name)
        
    except HTTPException:
        raise
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials missing")
    except BotoCoreError as e:
        raise HTTPException(status_code=500, detail=f"AWS error: {str(e)}")
    except SQLAlchemyError:
        # Cleanup: delete file from S3 if database fails
        # (Advanced topic - cleanup strategies)
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Upload failed")


# Get todos los PDFs, con opción de filtrar por seleccionados o no seleccionados
@router.get("", response_model=List[schemas.PDFResponse])
def get_pdfs(selected: bool = None, db: Session = Depends(get_db)):
    return crud.read_pdfs(db, selected)

@router.get("/{id}", response_model=schemas.PDFResponse)
def get_pdf_by_id(id: int, db: Session = Depends(get_db)):
    pdf = crud.read_pdf(db, id)
    if pdf is None:
        raise HTTPException(status_code=404, detail="PDF not found")
    return pdf

@router.put("/{id}", response_model=schemas.PDFResponse)
def update_pdf(id: int, pdf: schemas.PDFRequest, db: Session = Depends(get_db)):
    updated_pdf = crud.update_pdf(db, id, pdf)
    if updated_pdf is None:
        raise HTTPException(status_code=404, detail="PDF not found")
    return updated_pdf

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_pdf(id: int, db: Session = Depends(get_db)):
    if not crud.delete_pdf(db, id):
        raise HTTPException(status_code=404, detail="PDF not found")
    return {"message": "PDF successfully deleted"}

