import Head from 'next/head'
import Styles from './styles.module.css'
import TokenizedPage from '../components/TokenizedPage'
import AppLayout from '../components/AppLayout'
import { Button, Col, Row, Tooltip } from 'antd'

export default function Home() {
  return (
    <TokenizedPage>
      <AppLayout>
        <Head>
          <title>Passwordless Next.js</title>
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="description" content='The Next.js boilerplate for passwordless authentication.'/>
          <meta name="author" content='Jonathan Lurie'/>

          <meta property="og:title" content='Passwordless Next.js' key="title_OG" />
          {/* <meta property="og:url" content={`${process.env.}`} key="url_OG"/> */}
          <meta property="og:image" content='/images/social_cover.png' key="image_OG"/>
          <meta property="og:description" content='The Next.js boilerplate for passwordless authentication.' key="description_OG"/>
          <meta property="og:site_name" content="Passwordless Nextjs" key="sitename_OG"/>
          <meta property="og:type" content="article" key="type_OG"/>

          <meta name="twitter:title" content='Passwordless Next.js' key="title_TW"/>
          <meta name="twitter:description" content='The Next.js boilerplate for passwordless authentication.' key="description_TW"/>
          <meta name="twitter:image" content='/images/social_cover.png' key="image_TW"/>
          <meta name="twitter:card" content="summary_large_image" key="card_TW"/>
          <meta name="twitter:site" content="@jonathanlurie" key="site_TW"/>
        </Head>


        <div
          className={Styles['content']}
        >

          <Row justify='center'>
            <Col>
              <div
                className={Styles['intro-phrase']}
              >
                Register and login with a link sent to your inbox. No password required.
              </div>
            </Col>
          </Row>

          <div
            className={Styles['catch-phrase']}
          >
            The Next.js boilerplate for passwordless authentication.
          </div>

          <Row justify='center' gutter={[50, 50]}>
            <Col>
              <Tooltip title='The fullstack React framework' placement='bottom'>
                <div
                  className={Styles['vendor-bubble']}
                >
                  <img alt='nextjs logo' src='images/nextjs_logo.svg'/>
                </div>
              </Tooltip>
            </Col>

            <Col>
              <Tooltip title='The document/NoSQL database' placement='bottom'>
                <div
                  className={Styles['vendor-bubble']}
                >
                  <img alt='nextjs logo' src='images/mongodb_logo.svg'/>
                </div>
              </Tooltip>
            </Col>

            <Col >
              <Tooltip title='The email service' placement='bottom'>
                <div
                  className={Styles['vendor-bubble']}
                >
                  <img alt='nextjs logo' src='images/sendgrid_logo.svg'/>
                </div>
              </Tooltip>
            </Col>

          </Row>

          <Row justify='center'>
            <Col>
              <div
                className={Styles['code-info']}
              >
                Build your own:
              </div>
              <div
                className={Styles['code']}
              >
                npx degit jonathanlurie/passwordlessnextjs#main my-project
              </div>
            </Col>
          </Row>

          <Row justify='center'>
            <Col>
              <Button type="primary" href='https://github.com/jonathanlurie/passwordlessnextjs'>More info</Button>
            </Col>
          </Row>

          
        </div>
      </AppLayout>
    </TokenizedPage>
  )
}
