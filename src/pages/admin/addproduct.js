import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Index from '../index';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  Dragger,
  Upload,
  Rate,
} from 'antd';

import createHistory from "history/createBrowserHistory";
const history = createHistory();

const { Option } = Select;

const residences = [
  {
    value: 'Togo',
    label: 'Togo',
    children: [
      {
        value: 'Lome',
        label: 'Lome',
        children: [
          {
            value: 'Djidjole',
            label: 'Djidjole',
          },
        ],
      },
    ],
  },
  {
    value: 'Maroc',
    label: 'Maroc',
    children: [
      {
        value: 'Marrakech',
        label: 'Marrakech',
        children: [
          {
            value: 'Saada',
            label: 'Saada',
          },
        ],
      },
    ],
  },
];

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
       isLoggedIn: false,
       user: {},
       file:'',
       filepath:'',
       errors:'',

    };
  this.handleSubmit= this.handleSubmit.bind(this);
  //this.normFile= this.normFile.bind(this);

  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
         values.upload=this.state.filepath;
        console.log('Received values of form: ', values);

   axios
      .post("http://localhost:8081/api/produit?secret_token="+this.state.user.user.token,values,
        {headers :  {
          'Content-Type': 'application/json' ,
          'Authorization': 'Bearer ' + this.state.user.user.token}})
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
          this.setState({errors:json.data.msg});
        } else {
         this.setState({errors:"Adding Failed!"});
        }
      })
      .catch(error => {
        this.setState({errors:"An Erro Occured!"});
      });
      }
    });
  };

   componentDidMount() {
   // this.focusEditor();
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      console.log(AppState);
      this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState });
    }
  }

   /*normFile(e) {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };*/


  render() {

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
   const scope = this;
    const props = {
        name: 'image',
        multiple: false,
        method : 'post',
        action: 'http://localhost:8081/api/photo',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }

            if (status === 'done') {
              scope.setState({filepath: info.file.response.image , errors:`${info.file.name} file uploaded successfully.`});
            } else if (status === 'error') {
                 scope.setState({errors:`${info.file.name} file upload failed.`});
            }
        },
    };

    const prefixSelector = getFieldDecorator('devise', {
      initialValue: '$',
    })(
      <Select style={{ width: 70 }}>
        <Option value="£">£</Option>
        <Option value="$">$</Option>
        <Option value="F">F</Option>
      </Select>,
    );

    if(!this.state.isLoggedIn){
      return <Index history={history}/>
    } 

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item >
          {getFieldDecorator('name', {
            rules: [

              {
                required: true,
                message: 'name is required',
              },
            ],
          })(<Input placeholder="Product Name"/>)}
        </Form.Item>
        <Form.Item >
          {getFieldDecorator('category', {
            rules: [
              {
                required: true,
                message: 'enter a category',
              }
            ],
          })(<Input  placeholder="Product category"/>)}
        </Form.Item>
        <span>
              &nbsp;
              <Tooltip title="give a brief description of the Product?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
        <Form.Item >
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'bried description required', whitespace: true }],
          })(<Input placeholder="description"/>)}
        </Form.Item>
        <span>
              Lieu ou se trouve le Produit ?
            </span>
        <Form.Item >
          {getFieldDecorator('lieu', {
            initialValue: ['Togo', 'Lome', 'Djidjole'],
            rules: [
              { type: 'array', required: true, message: 'select a place!' },
            ],
          })(<Cascader options={residences} />)}
        </Form.Item>
        <Form.Item >
          {getFieldDecorator('price', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="Price"/>)}
        </Form.Item>
        <span>status of Product</span>
        <Form.Item >
          {getFieldDecorator('score', {
            initialValue: 3.5,
          })(<Rate />)}
        </Form.Item>
        <span>Choose Image</span>
       <Form.Item >
          {getFieldDecorator('upload', {
          
          })(
            <Upload {...props}
            listType="picture-card">
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Ajouter
          </Button>
        </Form.Item>
         {this.state.errors ? <p style={{color:"blue",fontSize:"20px"}}> {this.state.errors}</p>  : ''}
      </Form>
    );
  }
}

export default Form.create()(AddProduct);