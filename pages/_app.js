import { useEffect, useState } from 'react'
import Layout from '../layout'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
