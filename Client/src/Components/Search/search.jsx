import React from 'react';
import { Button, Form, Input } from 'antd';

const Search = () => {

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    return (
        <Form
            layout="inline"
            style={{
                maxWidth: 'none',    
            }}
            onFinish={onFinish}
        >
            <Form.Item label="Code" name="Code">
                <Input placeholder="xxxxxx" />
            </Form.Item>
            <Form.Item label="Name" name="Name">
                <Input placeholder="Adani Power" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Search</Button>
            </Form.Item>
        </Form>
    );
};

export default Search;
