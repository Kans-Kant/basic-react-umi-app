import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
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
  AutoComplete,
} from 'antd';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

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

class Register extends Component {
   constructor(props) {
    super(props);
  this.state = {
    confirmDirty: false,
    autoCompleteResult: [],
    errors:'',
  };
  this.handleSubmit= this.handleSubmit.bind(this);
  this.handleConfirmBlur= this.handleConfirmBlur.bind(this);
  this.compareToFirstPassword= this.compareToFirstPassword.bind(this);
  this.validateToNextPassword= this.validateToNextPassword.bind(this);
  this.handleWebsiteChange= this.handleWebsiteChange.bind(this);
 }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        axios
      .post("http://localhost:8081/api/register",values)
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
          this.setState({errors:json.data.msg });
        } else {
          this.setState({errors:`Registration Failed!` });
        }
      })
      .catch(error => {
       this.setState({errors:`An Error Occured!!` });
      });
      }
    });
  };

  handleConfirmBlur (e) {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword(rule, value, callback) {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword(rule, value, callback) {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleWebsiteChange(value){
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

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
    const prefixSelector = getFieldDecorator('sexe', {
      initialValue: 'Masculin',
    })(
      <Select style={{ width: 70 }}>
        <Option value="Masculin">M</Option>
        <Option value="Feminin">F</Option>
        <Option value="Autres">A</Option>
      </Select>,
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
      {this.state.errors ? <p style={{color:"blue",fontSize:"20px"}}> {this.state.errors}</p>  : ''}
        <Form.Item >
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input placeholder="Email"/>)}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password  placeholder="Password"/>)}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} placeholder="Confirm Password"/>)}
        </Form.Item>
        <span>
              &nbsp;
              <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
        <Form.Item
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          })(<Input placeholder="nickname"/>)}
        </Form.Item>
        <span>
              Habitual Residence
            </span>
        <Form.Item >
          {getFieldDecorator('residence', {
            initialValue: ['Togo', 'Lome', 'Djidjole'],
            rules: [
              { type: 'array', required: true, message: 'Please select your habitual residence!' },
            ],
          })(<Cascader options={residences} />)}
        </Form.Item>
        <Form.Item >
          {getFieldDecorator('sexe', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="Sexe"/>)}
        </Form.Item>
        <Form.Item >
          {getFieldDecorator('website', {
            rules: [{ required: true, message: 'Please input website!' }],
          })(
            <AutoComplete
              dataSource={websiteOptions}
              onChange={this.handleWebsiteChange}
              placeholder="* Website"
            >
              <Input />
            </AutoComplete>,
          )}
        </Form.Item>
        <Form.Item extra="We must make sure that your are a human.">
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: 'Please input the captcha you got!' }],
              })(<Input placeholder="Captcha" />)}
            </Col>
            <Col span={12}>
              <Button>Get captcha</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Register);