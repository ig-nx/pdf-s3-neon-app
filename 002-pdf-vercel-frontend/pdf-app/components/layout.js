import styles from '../styles/layout.module.css'

export default function Layout(props) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerTop}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>MVP documental en la nube</p>
              <h1 className={styles.title}>MVP para Subir PDFs a la Nube</h1>
              <p className={styles.subtitle}>
                Este MVP permite subir archivos PDF a la nube y gestionarlos desde una sola interfaz.
                El flujo principal es cargar, listar, renombrar, seleccionar, filtrar, abrir y eliminar documentos.
              </p>
            </div>
            <nav className={styles.nav} aria-label="Navegacion principal">
              <span className={styles.navItem}>Inicio</span>
              <span className={styles.navItem}>Flujo</span>
              <span className={styles.navItem}>Tecnologia</span>
              <span className={styles.navItem}>Ayuda</span>
            </nav>
          </div>
          <div className={styles.infoBubbles}>
            <span className={styles.infoBubble}>Sube PDFs a la nube</span>
            <span className={styles.infoBubble}>Organiza tu biblioteca documental</span>
            <span className={styles.infoBubble}>Filtra y revisa archivos rapidamente</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          {props.children}

          <section className={styles.contextSection} aria-label="Contexto del MVP">
            <div className={styles.contextIntro}>
              <p className={styles.sectionEyebrow}>Que hace este MVP</p>
              <h2 className={styles.sectionTitle}>Subida y gestion simple de PDFs en la nube</h2>
              <p className={styles.sectionText}>
                La app esta pensada como un MVP funcional para guardar PDFs en la nube y administrarlos
                desde una sola pantalla. Permite centralizar documentos, mantener una lista ordenada y
                dejar marcados los archivos mas relevantes para una revision rapida.
              </p>
            </div>

            <div className={styles.flowGrid}>
              <div className={styles.flowItem}>
                <span className={styles.flowLabel}>Lo principal que hace</span>
                <p className={styles.flowText}>
                  Sube un PDF, lo guarda en la nube, registra su informacion y lo deja disponible para abrir,
                  renombrar, seleccionar, filtrar o eliminar.
                </p>
              </div>
              <div className={styles.flowItem}>
                <span className={styles.flowLabel}>Por que sirve</span>
                <p className={styles.flowText}>
                  Ayuda a pasar de archivos sueltos en carpetas a una biblioteca web simple, visible y facil de revisar.
                </p>
              </div>
            </div>

            <div className={styles.useCasesSection}>
              <div className={styles.techHeader}>
                <p className={styles.sectionEyebrow}>Casos de uso</p>
                <h3 className={styles.techTitle}>Donde puede aplicarse este MVP</h3>
              </div>

              <div className={styles.useCasesGrid}>
                <div className={styles.useCaseItem}>
                  <span className={styles.useCaseName}>Revision administrativa</span>
                  <p className={styles.useCaseText}>
                    Para centralizar formularios, reportes, contratos o documentos operativos.
                  </p>
                </div>
                <div className={styles.useCaseItem}>
                  <span className={styles.useCaseName}>Biblioteca academica</span>
                  <p className={styles.useCaseText}>
                    Para organizar guias, apuntes, papers y material de estudio en una sola vista.
                  </p>
                </div>
                <div className={styles.useCaseItem}>
                  <span className={styles.useCaseName}>Preseleccion documental</span>
                  <p className={styles.useCaseText}>
                    Para marcar archivos relevantes y separar rapidamente lo importante de lo pendiente.
                  </p>
                </div>
                <div className={styles.useCaseItem}>
                  <span className={styles.useCaseName}>Base para flujos con IA</span>
                  <p className={styles.useCaseText}>
                    Como punto de partida para luego resumir, clasificar o extraer informacion de PDFs con IA.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.techSection}>
              <div className={styles.techHeader}>
                <p className={styles.sectionEyebrow}>Tecnologia y por que</p>
                <h3 className={styles.techTitle}>Como se reparte el trabajo del proyecto</h3>
              </div>

              <div className={styles.techList}>
                <div className={styles.techRow}>
                  <span className={styles.techName}>Next.js</span>
                  <p className={styles.techDescription}>
                    Se usa para el frontend y la interfaz donde el usuario carga, visualiza y gestiona los PDFs.
                  </p>
                </div>
                <div className={styles.techRow}>
                  <span className={styles.techName}>FastAPI</span>
                  <p className={styles.techDescription}>
                    Se usa para recibir archivos, exponer endpoints CRUD y conectar la app con la base de datos y la nube.
                  </p>
                </div>
                <div className={styles.techRow}>
                  <span className={styles.techName}>Cloudflare R2</span>
                  <p className={styles.techDescription}>
                    Los PDFs se guardan en Cloudflare R2 usando una API compatible con S3, para mantener los archivos en la nube.
                  </p>
                </div>
                <div className={styles.techRow}>
                  <span className={styles.techName}>Neon Postgres</span>
                  <p className={styles.techDescription}>
                    Guarda el nombre, la URL del archivo y el estado de seleccion en PostgreSQL para administrar la biblioteca documental.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerItem}>Privacidad</span>
          <span className={styles.footerItem}>Terminos</span>
          <span className={styles.footerItem}>Ayuda</span>
          <span className={styles.footerItem}>Contacto</span>
        </div>
      </footer>
    </div>
  )
}
