import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from 'antd';

import Head from './layouts/Head';
import Body from './layouts/Body';

const { Header, Content, Footer } = Layout

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <Head/>
        </Header>
        <Content>
          <Body/>
        </Content>
        <Footer className='footer'>
          <p>@:functionalweasel@gmail.com</p>
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
