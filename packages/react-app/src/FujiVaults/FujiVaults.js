import React, { useCallback, useEffect, useState } from "react";
import { Layout, Button } from 'antd';

function FujiVaults(props) {
  const { Header, Footer, Content } = Layout;

  return (
    <div className="App"> 
      <Layout>
        <Header className="header">
          <h1 className="logo-title">
            Fuji
            <span className="tab-title">
              Vaults
            </span>
          </h1>
        </Header>

        <Content>        
          <Button className="button" type="primary" shape="round">
          Borrow DAI         
          </Button> 
        </Content>
      </Layout>
    </div>
   );
}

export default FujiVaults;
