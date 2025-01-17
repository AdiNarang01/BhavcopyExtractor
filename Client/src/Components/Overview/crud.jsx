import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import css from './crud.module.css';
import { Button, Form, Input } from 'antd';
import { Table } from 'antd';
import axios from 'axios';
import Get from '../API/get';
import GetC from '../API/get_count';
import { Pagination } from "antd";

const Crud = () => {
  const [ShowButton, SetShowButton] = useState(false);
  const [OButton, SetOButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ffields, setffields] = useState(null);
  const [fdata, setfdata] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState([]);
  const [fields, setField] = useState([]);
  const [Toggle, SetToggle] = useState(true);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  useEffect(() => {
    const datacheck = location.state || [];
    if (datacheck.length === 0) {
      openNotification('error', 'Error', 'Enter date');
      navigate("/");
    }
  
    const getData = async () => {
      const tdata = await Get(currentPage, 10);
      await setData(tdata);
    };
  
    const fetchTotalCount = async () => {
      const count = await GetC();
      if (count !== null) {
        setTotalCount(count);
      }
    };
  
    getData();
    fetchTotalCount();
  }, [Toggle]);

  useEffect(() => {
    if (data && data.length > 0) {
      const f = data.map(item => item.fields);
      setField(f);
    }
  }, [data]);
  

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = {
    Code: "",
    Name: "",
  };

  const SearchData = async (code_u, name_u) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/fetchdate/search/', { params: { code: code_u, name: name_u } });
      setfdata(response.data);
      setffields(response.data.map(item => item.fields));
      SetOButton(true);
      if (response.data.length === 0)
      SetOButton(false);
    } catch (error) {
      console.error('Error sending date to server:', error);
      openNotification(
        'error',
        'Error',
        'An error occurred while fetching date from the server. Please try again.'
      );
    }
  };

  const Delete = async () => {
    try {
      await axios.delete('http://127.0.0.1:8000/fetchdate/delete-data/', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: fdata[0],
      });
      openNotification('success', 'Success', 'Data deleted successfully');
      form.resetFields();
      SetToggle(Toggle + 1);
      SetShowButton(false);
      SetOButton(false);
    } catch (error) {
      console.error('Error sending date to server:', error);
      openNotification(
        'error',
        'Error',
        'An error occurred while deleting date from the server. Please try again.'
      );
    }
  };

  const onFinish = (values) => {
    if ((values.Code === undefined || values.Code === "") && (values.Name === undefined || values.Name === "")) {
      openNotification('error', 'Error', 'Please enter field to search');
      setffields([]);
    }

    else {
      SetShowButton(true);
      SearchData(values.Code, values.Name);
    }

  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    SetToggle(!Toggle);
  };

  const columns = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Name', dataIndex: 'name', key: 'code' },
    { title: 'Open', dataIndex: 'open', key: 'code' },
    { title: 'High', dataIndex: 'high', key: 'code' },
    { title: 'Low', dataIndex: 'low', key: 'code' },
    { title: 'Close', dataIndex: 'close', key: 'code' }
  ];

  return (
    <div className={css.Structure}>

      <div className={css.Search}>
        <Form form={form} layout="inline" style={{ maxWidth: 'none' }} onFinish={onFinish} initialValues={initialValues}>
          <Form.Item
            label="Code"
            name="Code"
            rules={[
              {
                pattern: /^\d{6}$/, // Regular expression for 6 numeric characters
                message: 'Code must be exactly 6 numeric characters!',
              }
            ]}>
            <Input placeholder="xxxxxx" />
          </Form.Item>
          <Form.Item label="Name" name="Name">
            <Input placeholder="Adani Power" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Search</Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => { SetShowButton(false); SetOButton(false); form.resetFields(); }}>Clear</Button>
          </Form.Item>
        </Form>
      </div>

      <div className={css.Table} style={{ display: !ShowButton ? 'inherit' : 'none' }}>
        <Table columns={columns} dataSource={fields}  pagination={false}/>
      </div>
      
      <div className={css.PageNation} style={{ display: !ShowButton ? 'inherit' : 'none' }}>
      <Pagination align="end" current={currentPage}
        pageSize={10}
        onChange={handlePageChange}
        total={totalCount}
        showSizeChanger={false}  // Optional, to hide the size changer
      />
      </div>

      <div className={css.Backbutton} style={{ display: !ShowButton ? 'inherit' : 'none' }}>
        <Button type="primary" onClick={() => { navigate('/') }}>Change-Date</Button>
      </div>

      <div className={css.Table} style={{ display: ShowButton ? 'inherit' : 'none' }}>
        <Table columns={columns} dataSource={ffields} />
      </div>

      <div className={css.Buttons}>

        <div className={css.GetButton} style={{ display: OButton ? 'inherit' : 'none' }}>
          <Button type="primary" onClick={() => { navigate('/update', { state: fdata }); form.resetFields(); }}>Update</Button>
        </div>

        <div className={css.GetButton} style={{ display: OButton ? 'inherit' : 'none' }}>
          <Button type="primary" onClick={Delete}>Delete</Button>
        </div>
      </div>

    </div>
  );
};

export default Crud;
