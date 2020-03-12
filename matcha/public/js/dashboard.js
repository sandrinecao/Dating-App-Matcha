(function () {
	
	var textareas = document.getElementsByTagName('textarea');
	var re = /(<([^>]+)>)/gi;
	for (var i = 0; i < textareas.length; i++) {
		textareas[i].value = textareas[i].value.replace(re, "");
	}
	var inputs = document.getElementsByTagName('input');
    for(var i = 0; i < inputs.length; i++){
         inputs[i].value = inputs[i].value.replace(re, "");
    }

	var age = document.querySelector('#age');

	function checkAge(age) {
		if (/^[0-9]+$/.test(age) == false) {
			return (false);
		} else if (parseInt(age) < 18 || parseInt(age) > 100 || age == undefined) {
			return (false);
		}
		return (true);
	}

	age.addEventListener('focusout', function (ev) {
		if (checkAge(age.value.trim()) == false) {
			alert('Your age seems incorrect, please fix it.');
			age.value = "";
			ev.preventDefault();
		}
	})

	var imgAll = document.querySelectorAll('.gallery')
	var del_button = document.getElementById('btn-delete');
	var btnSetMain = document.getElementById('btn-setmain');
	var setMain = document.querySelector('#setmain');
	var hidden = document.querySelector('#hidden');
	var btnContainer = document.querySelector('#btn-container');

	function selectImage(elem) {
		btnContainer.style.display = "block";
		for (var i = 0; i < imgAll.length; i++) {
			imgAll[i].style.border = "none";
		}
		// put the image selected in the button value
		hidden.setAttribute('value', elem);
		setMain.setAttribute('value', elem);
	}

	// Effet selection image
	for (var i = 0; i < imgAll.length; i++) {
		imgAll[i].addEventListener('click', function (ev) {
			var test = this.getAttribute('src');
			selectImage(test);
			this.style.border = "8px solid #B8FFB0";
			this.style.borderRadius = "5px";
			this.style.transition = "0.3s";
		}, false);
	};


})();