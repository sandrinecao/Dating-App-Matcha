(function() {

    var inputs = document.getElementsByTagName('input');
    var re = /(<([^>]+)>)/gi;
    for(var i = 0; i < inputs.length; i++){
         inputs[i].value = inputs[i].value.replace(re, "");
    }

    var btnSend = document.querySelector('#btn-send');

    window.onload = function(ev) {
        messages.style.transition = "3s";
        messages.scrollTop = messages.scrollHeight;
        ev.preventDefault();
    };


    // Ajax for saving message
    var postMessage = function(message) {
        var xhr = new XMLHttpRequest();
        var url = document.URL;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('Message posted!');
            }
        }
        var content = document.querySelector('#content').value;
        xhr.send("content=" + message.text);
    }

    var socket = io();
    var roomName = document.querySelector('#chat').getAttribute('name');
    var form = document.querySelector('#form-chat');
    var content = document.querySelector('#content');
    var messages = document.querySelector('#msg-container');
    var username = document.querySelector('#currentUser').innerHTML;
    var target = document.querySelector('#target').value;

    socket.emit('create', roomName);

    form.addEventListener('submit', function(ev) {
        if (content.value.trim() == "") {
            return (false);
        }
        var message = {
            username: username,
            text: content.value,
        }
        postMessage(message);
        socket.emit('message', message, roomName);
        socket.emit('notif', target);
        socket.emit('notif-chat', {from: username, dest: target});
        content.value = "";
        content.focus();
        ev.preventDefault();
    }, false);

    socket.on('server-message', function(message) {
        var li = document.createElement('li');
        li.innerHTML = `<span style="font-weight: bold">` + message.username + ':</span>  ' + message.text;
        li.setAttribute('id', 'msg-content');
        messages.appendChild(li);
        messages.style.transition = "3s";
        messages.scrollTop = messages.scrollHeight;
    })

    // Check if user is online
    socket.on('online check', function(username) {
        let user = document.querySelector('#currentUser').innerHTML;
        if (username === user) {
            socket.emit('online resp', username);
        }
    })

})();