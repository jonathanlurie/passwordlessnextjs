import Head from 'next/head'
import Styles from './styles.module.css'
import TokenizedPage from '../components/TokenizedPage'
import AppLayout from '../components/AppLayout'
import { Button, Col, Row } from 'antd'

export default function Home() {
  return (
    <TokenizedPage>
      <AppLayout>
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
              <div
                className={Styles['vendor-bubble']}
              >
                <img alt='nextjs logo' src='images/nextjs_logo.svg'/>
              </div>
            </Col>

            <Col>
              <div
                className={Styles['vendor-bubble']}
              >
                <img alt='nextjs logo' src='images/mongodb_logo.svg'/>
              </div>
            </Col>

            <Col >
              <div
                className={Styles['vendor-bubble']}
              >
                <img alt='nextjs logo' src='images/sendgrid_logo.svg'/>
              </div>
            </Col>

          </Row>

          <Row justify='center'>
            <Col>
              <div
                className={Styles['code']}
              >
                git clone https://github.com/jonathanlurie/passwordlessnextjs.git
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
