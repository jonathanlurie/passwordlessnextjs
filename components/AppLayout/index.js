import React from 'react'
import { Layout, Row, Col } from 'antd'
import Styles from './styles.module.css'

const { Header, Footer, Content } = Layout

export default class AppLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Layout>
        <Header
          className={Styles['app-header']}
        >
        <Row>
        <Col xs={2}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
          <Col xs={20} sm={20} md={16} lg={16} xl={16}>
              <span className={Styles['title-passwordless']}>Passwordless</span>
              <span className={Styles['title-nextjs']}>Nextjs</span>
          </Col>
          <Col xs={2}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
        </Row>
        </Header>
        <Content>
        <Row>
        <Col xs={2}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
          <Col xs={20} sm={20} md={16} lg={16} xl={16}>
              {this.props.children}
          </Col>
          <Col xs={2}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
        </Row>

        </Content>
        <Footer
          className={Styles['app-footer']}
        >
        <Row>
        <Col xs={2}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
          <Col xs={20} sm={20} md={16} lg={16} xl={16}>
              Footer
          </Col>
          <Col xs={2}  sm={2}  md={4}  lg={4} xl={4}>
          </Col>
        </Row>
        </Footer>
    </Layout>
    )
  }
}