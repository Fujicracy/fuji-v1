import React, { useCallback, useEffect, useState } from "react";
import { Layout } from 'antd';

function FujiInfos(props) {

  const { Header, Content } = Layout;

  return (
    <div className="App"> 
      <Layout>
        <Header className="header">
          <h1 className="logo-title">
            Fuji
            <span className="tab-title">
              Infos
            </span>
          </h1>
        </Header>

        <Content>    
          FujiInfos
        </Content>
      </Layout>
    </div>
   );
}

export default FujiInfos;
