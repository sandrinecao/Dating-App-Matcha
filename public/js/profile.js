(function () {

    var user = document.querySelector('#currentUser').innerHTML;
    var likeContainer = document.querySelector('#like-container');
    var blockContainer = document.querySelector('#block-container');
    var reportContainer = document.querySelector('#report-container');

    // Ajax for liking user
    function likeUser(bool) {
        xhr = new XMLHttpRequest();
        var url = document.querySelector('#url').value;
        if (bool == true)
            url += '/like';
        else
            url += '/unlike';
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('Like/Dislike is working!');
            }
        }
        xhr.send();
    }

    var btnLike = document.querySelector('#btn-like');
    var heartIcon = document.querySelector('#i-like');
    var user = document.querySelector('#currentUser').innerHTML;
    likeContainer.addEventListener('click', function (ev) {
        if (btnLike.value == 'Like') {
            heartIcon.style.color = 'red';
            heartIcon.style.transition = '0.3s';
            btnLike.value = 'Unlike';
            socket.emit('notif', username);
            likeUser(true);
        } else {
            heartIcon.style.color = 'grey';
            heartIcon.style.transition = '0.3s';
            btnLike.value = 'Like';
            socket.emit('notif', username);
            likeUser(false);
        }
        ev.preventDefault();
    })

    // Ajax for blocking user
    function blockUser(bool) {
        xhr = new XMLHttpRequest();
        var url = document.querySelector('#url').value;
        if (bool == true)
            url += '/block';
        else
            url += '/unblock';
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('Block/Unblock is working!');
            }
        }
        xhr.send();
    }

    var btnBlock = document.querySelector('#btn-block');
    var blockIcon = document.querySelector('#i-block');
    blockContainer.addEventListener('click', function (ev) {
        if (btnBlock.value == 'Block') {
            blockIcon.style.color = 'black';
            btnBlock.value = 'Unblock';
            blockUser(true);
        } else {
            blockIcon.style.color = 'grey';
            btnBlock.value = 'Block';
            blockUser(false);
        }
        ev.preventDefault();
    })

    // Ajax for report user
    function reportUser() {
        xhr = new XMLHttpRequest();
        var url = document.URL + 'report';
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('User reported with success!');
            }
        }
        xhr.send();
    }
    reportContainer.addEventListener('click', function (ev) {
        let reportContent = document.querySelector('#report-content');
        reportContent.innerHTML = 'Profile reported!';
        reportUser();
    })

    var status = document.querySelector('#status');
    var lastConnection = document.querySelector('#last-connection');
    var username = document.querySelector('#username').lastChild.textContent;

    var socket = io();
    socket.emit('online req', username);

    socket.on('online', function () {
        status.style.background = 'green';
        status.style.width = '1.6em';
        status.style.height = '1.6em';
        lastConnection.style.display = 'none';
    })

    socket.on('online check', function (username) {
        let user = document.querySelector('#currentUser').innerHTML;
        if (username === user) {
            socket.emit('online resp', username);
        }
    })

    socket.on('notif resp', function (dest) {
        let user = document.querySelector('#currentUser').innerHTML;
        if (dest === user) {
            setTimeout(function () {
                location.reload();
            }, 500)
        }
    })



})()