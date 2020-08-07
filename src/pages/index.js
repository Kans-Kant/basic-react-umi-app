import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

import axios from 'axios';

import createHistory from "history/createBrowserHistory";
const history = createHistory();

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
       isLoggedIn: false,
      user: {},
      errors :'',
    };
    this.handleSubmit=this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        axios
      .post("http://localhost:8081/api/login",values)
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
          let userData = {
            token: json.data.token
          };
          let appState = {
            isLoggedIn: true,
            user: userData
          };
          // save app state with user date in local storage
          localStorage["appState"] = JSON.stringify(appState);
          this.setState({
            isLoggedIn: appState.isLoggedIn,
            user: appState.user
          });
        } else{
          this.setState({
            errors : " Login Failed! "
          });
        }
        this.props.history.push('/admin');
         window.location.reload();
      })
      .catch(error => {
        this.setState({
            errors : " Mot de Passe ou Email Incorrect "
          });
      });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form" style={{width:"100%"}}>
      {this.state.errors ? <p style={{color:"blue",fontSize:"20px"}}> {this.state.errors}</p>  : ''}
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ type:'email', required: true, message: 'Please input your email!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="" style={{float:"right"}}>
            Forgot password
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{width:"100%"}}>
            Log in
          </Button>
          Or <a href="/register">register now!</a>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Index);
