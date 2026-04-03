import Head from 'next/head'
import Layout from '../components/layout';
import PDFList from '../components/pdf-list';
import styles from '../styles/layout.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>MVP para Subir PDFs a la Nube</title>
        <meta name="description" content="MVP para subir PDFs a la nube, gestionarlos y revisarlos desde una sola interfaz." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PDFList />
      </Layout>
    </div>
  )
}
