import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Statistic, Row, Col, Button } from 'antd';

import Link from 'umi/link';

import axios from 'axios';

import Index from '../index';

import createHistory from "history/createBrowserHistory";
const history = createHistory();

class AdminHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total:'',
    };
  }

    componentDidMount() {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      console.log(AppState);
      this.state.token =AppState.user.token;
      this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState });
    }

     axios
      .get("http://localhost:8081/api/countp?secret_token="+this.state.token,
        {headers :  {'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.state.token}})
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
           //alert(json.data.success);
             //this.state.tot = json.data.total;
             
           
            this.setState({total: json.data.total });
        } else {
          //alert(`data not found !`);
        }
      })
      .catch(error => {
        //alert("An Error Occured!");
      });
      console.log(this.state.total);
  }

  render() {
    if(!this.state.isLoggedIn){
      return <Index history={history}/>
    }
    return (
      <Row gutter={16}>
    <Col span={6}>
      <Statistic title="All Products" value={112893} />
    </Col>
    <Col span={6}>
      <Statistic title="Users" value={112893} />
    </Col>
    <Col span={6}>
      <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
      <Button style={{ marginTop: 16 }} type="primary">
        Recharge
      </Button>
    </Col>
    <Col span={6}>
      <Statistic title="Partenariats" value={228893} />
      <Button style={{ marginTop: 16 }} type="primary">
        Become One
      </Button>
    </Col>
    <Col span={6}>
      <Statistic title="Product" value={this.state.total} />
      <Button style={{ marginTop: 16 }} type="primary">
       <Link to="/admin/addproduct"> Add Your Own Product </Link>
      </Button>
    </Col>
  </Row>
    );
  }
}

export default AdminHome;
