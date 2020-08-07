//import styles from './index.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Link from 'umi/link';

import AdminLayout from './admin';

import { Layout, Menu, Breadcrumb,Icon } from 'antd';
const { Header, Content, Footer } = Layout;

export default class HomeLayout extends Component {
	constructor(props) {
    super(props);
    this.state = {
      token:'',
    };

  }

 componentDidMount () {

    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      console.log(AppState);
      this.state.token =AppState.user.token;
      this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState });
    }

     console.log(this.state.token);
   }

render() {

   //if (this.props.location.pathname === '/admin' || this.props.location.pathname ==='/admin/addproduct' || this.props.location.pathname ==='/admin/products' ) {
    if(this.state.token!=null ){
    return <AdminLayout>{ this.props.children }</AdminLayout>
    }

 return (
  <Layout >
  <Layout className="layout" style={{minHeight:"600px",width:"100%"}}>
    <Header>
      <div className="logo" style={{width:"120px",color:"white"}} value="Logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1"> <Link to="/"><Icon type="home" />Home</Link></Menu.Item>
        <Menu.Item key="2"> Contact Us</Menu.Item>
        <Menu.Item key="3"> About Us</Menu.Item>
        <Menu.Item key="4"><Link to="/"><Icon type="user" />Login</Link></Menu.Item>
        <Menu.Item key="5"> <Link to="/register"><Icon type="user" />Register</Link></Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px'}} >
     <div style={{width:"100%"}}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: '#fff', padding: 24, minHeight: 280, margin:"auto",width:"75%"}}
       className="mx-5">
      {this.props.children}
      </div>
       </div>
    </Content>
    </Layout>
    <Footer style={{ textAlign: 'center',marginBottom:"0px",backgroundColor:"black",color:"white" }}>
      Ant Design ©2020 Kans
    </Footer>
  </Layout>

    );
    }
}

if (document.getElementById('homeLayout')) {
    ReactDOM.render(<HomeLayout />, document.getElementById('homeLayout'));
}
