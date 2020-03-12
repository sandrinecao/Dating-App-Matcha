var socket = io();
socket.on('online check', function(username) {
    let user = document.querySelector('#currentUser').innerHTML;
    if (username === user) {
        socket.emit('online resp', username);
    }
})

socket.on('notif resp', function(dest) {
    let user = document.querySelector('#currentUser').innerHTML;
    if (dest === user) {
        setTimeout(function() {
            location.reload();
        }, 500)
    }
})