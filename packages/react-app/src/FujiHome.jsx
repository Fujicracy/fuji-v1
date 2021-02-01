import React, { useCallback, useEffect, useState } from "react";
import { Layout, Row, Col, Button } from 'antd';

function FujiHome({ address, loadWeb3Modal }) {
  const { Header, Footer, Content } = Layout;

  return (
    <div className="App"> 
      <Layout>
        <Header className="header">
          <h1 className="logo-title">
            Fuji
            <span className="tab-title">
              Home
            </span>
          </h1>
        </Header>

        <Content>
          <Row align="middle" justify="center" style={{ paddingTop: '300px' }}>
            <Col span={24}>{
              !address
              ? <Button onClick={loadWeb3Modal} className="button" type="primary" shape="round" size="large">
                  Connect Wallet
                </Button>
              : <Button href="vaults" className="button" type="primary" shape="round" size="large">
                  Launch App
                </Button>
            }
            </Col>
          </Row>
        </Content>

        <Footer>                
          <Button href="about" type="primary">
            Infos
          </Button>

          <Button href="team" type="primary">
            Team
          </Button>
        </Footer>
      </Layout>
    </div>
   );
}

export default FujiHome;
