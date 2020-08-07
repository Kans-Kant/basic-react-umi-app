import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import Index from '../index';

import { Table, Input, InputNumber, Popconfirm, Form, Divider,Badge,Dropdown,Menu,Icon } from 'antd';

import createHistory from "history/createBrowserHistory";
const history = createHistory();

   const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);
  

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'text') {
      return <Input />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      data:[], 
      editingKey: '',
       hasData: true,
       user:{},
       produits:[],
       isLoggedIn:'',
       token:'',
       Img:'',
       errors:'',
      
       };

    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        width: '15%',
        editable: true,
      },
      {
        title: 'address',
        dataIndex: 'address',
        width: '25%',
        editable: true,
      },
        {
        title: 'Status',
        dataIndex: 'status',
        width: '15%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
          <span>
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Edit
            </a>
            <Divider type="vertical" />
             <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm></span>
          );
        },
      },
    ];
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
      .get("http://localhost:8081/api/produit?secret_token="+this.state.token,
        {headers :  {'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.state.token}})
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
           console.log(json.data.success);
             this.state.produits = json.data.produits;
             const prod=[];
             this.state.produits.map(produit=>{
             prod.push({
             key:produit._id,//.toString(),
             name: produit.name,
             price: produit.price+" "+produit.devise,
             address: produit.lieu[0]+" | "+produit.lieu[1]+" | "+produit.lieu[2],
             status : produit.status,
             description: produit.description+" au prix de "+produit.price+produit.devise+" à "+produit.lieu[2]+" au score de nouveauté (qualité) de "+produit.status,
           })
           })
            this.setState({data: prod });
        } else {
          this.setState({errors:'No data Found!' });
        }
      })
      .catch(error => {
         this.setState({errors:'An Error Occured!' });
      });
      console.log(this.state.data);
  }
//

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {

      const prix   = row.price.split(" ");
      const val    = row.address.split(" | ");
      const lieu   = [];
      lieu.push(val[0]);
      lieu.push(val[1]);
      lieu.push(val[2]);
      const name   = row.name;
      const status = row.status;

      console.log(lieu);
      if (error) {
        return;
      }
     axios
      .post("http://localhost:8081/api/updatep?secret_token="+this.state.token,
        {
          id     : key,
          lieu   : lieu,
          price  : prix[0],
          devise : prix[1],
          name   : name,
          status : status,
        },
        {headers :  {'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.state.token}})
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
           //alert(json.data.success);
         }
       });

      const newData = this.state.data;//[...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

   handleDelete = key => {
    const dataSource = this.state.data;//[...this.state.data];
     axios
      .post("http://localhost:8081/api/deletep?secret_token="+this.state.token,{id :key},
        {headers :  {'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.state.token}})
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
          this.setState({errors:json.data.msg});
          this.setState({ data: dataSource.filter(item => item.key !== key) });
        }else this.setState({errors:json.data.msg});
      })
  };
  expandedRowRender = record => <div >{
     this.displays(record.key)
    }
     {this.state.Img ? <img style={{ maxWidth: 200,maxHeight:100 }} src={`data:image/png;base64,${this.state.Img}`}/>: 'salut'}
     <div>
     {record.description}
     </div >
    </div>;

  displays  = e =>{
    axios
      .post("http://localhost:8081/api/display?secret_token="+this.state.token,
        { idp : e},
        {headers :  {'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.state.token}})
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
           console.log(json.data.success);
            this.setState({Img: json.data.image.data });
        } else {
          this.setState({errors:'No data Found!'});
        }
      })
      .catch(error => {
        this.setState({errors:'An Error Occured'});
      })
  }


  edit(key) {
    this.setState({ editingKey: key });
  }


  render() {

     if(!this.state.isLoggedIn){
      return <Index history={history}/>
    }

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

     if(!this.state.isLoggedIn){
      return <Index/>
      }

      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'price' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
       {this.state.errors ? <p style={{color:"blue",fontSize:"20px"}}> {this.state.errors}</p>  : ''}
        <Table
          components={components}
          bordered
          title={() => 'All Products'}
          footer={() => '@Footer'}
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
          onChange: this.cancel,
          }}
          expandedRowRender={this.expandedRowRender}
        />
      </EditableContext.Provider>
     );
    }
}
export default Form.create()(Products);