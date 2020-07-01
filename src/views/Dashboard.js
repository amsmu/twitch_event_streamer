import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import Websocket from 'react-websocket';
const axios = require('axios');

function Dashboard(props) {
  const username = props.match.params.username;
  const messageTypes = {
    sub: ' subscribed',
    resub: ' resubscribed',
    subgift: ' gifted subscription',
    primepaidupgrade: ' upgraded from free Prime Subscription',
    giftpaidupgrade: ' gifted subscription upgrade',
    raid: ' raided this channel',
  };
  const [user, setuser] = useState({});
  const [events, setEvent] = useState([]);
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
        console.log(response);
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
      });
  };

  useEffect(() => {
    searchUser();

    return () => {};
  }, []);

  const sendMessage = (message) => {
    refWebSocket.sendMessage(message);
  };

  const messageKeyValueExtractor = (text, key) => {
    let keySeparatedData = text.split(';' + key + '=');
    return keySeparatedData[1].split(';')[0];
  };

  const onMessage = (data) => {
    // Parsing chat messages
    let privMessageData = data.split('PRIVMSG');
    if (privMessageData.length == 2) {
      let newEventsArray = Object.assign([], events);
      newEventsArray.push(messageKeyValueExtractor(privMessageData[0], 'display-name') + ' sent a message');
      if (newEventsArray.length > 10) {
        newEventsArray.shift();
      }
      setEvent(newEventsArray);
    }
    // Parsing user notice type messages
    let userNoticeData = data.split('USERNOTICE');
    if (userNoticeData.length == 2) {
      let newEventsArray = Object.assign([], events);
      newEventsArray.push(
        messageKeyValueExtractor(privMessageData[0], 'display-name') +
          messageTypes[messageKeyValueExtractor(privMessageData[0], 'msg-id')]
      );
      if (newEventsArray.length > 10) {
        newEventsArray.shift();
      }
      setEvent(newEventsArray);
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
    <div>
      <h2>10 Recent events</h2>
      {events.map((event, index) => (
        <h3>{event}</h3>
      ))}
    </div>,
    <Websocket
      url='wss://irc-ws.chat.twitch.tv:443'
      onOpen={() => {
        sendMessage('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        sendMessage('PASS oauth:' + authToken);
        sendMessage('NICK myusername');
        sendMessage('JOIN #' + username);
      }}
      onMessage={onMessage}
      ref={(Websocket) => {
        refWebSocket = Websocket;
      }}
    />,
  ];
}

export default Dashboard;
