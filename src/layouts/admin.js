import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Link from 'umi/link';
import createHistory from "history/createBrowserHistory";

import axios from 'axios';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;


class AdminLayout extends Component {
  constructor(props) {
  super(props);
  this.state = {
    collapsed: false,
    token :'',
  };
 this.onCollapse = this.onCollapse.bind(this);
}

 componentDidMount() {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      console.log(AppState);
      this.state.token =AppState.user.token;
      this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState });
       //document.getElementById("user").style.background=green;
    }
  }

logoutUser(e){
   axios
      .get("http://localhost:8081/api/logout?secret_token="+this.state.token,
        {headers :  {'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.state.token}})
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
          // alert(json.data.success);
           let appState = {
           isLoggedIn: false,
           user: {}
             };
             //this.state.tot = json.data.total;
            // save app state with user date in local storage
            localStorage["appState"] = JSON.stringify(appState);
            this.setState(appState);
            //alert("Deconnexion avec Succès");
            const history = createHistory();
            //this.props.
            history.push('/');
            window.location.reload();
        } else {
         // alert(`data not found !`);
        }
      })
      .catch(error => {
       // alert("An Error Occured!");
      });
  };

  onCollapse(collapsed) {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
              <Link to="/admin"><Icon type="home" />
              <span>Home</span></Link>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span><Icon type="pie-chart" /><span>Product</span></span>}
            >
              <Menu.Item key="2"><Link to="/admin/addproduct"> New Product</Link ></Menu.Item>
            </SubMenu>
            <Menu.Item key="5">
              <Icon type="desktop" />
              <span><Link to="/admin/products">View All</Link ></span>
            </Menu.Item>
            <SubMenu
              key="sub2"
              title={<span><Icon type="user" /><span>User</span></span>}
            >
              <Menu.Item key="6"><span><Link to="/admin/profile">Profile</Link ></span></Menu.Item>
              <Menu.Item key="7">Team</Menu.Item>
              <Menu.Item key="8">
              <Link to="" onClick={this.logoutUser.bind(this)}>
              Log Out</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              title={<span><Icon type="setting" /><span>Setting</span></span>}
            >
              <Menu.Item key="9">Dark Mode</Menu.Item>
              <Menu.Item key="10">Home Page</Menu.Item>
              <Menu.Item key="11">Prouct View</Menu.Item>
            </SubMenu>
            <Menu.Item key="12">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Produit</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2020 Kans
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
export default AdminLayout;