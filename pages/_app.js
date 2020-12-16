import 'antd/dist/antd.css'
import '../styles/globals.css'
import '../styles/codemirror.css'
import { init } from '../core/backend/DB'



function App({ Component, pageProps }) {
  if (process.browser) {
    console.log('this is browser')
  } else {
    console.log('this is server')
    init()
    .then(() => console.log('DB init'))
  }
  
  return <Component {...pageProps} />
}


export default App
