import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import Index from '../index';

import { Card, Icon, Avatar } from 'antd';

import createHistory from "history/createBrowserHistory";
const history = createHistory();

const { Meta } = Card;

class Profile extends Component {
   constructor(props) {
    super(props);
     this.state = {
       isLoggedIn: false,
       user: {},
       profile:[],
       token:'',
    };
  //this.handleSubmit= this.handleSubmit.bind(this);
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
      .get("http://localhost:8081/api/profile?secret_token="+this.state.token,
        {headers :  {'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.state.token}})
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
          // alert(json.data.success);
            this.setState({profile: json.data.user });
        } else {
         // alert(`data not found !`);
        }
      })
      .catch(error => {
       // alert("An Error Occured!");
      });
      console.log(this.state.total);
  }

render() {

   if(!this.state.isLoggedIn){
      return <Index history={history}/>
    }

  return(
    <div style={{maxWidth:"400px",margin:"auto"}}>
     <Card
    style={{ maxWidth: 300 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <Icon type="setting" key="setting" />,
      <Icon type="edit" key="edit" />,
      <Icon type="ellipsis" key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title={this.state.profile["nickname"]}
    /><br/>
     <p>
     sexe : {this.state.profile["sexe"]}
     </p> 
     <p>
     Email : {this.state.profile["email"]}
     </p>   
  </Card>
  </div>
    );
 }
}
export default Profile;