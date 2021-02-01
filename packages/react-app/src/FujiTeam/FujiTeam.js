import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Layout, Card, Image } from "antd";

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
              <Card title="Boyan Barakov" bordered={false}>
                    <Image
					      width={200}
					      src="BoyanB.jpg"
					/>
              </Card>
            </Col>
            <Col span={4}>
              <Card title="Jian Chiew" bordered={false}>
                    <Image
					      width={200}
					      src="JcAwesome.png"
					/>
              </Card>
            </Col>
            <Col span={4}>
              <Card title="Daigaro Cota" bordered={false}>
                    <Image
					      width={200}
					      src="DaigaroC.jpg"
					/>
              </Card>
            </Col>
             <Col span={4}>
              <Card title="Edgar Moreau" bordered={false}>
                    <Image
					      width={200}
					      src="EdgarM.jpg"
					/>
              </Card>
            </Col>
             <Col span={4}>
              <Card title="Oscar Fonseca" bordered={false}>
                   <Image
					      width={200}
					      src="OscarF.png"
					/>
              </Card>
            </Col>
          </Row>

                   <Image
					      width={400}
					      src="MarketMake.png"
					/>

        </Content>
      </Layout>
    </div>
   );
}

export default FujiTeam;
