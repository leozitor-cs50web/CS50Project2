# Project 2

Web Programming with Python and JavaScript

*Description about the Flack real time chat*

Completed all features required and the personal touch was the possibility to delete the user own messages. Layout designed using bootstrap. Whole project is compound by:


* `index.html` Main html app page.
* `application.py` Flask backend server
* `index.js` client side responsible to the communication with the server
* `index.css` styled sheet for the `index.html`  

**Index.html**

Web Chat page divided in 2 columns, first for channels selection and current online users, second column for the messages and text area for the user to send the message and a modal for the first time  user logs in, to  insert the nickname.

**Application.py**

`index`
Routes to render the main page

`add user`
Receives the username and verify if the user exists then stores the username, channel "General" as it is a new user and the sid of the connection, after it sends, the list of current users and the list of current channels, to the html page.

`send message`
Receives the data containing the text message, time stamp and  user sender, checks if the channel messages are below 100 messages limit, stores at a dictionary with the channel's name as a key and then sends, the list of messages of that specific channel, to the html page,

`user connected`
Receives channel name, joins the user to the room channel and then sends, the messages of that channel, to the html page.

`create channel`  
Receives channel name, stores at list channels and create a new key at dictionary messages to stores the messages and after sends the channel name for the html page to create the new html element.

`change channel`
Receives the current channel that the user was, get the user sid and removes the user from all of rooms he was, joins the user to the new channel room selected and send the messages of the new room to the html page.

`remove message`
Receives the data containing message, timestamp, username and channel, search this message in the channel's message list and pops the message found, and send to the html page, the new channel messages without the removed message.

`disconnect`

Request the user sid to find the user disconnected, pops the sid from the dictionary of users_sid and verify if the user really closed the page or if he only reconnected/refreshed the page, if disconnected, the username is removed from the users list and the sid is removed from the user_sid.

**index.js**

creates the socket to maintain RTC with the flask server.

`socket.on(connect)`
Runs after client connection, to configure the buttons for channel creation, sending messages and to launch the modal for the user to input nickname, in addition it controls the localStorage  username variable, this way the web browser stores the nickname even if the  user reloads the page.

`socket.on(welcome user)`

Receives from the server, the user list and channel list, for the script to load the current channels available, online users and creates those elements. If first time the user enters the application, creates a local storage variable to store the previous selected channel.

`socket.on(user removed)`

Receives the user list from the server, to reload the current users that are online.

`socket.on(announce message)`

Receives the data from the server and reloads all the messages from the current channel. sets the on click function of each item of the list channel, this way the user can change between channels selecting the channel.

`announce channel creation`

Receives the current channel list, and creates all the elements of each channel available

`reset channel`

Sends the user to the General channel and resets the local storage SelectedChannel variable and sends to connect again. This is for only in case of user webpage is still opened and the server restarts.

`createMessage`

Function to create all the html elements for news messages.

`createUserTag`

Function to create all the html elements for users.

`getTime`

Function to get the timestamp for the message.
