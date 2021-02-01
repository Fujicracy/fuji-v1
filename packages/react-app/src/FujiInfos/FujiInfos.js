import React, { useCallback, useEffect, useState } from "react";
import { Layout, Image } from 'antd';

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
	        <h1 className="question"> What is it ?
	      </h1>
	          
	        <h2>
	         	Fuji aggregates borrowing rates from different protocols, to optimize your loans with the lowest market rate in DeFi.

				Fuji finds the best borrowing rates for you, it automatically refinances your loan.
	         </h2>

	      	<h1 className="question"> How it works ?
	      </h1>

	        <Image
				width={200}
				src="Aave.png"
			/>
			<Image
				width={200}
				src="Compoundlogo.png"
			/>
	       
        </Content>
      </Layout>
    </div>
   );
}

export default FujiInfos;
