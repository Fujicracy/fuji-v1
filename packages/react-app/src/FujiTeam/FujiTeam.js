import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Layout, Card } from "antd";

function FujiTeam(props) {
  const { Header, Footer, Content } = Layout;

  return (
    <div className="App"> 
      <Layout>
        <Header className="header">
          <h1 className="logo-title">
            Fuji
            <span className="tab-title">
              Team
            </span>
          </h1>
        </Header>

        <Content>
          <Row gutter={16}>
            <Col span={4}>
              <Card title="Card title" bordered={false}>
                Card content
              </Card>
            </Col>
            <Col span={4}>
              <Card title="Card title" bordered={false}>
                Card content
              </Card>
            </Col>
            <Col span={4}>
              <Card title="Card title" bordered={false}>
                Card content
              </Card>
            </Col>
             <Col span={4}>
              <Card title="Card title" bordered={false}>
                Card content
              </Card>
            </Col>
             <Col span={4}>
              <Card title="Card title" bordered={false}>
                Card content
              </Card>
            </Col>
          </Row>        

        </Content>
      </Layout>
    </div>
   );
}

export default FujiTeam;
