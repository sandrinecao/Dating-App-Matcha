(function() {

	var notifications = document.querySelectorAll('#notification');
	var links = document.querySelectorAll('#profile-name');
	var dropdown = document.querySelector('.matcha-notif');

	//chat
	for(var i = 0, len = links.length; i < len; i++) {
		let elem = links[i];
		elem.addEventListener('click', function(ev) {
			socket.emit('notif', elem.innerHTML);
		}, false);
	}

	for(var i = 0, len = notifications.length; i < len; i++) {
		let cell = notifications[i];
		let id = cell.nextElementSibling.innerHTML;
		let status = cell.nextElementSibling.nextElementSibling.innerHTML;
		if (status == 0) {
			dropdown.style.color = '#EB6864'; //new notif en rouge
			cell.style.backgroundColor = 'lightgray';
			cell.style.color = 'black';
			cell.addEventListener('click', function(ev) {
				cell.style.backgroundColor = 'white';
				cell.style.color = 'dimgray';
				cell.style.borderBottom = '1px solid lightgray';
				readNotification(id, cell);
				// ev.preventDefault();
			}, false);
		} else {
			cell.style.backgroundColor = 'white';
			cell.style.color = 'dimgray';
			cell.style.borderBottom = '1px solid lightgray';
		}
	}

	// AJAX request for read notification
	function readNotification(id, cell) {
		var xhr = new XMLHttpRequest();
		var url = "http://localhost:5000/users/notification";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function(){
				if (xhr.readyState == 4 && xhr.status == 200) {
						cell.nextElementSibling.nextElementSibling.innerHTML = 1;
						console.log('Notification read with success!');
						checkUnreadNotifs(notifications);
				}
		}
		xhr.send("id=" + id);
	}

	// Check if there is some notifs unread and if yes then change color 
	// and turn back to inital main button
	function checkUnreadNotifs(arr) {
		for (var i = 0, len = arr.length; i < len; i++) {
			let cell = arr[i];
			let status = cell.nextElementSibling.nextElementSibling.innerHTML;
			console.log(status);
			if (status == 0)
				return;
		}
		let dropdown = document.querySelector('.matcha-notif');
		dropdown.style.color = 'rgba(0, 0, 0, 0.7)'; //noir
	}

	var socket = io();

})();