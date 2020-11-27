import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TokenizedPage from '../components/TokenizedPage'
import AppLayout from '../components/AppLayout'

export default function Home() {
  return (
    <TokenizedPage>
      <AppLayout>
      </AppLayout>
    </TokenizedPage>
  )
}
