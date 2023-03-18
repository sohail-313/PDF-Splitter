//Libraries: PdfJsLib
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';

//Global Variables
const selectedImages = [];
var pdfDoc;

/*<------------ Drop Zone Area ---------> */
var dropZone = document.getElementById('drop-zone');

document.body.addEventListener('dragover', function (e) {
	e.preventDefault();
	e.stopPropagation();
	dropZone.classList.add('dragover');
});

document.body.addEventListener('dragleave', function (e) {
	e.preventDefault();
	e.stopPropagation();
	dropZone.classList.remove('dragover');

});

document.body.addEventListener('drop', UploadPdf);
dropZone.addEventListener('change', UploadPdf);


/*<------------ Working With Pdf ---------> */

/* Upload Part */
function UploadPdf(e) {
	e.preventDefault();
	
	/* CSS */
	dropZone.classList.remove('dragover');
	dropZone.style.display = 'none'
	// show the loading icon
	document.getElementById("loadingIcon").style.display = "block";

	// wait for 3 seconds and hide the loading icon
	setTimeout(function () {
		document.getElementById("loadingIcon").style.display = "none";
	}, 3000);


	//Assigning it to PdfDoc
	if (pdfDoc == null) {
		pdfDoc = e.target.files || e.dataTransfer.files;
		checkedPages = [];
	}
	else {
		let text = "Previously Uploaded file will be override!";
		if (confirm(text) == true) {
			pdfDoc = e.target.files[0] || e.dataTransfer.files;
			checkedPages = [];
		}
	}

	//Display File Name
	document.getElementById('file-name').innerText = pdfDoc[0].name


	DisplayPdf();
}


/*Display Part */
const pdfImages = document.getElementById('pdf-images');
function DisplayPdf() {
	const images = [];
	// Load the PDF file
	pdfjsLib.getDocument(URL.createObjectURL(pdfDoc[0])).promise.then(function (pdf) {
		// Loop through each page of the PDF file

		for (let i = 1; i <= pdf.numPages; i++) {
			pdf.getPage(i).then(function (page) {
				// Create a canvas element for each page

				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');
				var viewport = page.getViewport({ scale: 2 });
				canvas.width = viewport.width;
				canvas.height = viewport.height;

				// Render the page onto the canvas
				page.render({ canvasContext: context, viewport: viewport }).promise.then(function () {

					// Convert the canvas to an image and set its source to the data URL
					const scri = canvas.toDataURL();
					images.push({ src: scri, page: i });

					// If all images have been rendered, sort and append them to the pdfImages div
					if (images.length === pdf.numPages) {
						images.sort(function (a, b) {
							return a.page - b.page;
						});

						images.forEach(function (image, index) {
							const imageDiv = document.createElement('div');
							imageDiv.classList.add('image-div');
							imageDiv.innerHTML = `
								<img src="${image.src}" alt="" class="image" onclick="toggleSelection(this)">
								<div class="image-footer">
									<p>${index + 1}</p>
								</div>
							`
							pdfImages.append(imageDiv);
						});
					}
				});
			});
		}
	});

}



function toggleSelection(img) {
	if (img.classList.contains('selected')) {
		img.classList.remove('selected');
		const index = selectedImages.indexOf(img);
		if (index !== -1) {
			selectedImages.splice(index, 1);
		}
	} else {
		img.classList.add('selected');
		selectedImages.push(img);
	}

	console.log(selectedImages)
}


/*Download Button */
const downloadButton = document.getElementById('download-pdf');
downloadButton.addEventListener('click', downloadPDF);
function downloadPDF() {
	const fileName = pdfDoc[0].name.split('.').slice(0, -1).join('.');
	const doc = new jsPDF();
	selectedImages.forEach((image, index) => {
		doc.addImage(image.src, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
		if (index < selectedImages.length - 1)
			doc.addPage();
	});
	doc.save(`${fileName}`);
}