from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
import models, schemas
from config import Settings
from botocore.exceptions import NoCredentialsError, BotoCoreError, ClientError
from urllib.parse import urlparse, unquote
import re

_UPLOADED_KEY_RE = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-",
    re.IGNORECASE,
)

def _extract_storage_key(file_url: str, bucket_name: str) -> str | None:
    """
    Tries to infer the object key used in R2/S3 from the stored URL.
    Supports:
    - https://custom-domain/<key>
    - https://<account>.r2.../<bucket>/<key>
    - raw key strings (fallback)
    """
    if not file_url:
        return None

    try:
        parsed = urlparse(file_url)
        path = parsed.path if parsed.scheme else file_url
        parts = [p for p in path.split("/") if p]
        if not parts:
            return None

        # When using S3-style URLs, the first path segment can be the bucket name.
        if bucket_name and parts[0] == bucket_name:
            parts = parts[1:]

        if not parts:
            return None

        key = unquote("/".join(parts))
        return key or None
    except Exception:
        return None

def _looks_like_our_uploaded_key(key: str) -> bool:
    # Our upload keys are generated as: f"{uuid4()}-{original_filename}"
    last_segment = key.rsplit("/", 1)[-1]
    return bool(_UPLOADED_KEY_RE.match(last_segment))

def create_pdf(db: Session, pdf: schemas.PDFRequest):
    db_pdf = models.PDF(name=pdf.name, selected=pdf.selected, file=pdf.file)
    db.add(db_pdf)
    db.commit()
    db.refresh(db_pdf)
    return db_pdf

def read_pdfs(db: Session, selected: bool = None):
    if selected is None:
        return db.query(models.PDF).all()
    else:
        return db.query(models.PDF).filter(models.PDF.selected == selected).all()

def count_pdfs(db: Session) -> int:
    return db.query(models.PDF).count()

def read_pdf(db: Session, id: int):
    return db.query(models.PDF).filter(models.PDF.id == id).first()

def update_pdf(db: Session, id: int, pdf: schemas.PDFRequest):
    db_pdf = db.query(models.PDF).filter(models.PDF.id == id).first()
    if db_pdf is None:
        return None
    update_data = pdf.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_pdf, key, value)
    db.commit()
    db.refresh(db_pdf)
    return db_pdf

def delete_pdf(db: Session, id: int):
    db_pdf = db.query(models.PDF).filter(models.PDF.id == id).first()
    if db_pdf is None:
        return None

    # Best-effort delete from R2/S3 for objects that were uploaded by this app.
    try:
        settings = Settings()
        key = _extract_storage_key(db_pdf.file, settings.R2_BUCKET)
        if key and _looks_like_our_uploaded_key(key):
            s3_client = Settings.get_s3_client()
            s3_client.delete_object(Bucket=settings.R2_BUCKET, Key=key)
    except (NoCredentialsError, BotoCoreError, ClientError):
        raise HTTPException(status_code=500, detail={"code": "STORAGE_DELETE_FAILED"})
    db.delete(db_pdf)
    db.commit()
    return True

def upload_pdf(db: Session, file: UploadFile, file_name: str):
    s3_client = Settings.get_s3_client()
    # BUCKET_NAME = Settings().AWS_S3_BUCKET
    BUCKET_NAME = Settings().R2_BUCKET
    
    try:
        s3_client.upload_fileobj(
            file.file,
            BUCKET_NAME,
            file_name
        )
        # file_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}'
        # file_url = f"{Settings().R2_ENDPOINT}/{BUCKET_NAME}/{file_name}" 
        file_url = f"https://bucket-pdf.restak.cl/{file_name}" # la primera es de aws, la segunda es para link privado y la tercera es para link publico
        
        db_pdf = models.PDF(name=file.filename, selected=False, file=file_url)
        db.add(db_pdf)
        db.commit()
        db.refresh(db_pdf)
        return db_pdf
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="Error in AWS credentials")


# def upload_pdf(db: Session, file: UploadFile, file_name: str):
#     s3_client = Settings.get_s3_client()
#     BUCKET_NAME = Settings().AWS_S3_BUCKET

#     try:
#         s3_client.upload_fileobj(
#             file.file,
#             BUCKET_NAME,
#             file_name,
#             ExtraArgs={'ACL': 'public-read'}
#         )
#         file_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}'
        
#         db_pdf = models.PDF(name=file.filename, selected=False, file=file_url)
#         db.add(db_pdf)
#         db.commit()
#         db.refresh(db_pdf)
#         return db_pdf
#     except NoCredentialsError:
#         raise HTTPException(status_code=500, detail="Error in AWS credentials")
#     except BotoCoreError as e:
#         raise HTTPException(status_code=500, detail=str(e))
