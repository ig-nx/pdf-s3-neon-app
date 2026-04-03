// pdf.js es el componente que representa un PDF individual en la lista de PDFs. Este componente muestra el nombre del PDF, un enlace para ver el PDF, un checkbox para marcarlo como seleccionado, y un botón para eliminarlo. También maneja los cambios en el PDF (como editar el nombre o marcar/desmarcar el checkbox) y llama a las funciones correspondientes para actualizar o eliminar el PDF en el backend a través de las funciones onChange y onDelete que recibe como props.

// PDFComponent es un componente funcional de React que recibe un objeto PDF y dos funciones (onChange y onDelete) como props. El componente renderiza una fila que incluye un checkbox para marcar el PDF como seleccionado, un campo de texto para editar el nombre del PDF, un enlace para ver el PDF, y un botón para eliminar el PDF. Cuando el checkbox o el campo de texto cambian, se llama a la función onChange con el evento y el ID del PDF. Cuando se hace clic en el botón de eliminar, se llama a la función onDelete con el ID del PDF. El enlace para ver el PDF abre el archivo PDF en una nueva pestaña del navegador.



import Image from 'next/image'; // Image es un componente de Next.js que optimiza la carga de imágenes. En este caso, se utiliza para mostrar los íconos de "ver PDF" y "eliminar PDF". El componente Image permite especificar el ancho y alto de la imagen, lo que ayuda a mejorar el rendimiento al reservar el espacio necesario para la imagen antes de que se cargue. Además, Next.js optimiza automáticamente las imágenes para que se carguen más rápido en diferentes dispositivos y conexiones de red. 
import styles from '../styles/pdf.module.css'; 

export default function PDFComponent(props) {
  const { pdf, onChange, onDelete } = props;
  return (
    <div className={styles.pdfRow}>
      <input
        className={styles.pdfCheckbox}
        name="selected"
        type="checkbox"
        checked={pdf.selected}
        onChange={(e) => onChange(e, pdf.id)}
      />
      <input
        className={styles.pdfInput}
        autoComplete="off"
        name="name"
        type="text"
        value={pdf.name}
        onChange={(e) => onChange(e, pdf.id)}
      />
      <a
        href={pdf.file}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.viewPdfLink}
      >
        <Image src="/document-view.svg" alt="View PDF" width="22" height="22" />
      </a>
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(pdf.id)} // al hacer clic en el botón de eliminar, se llama a la función onDelete con el ID del PDF, lo que permite eliminar el PDF correspondiente en el backend y actualizar la lista de PDFs en el frontend. Esta enlazado a la función onDelete que se define en el componente PDFList, y que se encarga de hacer la solicitud al backend para eliminar el PDF y luego actualizar el estado local de los PDFs para reflejar el cambio en la interfaz de usuario.
      >
        <Image src="/delete-outline.svg" alt="Delete PDF" width="24" height="24" />
      </button>
    </div>
  );
}
