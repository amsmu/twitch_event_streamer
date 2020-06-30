import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import Websocket from 'react-websocket';
const axios = require('axios');

function Dashboard(props) {
  const username = props.match.params.username;
  const [user, setuser] = useState({});
  let refWebSocket = null;

  let newAuthToken = props.location.hash.split('&')[0].split('=')[1];
  if (newAuthToken) {
    localStorage.setItem('authToken', newAuthToken);
  }

  const authToken = localStorage.getItem('authToken');

  if (!authToken || username.length == 0) {
    props.history.push('/login');
  }

  const searchUser = () => {
    axios
      .get('https://api.twitch.tv/helix/users', {
        params: {
          login: username,
        },
        headers: {
          'client-id': 'sciiojcxbu9tph69yktsb208j2kb7r',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(function (response) {
        if (response.data.data.length > 0) {
          setuser(response.data.data[0]);
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

  useEffect(() => {
    searchUser();

    return () => {};
  }, []);

  const sendMessage = (message) => {
    refWebSocket.sendMessage(message);
  };

  const onMessage = (data) => {
    console.log(data);
    if (JSON.parse(data).type == 'PONG') {
      sendMessage(
        JSON.stringify({
          type: 'LISTEN',
          nonce: 'int-demo-123214214324324' + user.id,
          data: {
            topics: ['channel-subscribe-events-v1.' + user.id],
            auth_token: authToken,
          },
        })
      );
    }
  };

  return [
    <iframe
      src={'https://player.twitch.tv/?channel=' + username + '&parent=localhost'}
      frameborder='0'
      allowfullscreen='true'
      scrolling='no'
      height='378'
      width='620'
    ></iframe>,
    <iframe
      id='chat_embed'
      src={'https://www.twitch.tv/embed/' + username + '/chat?parent=localhost'}
      height='500'
      width='350'
    ></iframe>,
    <Websocket
      url='wss://pubsub-edge.twitch.tv'
      onOpen={() =>
        sendMessage(
          JSON.stringify({
            type: 'PING',
          })
        )
      }
      onMessage={onMessage}
      ref={(Websocket) => {
        refWebSocket = Websocket;
      }}
    />,
  ];
}

export default Dashboard;
