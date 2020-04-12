document.addEventListener('DOMContentLoaded', () => {

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure buttons
  socket.on('connect', () => {

    document.querySelector('#channelCreate').onclick = () => {

      // Create new item for list
      if (document.querySelector('#channelInput').value.length > 0){
        const channel = document.querySelector('#channelInput').value;
        const channelSelection = "# ".concat(channel);
        // Clear input field
        document.querySelector('#channelInput').value = '';
        socket.emit('create channel', channelSelection);
      }

      // Stop form from submitting
      return false;
    };

    // Look to see if user has been here before. If not, pop up modal.
    if (!localStorage.getItem('userName')) {
        // Set up Modals (there is only one)
        $('#userNameModalCenter').modal();
    }else {
      const name = localStorage.getItem('userName');
      document.querySelector('#user').innerHTML = name;
    }
  });

  // anouncing channel creation
  socket.on('announce channel creation', data => {
    const li = document.createElement('li');
    li.className = "nav-item"; // setting li as nav item
    li.innerHTML = "<a style=\"font-size: 18px; color:black;\" class=\"nav-link active px-5\" href=\"#\"> " + data + " </a>"; // creating a tag

    // Add new item to task list
    document.querySelector('#channelsList').append(li);

  });

  socket.on('error', () =>{
      alert('Room Name already exists! Choose another one!');
  });

});


// javascript functions
function getName() { // setting nickname of user name
  const name = document.querySelector('#userName').value;
  const userName = "Welcome  ".concat(name);
  localStorage.setItem('userName', userName);
  document.querySelector('#user').innerHTML = userName;
}
