import React from 'react'
import Link from 'next/link'
import { Layout, Row, Col } from 'antd'
import StatusButton from '../StatusButton'
import Styles from './styles.module.css'

const { Header, Footer, Content } = Layout

export default class AppLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Layout
        className={Styles['layout']}
      >
        <Header
          className={Styles['app-header']}
        >
        <Row>
        <Col xs={1}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
          <Col xs={22} sm={20} md={16} lg={16} xl={16}>
              
              
            <Row justify="space-between">
              <Col>
              
                <Link href='/'><a>
                <span className={Styles['title-passwordless']}>Passwordless</span>
                <span className={Styles['title-nextjs']}>Nextjs</span>
                </a></Link>
              </Col>

              <Col>
                <StatusButton/>
              </Col>
            </Row>
          </Col>
          <Col xs={1}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
        </Row>
        </Header>
        <Content>
        <Row>
        <Col xs={1}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
          <Col xs={22} sm={20} md={16} lg={16} xl={16}>
              {this.props.children}
          </Col>
          <Col xs={1}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
        </Row>

        </Content>
        <Footer
          className={Styles['app-footer']}
        >
        <Row>
        <Col xs={1}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
          <Col xs={22} sm={20} md={16} lg={16} xl={16}>
              Made by <a href='https://twitter.com/jonathanlurie'>@jonathanlurie</a> - Project source available on <a href='https://github.com/jonathanlurie/passwordlessnextjs'>GitHub</a>.
          </Col>
          <Col xs={1}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
        </Row>
        </Footer>
    </Layout>
    )
  }
}