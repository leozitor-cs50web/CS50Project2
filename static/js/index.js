
document.addEventListener('DOMContentLoaded', () => {
    // global var about last channel
    var selectedChannel;
    var userName;
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    // When connected, configure buttons
    socket.on('connect', () => {
        //create channel Button
        document.querySelector('#channelCreate').onclick = () => {
            // Create new item for channel list
            if (document.querySelector('#channelInput').value.length > 0) {
                const channel = document.querySelector('#channelInput').value;
                // Clear input field
                document.querySelector('#channelInput').value = '';
                socket.emit('create channel', channel);
            }
            // Stop form from submitting
            return false;
        };
        // Send button
        document.querySelector('#sendBtn').onclick = () => {
            if (document.querySelector('#textMessage').value.length > 0){
                const message = document.querySelector('#textMessage').value;
                //clear input field
                document.querySelector('#textMessage').value = '';
                socket.emit('send Message', message);
            }
            // stop form from submitting
            return false;
        }
        // Look to see if user has been here before. If not, pop up modal.
        if (!localStorage.getItem('userName')) {
            // Set up Modals (there is only one)
            $('#userNameModalCenter').modal();
            // when click modal button
            document.querySelector('#modalBtn').onclick = () => {
                userName = document.querySelector('#userName').value;
                localStorage.setItem('userName', userName);
                document.querySelector('#user').innerHTML = `Welcome ${userName}`;
                socket.emit('add user', userName);
            }
        } else { // check the user already exists
            userName = localStorage.getItem('userName');
            document.querySelector('#user').innerHTML = `Welcome ${userName}`;
            socket.emit('add user', userName);
        }
    });

    socket.on('welcome user', data => {
        //debugger;
        const users = data["usersList"];
        const channels = data["channelsList"];
        //resetting usersList and recreating first nav item
        let itm = document.querySelector('#usersList').firstElementChild;
        document.querySelector('#usersList').innerHTML = "";
        document.querySelector('#usersList').appendChild(itm);
        // creating user list with the user array
        for ( i = 0; i<users.length; i++) {
            document.querySelector('#usersList').append(createUserTag(users[i]));
        }
        //resetting Channels list and recreating first nav item
        itm = document.querySelector('#channelsList').firstElementChild;
        document.querySelector('#channelsList').innerHTML = "";
        document.querySelector('#channelsList').appendChild(itm);
        // creating channels list with the channel array
        for ( i = 0; i<channels.length; i++) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            li.className = "nav-item"; // setting li as nav item
            a.className = "nav-link active px-5" //  setting a as nav-link item
            a.href = "#"
            a.innerHTML = `# ${channels[i]}`;
            //debugger;
            const channelName = channels[i]
            a.addEventListener('click', function () {
                localStorage.setItem('selectedChannel', channelName);
                document.querySelector('#roomName').innerHTML = channelName;
                socket.emit('change channel', channelName);
            });
            li.appendChild(a);
            document.querySelector('#channelsList').appendChild(li);
        }

        //first time entering sets channel to General or recovers last channel
        if (!localStorage.getItem('selectedChannel')) {
            selectedChannel = "General";
            localStorage.setItem('selectedChannel', selectedChannel);
        }else{
            selectedChannel = localStorage.getItem('selectedChannel');
        }
        document.querySelector('#roomName').innerHTML = selectedChannel;
        socket.emit('user connected', selectedChannel);
    });

    socket.on('user removed', user =>{
        //resetting usersList and recreating first nav item
        const itm = document.querySelector('#usersList').firstElementChild;
        document.querySelector('#usersList').innerHTML = "";
        document.querySelector('#usersList').appendChild(itm);
        // creating user list with the user array
        for ( i = 0; i<user.length; i++) {
            document.querySelector('#usersList').append(createUserTag(user[i]));
        }
    });

    //announce room messages
    socket.on('announce messages',data =>{
        //clean all messages
        document.querySelector('#conversationList').innerHTML = "";
        // create room messages
        for ( m = 0; m < data.length; m++) {
            const li = document.createElement('li');
            li.className = "list-group-item";
            li.innerHTML = data[m];
            document.querySelector('#conversationList').append(li);
            console.log(data[m]);
        }
    });

    // anouncing channel creation
    socket.on('announce channel creation', data => {
        // Add new item to task list
        const li = document.createElement('li');
        const a = document.createElement('a');
        li.className = "nav-item"; // setting li as nav item
        a.className = "nav-link active px-5" //  setting a as nav-link item
        a.href = "#"
        a.innerHTML = `# ${data}`;
        a.onclick = function () {
            localStorage.setItem('selectedChannel', data);
            document.querySelector('#roomName').innerHTML = data;
            socket.emit('change channel', data);
        }
        li.appendChild(a);
        document.querySelector('#channelsList').append(li);
        selectedChannel = data;

    });

    socket.on('channelError', () => {
        alert('Room Name already exists! Choose another one!');
    });

   socket.on('reset channel', () => {
       //debugger;
       //send user back to General channel
        localStorage.setItem('selectedChannel', "General");
        document.querySelector('#roomName').innerHTML = "General";
        socket.emit('user connected', "General");
   });

});


function createUserTag(data){
    const li = document.createElement('li');
    const a = document.createElement('a');
    li.className = "nav-item"; // setting li as nav item
    a.className = "nav-link active px-5" //  setting a as nav-link item
    a.href = "#"
    a.innerHTML = `# ${data}`;
    li.appendChild(a);
    return li
}


