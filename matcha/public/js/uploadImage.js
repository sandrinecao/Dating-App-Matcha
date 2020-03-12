var btnUpload = document.querySelector('#btn-upload');
var btnBrowse = document.querySelector('#btn-browse');
var upload = document.querySelector('#files-input-upload');
var imgUpload = document.querySelector('#img-upload');
var btnSave = document.querySelector('#btn-save');

function loadImage() {
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				imgUpload.src = e.target.result;
			};
			reader.readAsDataURL(this.files[0]);
		}
		else {
			console.log("Load fail");
		}
	}

btnBrowse.addEventListener('click', function() {
    upload.click();
});

upload.addEventListener('change', function() {
	document.getElementById('file-input-name').value = this.value;
	btnUpload.removeAttribute('disabled');
});

upload.addEventListener('change', loadImage, false);
btnUpload.addEventListener('click', function() {
	btnSave.click();
})