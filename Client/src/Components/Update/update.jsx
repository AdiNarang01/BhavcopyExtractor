import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { notification } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Get from '../API/get';

const Update = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [fields, setFields] = useState([]);
    const [form] = Form.useForm();

    const openNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
        });
    };

    useEffect(() => {
        const datacheck = location.state || [];
        if (datacheck.length === 0) {
            openNotification('error', 'Error', 'No data found, please provide data.');
            navigate("/");
        } else {
            const mappedFields = datacheck.map(item => item.fields);
            setFields(mappedFields);
            if (mappedFields.length > 0) {
                form.setFieldsValue({
                    code: mappedFields[0].code,
                    name: mappedFields[0].name,
                    open: mappedFields[0].open,
                    high: mappedFields[0].high,
                    low: mappedFields[0].low,
                    close: mappedFields[0].close,
                });
            }
        }
    }, [location.state, navigate, form]);

    const data = location.state || [];

    const onFinish = async (values) => {
        console.log('Form values:', values);

        if (values.high < values.low || values.close>values.high || values.close<values.low) {
            openNotification('error', 'Error', 'Close Price Is Invalid');
        }

        else {
            const json = {
                model: data[0].model,
                pk: data[0].pk,
                fields: {
                    "code": values.code,
                    "name": values.name,
                    "open": values.open,
                    "high": values.high,
                    "low": values.low,
                    "close": values.close,
                }
            };
            console.log(json);
            const jsoncheck = JSON.stringify(json);
            console.log(jsoncheck);
            openNotification('success', 'Success', 'Form submitted successfully');
            try {
                await axios.patch('http://127.0.0.1:8000/fetchdate/update-data/', jsoncheck, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                openNotification('success', 'Success', 'Data updated successfully');
                const res = await Get(1, 10);
                console.log(res);
                navigate('/overview', { state: res });
            } catch (error) {
                console.error('Error updating data:', error);
                openNotification('error', 'Error', 'An error occurred while updating the data.');
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            {fields.length > 0 ? (
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Code"
                        name="code"
                        rules={[{ required: true, message: 'Please enter the code!' }]}
                    >
                        <Input type="number" placeholder="xxxxxx" />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the name!' }]}
                    >
                        <Input placeholder="Stock Name (e.g., Adani Power)" />
                    </Form.Item>

                    <Form.Item
                        label="Open Price"
                        name="open"
                        rules={[{ required: true, message: 'Please enter number!' }]}
                    >
                        <Input type="number" placeholder="Open Price" />
                    </Form.Item>

                    <Form.Item
                        label="High Price"
                        name="high"
                        rules={[{ required: true, message: 'Please enter number!' }]}
                    >
                        <Input type="number" placeholder="High Price" />
                    </Form.Item>

                    <Form.Item
                        label="Low Price"
                        name="low"
                        rules={[{ required: true, message: 'Please enter the number!' }]}
                    >
                        <Input type="number" placeholder="Low Price" />
                    </Form.Item>

                    <Form.Item
                        label="Close Price"
                        name="close"
                        rules={[{ required: true, message: 'Please enter the number!' }]}
                    >
                        <Input type="number" placeholder="Close Price" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Update;
