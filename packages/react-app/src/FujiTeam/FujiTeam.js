import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Layout, Card, Image } from "antd";
import { TwitterSquareFilled , LinkedinFilled } from '@ant-design/icons';
import "./FujiTeam.css";

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

        <Content className="content">
          <Row gutter={16}>
            <Col span={4}>
              <Card title="Boyan Barakov" bordered={false}>
                    <Image
					      width={200}
					      src="BoyanB.jpg"
					/>
					<br/>
					<TwitterSquareFilled />
					<LinkedinFilled />
              </Card>
            </Col>
            <Col span={4}>
              <Card title="Jian Chiew" bordered={false}>
                    <Image
					      width={200}
					      src="JcAwesome.png"
					/>
					<br/>
					<TwitterSquareFilled />
					<LinkedinFilled />
              </Card>
            </Col>
            <Col span={4}>
              <Card title="Daigaro Cota" bordered={false}>
                    <Image
					      width={200}
					      src="DaigaroC.jpg"
					/>
					<br/>
					<TwitterSquareFilled />
					<LinkedinFilled />
              </Card>
            </Col>
             <Col span={4}>
              <Card title="Edgar Moreau" bordered={false}>
                    <Image
					      width={200}
					      src="EdgarM.jpg"
					/>
					<br/>
					<TwitterSquareFilled />
					<LinkedinFilled />
              </Card>
            </Col>
             <Col span={4}>
              <Card title="Oscar Fonseca" bordered={false}>
                   <Image
					      width={200}
					      src="OscarF.png"
					/>
					<br/>
					<TwitterSquareFilled />
					<LinkedinFilled />
              </Card>
            </Col>
          </Row>

        </Content>
                           <Image
					      width={400}
					      src="MarketMake.png"
					/>
      </Layout>
    </div>
   );
}

export default FujiTeam;
