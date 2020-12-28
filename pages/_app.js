import 'antd/dist/antd.css'
import '../styles/globals.css'
import '../styles/codemirror.css'
import { init } from '../core/backend/DB'



function App({ Component, pageProps }) {
  // if (process.browser) {
  //   console.log('>>> this is browser')
  // } else {
  //   console.log('>>> this is server')
  //   // init()
  //   // .then(() => console.log('DB init'))
  // }
  
  return <Component {...pageProps} />
}


// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   // const appProps = await App.getInitialProps(appContext);
//   await init()
//   return { }
// }


export default App
