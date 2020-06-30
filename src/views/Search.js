import React from 'react';
import { Card, Button } from 'antd';
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

  const searchUser = () => {
    axios
      .get('https://api.twitch.tv/helix/users', {
        params: {
          login: 'randomUser',
        },
        headers: {
          'client-id': 'sciiojcxbu9tph69yktsb208j2kb7r',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(function (response) {
        if (response.data.data.length > 0) {
          console.log(response);
        } else {
          console.log('no such user exist');
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
    <Card title='Search Streamer' className='text-center' style={{ width: 300 }}>
      <Button type='primary' size='large' onClick={searchUser}>
        Search
      </Button>
    </Card>,
  ];
}

export default Search;
