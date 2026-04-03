// pdf-list.js es el componente que se encarga de mostrar la lista de PDFs, manejar la carga de nuevos PDFs, y permitir la edición y eliminación de los PDFs existentes. Este componente se comunica con el backend a través de fetch para obtener la lista de PDFs, actualizar un PDF específico, eliminar un PDF, y cargar un nuevo PDF. También maneja el estado local de los PDFs y el archivo seleccionado para cargar. Además, incluye una función de debounce para evitar hacer demasiadas solicitudes al backend cuando se editan los campos de un PDF.



import styles from '../styles/pdf-list.module.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import PDFComponent from './pdf';

export default function PdfList() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filter, setFilter] = useState();
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (!didFetchRef.current) {
      didFetchRef.current = true;
      fetchPdfs();
    }
  }, []);

  async function fetchPdfs(selected) {
    let path = '/pdfs';
    if (selected !== undefined) {
      path = `/pdfs?selected=${selected}`;
    }
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path);
    const json = await res.json();
    setPdfs(json);
  }

  const debouncedUpdatePdf = useCallback(debounce((pdf, fieldChanged) => {
    updatePdf(pdf, fieldChanged);
  }, 500), []);

  function handlePdfChange(e, id) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const copy = [...pdfs];
    const idx = pdfs.findIndex((pdf) => pdf.id === id);
    const changedPdf = { ...pdfs[idx], [name]: value };
    copy[idx] = changedPdf;
    debouncedUpdatePdf(changedPdf, name);
    setPdfs(copy);
  }

/*   async function updatePdf(pdf, fieldChanged) {
    const data = { [fieldChanged]: pdf[fieldChanged] };

    await fetch(process.env.NEXT_PUBLIC_API_URL + `/pdfs/${pdf.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
  } */

/* Our Honor Student Robert Merchant finds out that the following 
version of the previous function works better:

This bug fix applies to all projects that use a select checkbox 
to select or unselect an item from a list of items on the frontend 
(PDFs, etc). There is a problem with the "updatePDF( )" function 
that gets called when a user selects (or unselects) a checkbox, 
for example a PDF file. The update fails, because the PUT operation 
is expecting ALL of the PDF item fields/columns to be replaced 
(name, file, selected), not just the "selected" column.

If you have replaced the old function with the new function, 
you will need to restart the frontend.*/

// esta es la nueva función que reemplaza a la anterior, y que corrige el error que se producía al intentar actualizar solo un campo del PDF (por ejemplo, el campo "selected" al marcar o desmarcar el checkbox), lo que causaba que los otros campos (como "name" o "file") se perdieran en la actualización. Con esta nueva función, se envía todo el objeto PDF actualizado, lo que permite que la actualización funcione correctamente sin perder datos.

  async function updatePdf(pdf, fieldChanged) {
    const body_data = JSON.stringify(pdf);
    const url = process.env.NEXT_PUBLIC_API_URL + `/pdfs/${pdf.id}`;

    await fetch(url, {
        method: 'PUT',
        body: body_data,
        headers: { 'Content-Type': 'application/json' }
    });
  }

  async function handleDeletePdf(id) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/pdfs/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      const copy = pdfs.filter((pdf) => pdf.id !== id);
      setPdfs(copy);
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!selectedFile) {
      alert("Selecciona un archivo PDF para cargar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/pdfs/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const newPdf = await response.json();
      setPdfs([...pdfs, newPdf]);
      setSelectedFile(null);
      form.reset();
    } else {
      alert("No se pudo cargar el archivo, por favor inténtalo de nuevo.");
    }
  };

  function handleFilterChange(value) {
    setFilter(value);
    fetchPdfs(value);
  }

  // el return es lo que se renderiza en pantalla, y contiene el formulario para cargar un nuevo PDF, la lista de PDFs (que se mapea a través del componente PDFComponent), y los botones para filtrar los PDFs por seleccionados, no seleccionados o todos. Cada PDFComponent recibe el PDF específico, la función para manejar cambios en el PDF (como editar el nombre o marcar/desmarcar el checkbox), y la función para eliminar el PDF.

  return (
    <div className={styles.container}>
      <div className={styles.mainInputContainer}>
        <form onSubmit={handleUpload} className={styles.uploadForm}>
          <input className={styles.mainInput} type="file" accept=".pdf" onChange={handleFileChange} />
          <button className={styles.loadBtn} type="submit">Cargar PDF</button>
        </form>
        <p className={styles.helperText}>PDF maximo 100 KB</p>
      </div>
      {!pdfs.length && <div className={styles.loading}>Cargando documentos...</div>}
      {pdfs.map((pdf) => (
        <PDFComponent key={pdf.id} pdf={pdf} onDelete={handleDeletePdf} onChange={handlePdfChange} />
      ))}
      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${filter === undefined && styles.filterActive}`} onClick={() => handleFilterChange()}>Ver todos</button>
        <button className={`${styles.filterBtn} ${filter === true && styles.filterActive}`} onClick={() => handleFilterChange(true)}>Ver seleccionados</button>
        <button className={`${styles.filterBtn} ${filter === false && styles.filterActive}`} onClick={() => handleFilterChange(false)}>Ver no seleccionados</button>
      </div>
    </div>
  );
}
