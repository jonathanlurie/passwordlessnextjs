import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TokenizedPage from '../components/TokenizedPage'
import AppLayout from '../components/AppLayout'

export default function Home() {
  return (
    <TokenizedPage>
      <Head>
        <title>Passwordless NextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        
      </AppLayout>


    </TokenizedPage>
  )
}
