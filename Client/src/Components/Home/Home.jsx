import React, { useState } from 'react';
import { Button, DatePicker, Space, notification } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import css from './Home.module.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Get from "../API/get";
dayjs.extend(customParseFormat);

const dateFormat = 'YYMMDD';

const customFormat = (value) => `${value.format(dateFormat)}`;

const App = () => {
  const navigate = useNavigate();
  const [indexDate, setIndexDate] = useState(null);
  const [ShowButton, SetShowButton] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const handleDateChange = (date) => {
    SetShowButton(false);
    if (date) {
      const formattedDate = date.format(dateFormat);
      setIndexDate(formattedDate);
      console.log('Selected Date:', formattedDate);
    } else {
      setIndexDate(null);
    }
  };

  const sendDate = async () => {
    if (!indexDate) {
      console.log("No date");
      openNotification('error', 'Error', 'Date Not Found');
      SetShowButton(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/fetchdate/submit-date/',
        { date: indexDate }
      );

      console.log('Server Response:', response.data);
      openNotification('success', 'Success', 'Date sent successfully to the server.');
      SetShowButton(true);
    } catch (error) {
      console.error('Error sending date to server:', error);
      openNotification(
        'error',
        'Error ' + error,
        'An error occurred while sending the date to the server. Please try again later.'
      );
    }
  };

  const GetData = async () => {
    try {
      const res = await Get(1,10);  
      if (res && res.length > 0) {
        openNotification('success', 'Success', 'Fetched data successfully');
        navigate('/overview', { state: "Got data" });
      } else {
        openNotification(
          'error',
          'No Data Found',
          'The server responded but no data was returned. Please check your request or try again later.'
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      openNotification(
        'error',
        'Error',
        'An error occurred while fetching data from the server. Please try again.'
      );
    }
  };
  

  return (
    <div className={css.Main}>
      <div className={css.Search}>
        <div className={css.Heading}>
          <h1>BHAVCOPY EXTRACTOR</h1>
        </div>
        <div className={css.Form}>
          <div className={css.Date}>
            <p>Enter Date:</p>
            <Space direction="vertical">
              <DatePicker format={customFormat} onChange={handleDateChange} />
            </Space>
          </div>
          <div className={css.Button} style={{ display: !ShowButton ? 'inherit' : 'none' }}>
            <Button type="primary" onClick={sendDate}>
              Submit
            </Button>
          </div>
          <div className={css.Button} style={{ display: ShowButton ? 'inherit' : 'none' }}>
            <Button type="primary" onClick={GetData}>
              GetData
            </Button>
          </div>
        </div>
      </div>
    </div>


  );
};

export default App;
