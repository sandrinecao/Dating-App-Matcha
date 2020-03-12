(function(){

	var tagsAvailable = document.querySelectorAll('.tagAvailable');
	var tags = document.querySelectorAll('.tag');
	let myTags = document.querySelector('#allTags');
	let btnAddTag = document.querySelector('#btn-addTag');
	var tagValue = document.querySelector('#tags');

// Ajoute les tags dans le user quand on clique sur les tags dispo
	for (var i = 0; i < tagsAvailable.length; i++) {
		tagsAvailable[i].addEventListener('click', function(ev) {
			let allTags = document.querySelector('#allTags');

			if (allTags.children.length < 12) {
			let btnTag = document.createElement("span");
			btnTag.className = "tag";
			btnTag.onclick = function() {
				this.parentNode.removeChild(this);
			}
			btnTag.innerText = this.innerText;
			allTags.appendChild(btnTag);
			} else {
				alert("Maximum 12 tags");
			}
			ev.preventDefault();
		})
	}

	// Permet de rendre les tags existant clickable
	for (var i = 0; i < tags.length; i++) {
		tags[i].addEventListener('click', function(ev) {
			this.parentNode.removeChild(this);
		})
	}

    var createTag = function() {
			let allTags = document.querySelector('#allTags');
			if (allTags.children.length < 12) {
				let newTag = document.createElement("span");
				newTag.className = "tag";
				newTag.onclick = function() {
					this.parentNode.removeChild(this);
				}
				newTag.innerText = '#' + tagValue.value;
				allTags.appendChild(newTag);
				tagValue.value = "";
			} else {
				alert("Maximum 12 tags");
			}
		}

		var checkTag = function(str) {
			let alpha = /^[a-zA-Z]+$/;
			return (alpha.test(str));
		}

		btnAddTag.addEventListener('click', function (ev) {
			if (checkTag(tagValue.value) == true) {
				createTag();
			} else {
				alert('Only letters are allowed');
			}
			ev.preventDefault();
		})

	
	var formSubmit = document.querySelector('#form-submit');
	formSubmit.addEventListener('click', function(ev) {
			let tags = document.querySelectorAll('.tag');
			if (tags.length < 1 || tags.length > 12) {
				alert('You need to select between 1 - 12 tags');
				ev.preventDefault();
				return;
			}
			var arr = [];
			var newArr = [];
			for (var n = 0; n < tags.length; n++) {
				arr.push(tags[n].innerText);
			}

			for (var i = 0; i < arr.length; i++) {
				if (newArr.indexOf(arr[i]) === -1)
					newArr.push(arr[i]);
			}
			document.querySelector('#tags').value = newArr.toString();
	})

})();