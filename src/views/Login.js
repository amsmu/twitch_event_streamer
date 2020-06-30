import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Button } from 'antd';

function Login(props) {
  if (localStorage.getItem('authToken')) {
    props.history.push('/');
  }
  return [
    <Card title='Login' className='text-center' style={{ width: 300 }}>
      <Button
        type='primary'
        size='large'
        onClick={() =>
          (window.location.href =
            'https://id.twitch.tv/oauth2/authorize?client_id=sciiojcxbu9tph69yktsb208j2kb7r&redirect_uri=http://localhost:3000&response_type=token')
        }
      >
        Login with Twitch
      </Button>
    </Card>,
  ];
}

export default withRouter(Login);
