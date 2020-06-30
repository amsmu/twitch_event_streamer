import React from 'react';
import { Card, Button, Form, Input, notification } from 'antd';
const axios = require('axios');

function Search(props) {
  let newAuthToken = props.location.hash.split('&')[0].split('=')[1];
  if (newAuthToken) {
    localStorage.setItem('authToken', newAuthToken);
  }

  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    props.history.push('/login');
  }

  const searchUser = (values) => {
    axios
      .get('https://api.twitch.tv/helix/users', {
        params: {
          login: values.streamer_name,
        },
        headers: {
          'client-id': 'sciiojcxbu9tph69yktsb208j2kb7r',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(function (response) {
        if (response.data.data.length > 0) {
          props.history.push('/view/' + values.streamer_name);
        } else {
          notification.error({ message: 'No such user exists' });
        }
      })
      .catch(function (error) {
        if (error.status == 401) {
          localStorage.setItem('authToken', null);
          props.history.push('/login');
        }
      })
      .finally(function () {
        // always executed
      });
  };

  return [
    <Card title='Search Streamer' style={{ maxWidth: 800, margin: '10em auto' }}>
      <Form onFinish={searchUser} size='large'>
        <Form.Item label='Enter Streamer name' name='streamer_name'>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' size='large'>
            Search
          </Button>
        </Form.Item>
      </Form>
    </Card>,
  ];
}

export default Search;
