import React from 'react';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout

function App() {
  return (
    <Layout className="layout">
      <Header>
        HEAD
      </Header>
      <Content>
        CONTENT
      </Content>
      <Footer>
        FOOTER
      </Footer>
    </Layout>
  );
}

export default App;
