const socket = new WebSocket('ws://localhost:3000');


const username = prompt('Enter your username:');
if (username) {
  localStorage.setItem('username', username);
}

socket.onmessage = (event) => {
  const msgobj = event.data;
  const reader = new FileReader();

  reader.onload = () => {
    const msg = reader.result;
    storeMessage(msg);
    displayMessages();
  };
  reader.readAsText(msgobj);
};

function storeMessage(msg) {
  const messages = localStorage.getItem('messages');

  if (messages) {
    const pmgs = JSON.parse(messages);
    pmgs.push(`${username}: ${msg}`);
    localStorage.setItem('messages', JSON.stringify(pmgs));
  } else {
    const fmsg = [`${username}: ${msg}`];
    localStorage.setItem('messages', JSON.stringify(fmsg));
  }
}

function displayMessages() {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = '';
  const messages = localStorage.getItem('messages');

  if (messages) {
    const pmsg = JSON.parse(messages);
    pmsg.forEach((msg) => {
      if (msg.startsWith(`${username}:`)) {
        const formattedmsg = msg.substring(username.length + 2);
        const mgsele = document.createElement('div');
        mgsele.textContent = formattedmsg;
        chatBox.appendChild(mgsele);
      }
    });
  }
}

function sendMessage() {
  const msginput = document.getElementById('message-input');
  const msg = msginput.value;
  if (msg) {
    const formattedmsg = `${username}: ${msg}`;
    socket.send(formattedmsg);
    msginput.value = '';
  }
}


document.getElementById('send-button').addEventListener('click', sendMessage);

displayMessages();