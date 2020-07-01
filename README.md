
**Note: Beautiful UI is not the focus of this project at all.**

This project leverages the Twitch new APIs(helix), for example, Twitch oAuth(implicit mode), twitch get users, and more.

The main utility of this project is to provide a search functionality to user where you set a streamer's account and then you can view their live stream, live chat and recent 10 events on the same screen. Login, search is pretty simple use case of RESTful APIs and embedding live stream and live chat isn't rocket science. 

But, getting recent 10 events is the place where some trickery takes place. Twitch's PubSub APIs doesn't provide data for anyone else's account untill they themselves authorise the app to be able to use their data. Twitch's chat is nothing but IRC running on Websockets. So, I've connected the websocket in the app to the chat and the chat recieves majorly two kind of messages (USERNOTICE and PRIVMSG) and they aren't in easy to read format so they are being parsed using custom function: messageKeyValueExtractor().

This project doesn't require a backend for such requirements, especially when Twitch new API's provide implicit mode for oAuth which is for running on the client.

## Currently the app is hosted on Heroku

You can access [the app here](https://twitch-event-streamer.herokuapp.com/)

## If you need to deploy it on AWS

Then conventional way would be to host on EC2 but there is even better way to host React Apps, i.e., using S3 and cloudfront. They build that is generated can be hosted on those services and you'll get the benefit of CDN (cloudfront). As this is client side rendered and functionality isn't backend dependent so it can scale to hundereds of millions of users just by cloudfront itself. Even if you want to introduce let's say Node.js server for authentication API because of whatever reason then you can user Kubernetes for orchastrating multiple instances of nodejs containers.

You can access [the app here](https://twitch-event-streamer.herokuapp.com/)

