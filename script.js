//Libraries: PdfJsLib
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js";

//Global Variables
var selectedImages = [];
var pdfDoc;

/*Download Button */
const downloadButton = document.getElementById("download-pdf");
const clearButton = document.getElementById("clear");
const preview = document.querySelector(".preview");
const mainPreview = document.querySelector(".main-preview");

/*<------------ Drop Zone Area ---------> */
var dropZone = document.getElementById("drop-zone");

document.body.addEventListener("dragover", function (e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add("dragover");
});

document.body.addEventListener("dragleave", function (e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove("dragover");
});

document.body.addEventListener("drop", UploadPdf);
dropZone.addEventListener("change", UploadPdf);

/*<------------ Working With Pdf ---------> */

/* Upload Part */
function UploadPdf(e) {
  e.preventDefault();

  /* CSS */
  dropZone.classList.remove("dragover");
  dropZone.style.display = "none";
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
  } else {
    let text = "Previously Uploaded file will be override!";
    if (confirm(text) == true) {
      pdfDoc = e.target.files[0] || e.dataTransfer.files;
      checkedPages = [];
    }
  }

  //Display File Name
  document.getElementById("file-name").innerText = pdfDoc[0].name;

  DisplayPdf();
}

/*Display Part */
const pdfImages = document.getElementById("pdf-images");
function DisplayPdf() {
  const images = [];
  // Load the PDF file
  pdfjsLib
    .getDocument(URL.createObjectURL(pdfDoc[0]))
    .promise.then(function (pdf) {
      // Loop through each page of the PDF file

      for (let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then(function (page) {
          // Create a canvas element for each page

          var canvas = document.createElement("canvas");
          var context = canvas.getContext("2d");
          var viewport = page.getViewport({ scale: 2 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // Render the page onto the canvas
          page
            .render({ canvasContext: context, viewport: viewport })
            .promise.then(function () {
              // Convert the canvas to an image and set its source to the data URL
              const scri = canvas.toDataURL();
              images.push({ src: scri, page: i });

              // If all images have been rendered, sort and append them to the pdfImages div
              if (images.length === pdf.numPages) {
                images.sort(function (a, b) {
                  return a.page - b.page;
                });

                images.forEach(function (image, index) {
                  const imageDiv = document.createElement("div");
                  const mainDiv = document.createElement("div");
                  mainDiv.classList.add("main_image");
                  imageDiv.classList.add("image-div");
                  imageDiv.innerHTML = `
								<img src="${image.src}" alt="" class="image" onclick="toggleSelection(this)">
								<div class="image-footer">
									<p>${index + 1}</p>
								</div>
							`;
                  mainDiv.innerHTML = `
                  <img src="${image.src}" alt="">
                  `;
                  pdfImages.append(imageDiv);
                  mainPreview.append(mainDiv);
                });
              }
              document.getElementById("select-head").innerText =
                "Select Pages to Merge:";
            });
        });
      }
    });
}

function toggleSelection(img) {
  preview.style.display = "block";
  if (img.classList.contains("selected")) {
    img.classList.remove("selected");
    const index = selectedImages.indexOf(img);
    if (index !== -1) {
      selectedImages.splice(index, 1);
    }
  } else {
    img.classList.add("selected");
    selectedImages.push(img);
  }

  if (selectedImages.length == 0) {
    document.getElementById("select-head").innerText = "";
    downloadButton.style.display = "none";
    clearButton.style.display = "none";
  } else {
    document.getElementById("select-head").innerText = "Selected Pages";
    downloadButton.style.display = "block";
    clearButton.style.display = "block";
  }
  renderSelectedImages();
}

//Download Function
downloadButton.addEventListener("click", downloadPDF);
function downloadPDF() {
  const fileName = pdfDoc[0].name.split(".").slice(0, -1).join(".");
  const doc = new jsPDF();
  selectedImages.sort(function (a, b) {
    const indexA = Array.from(a.parentElement.parentElement.children).indexOf(
      a.parentElement
    );
    const indexB = Array.from(b.parentElement.parentElement.children).indexOf(
      b.parentElement
    );
    return indexA - indexB;
  });
  selectedImages.forEach((image, index) => {
    doc.addImage(
      image.src,
      "JPEG",
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height
    );
    if (index < selectedImages.length - 1) doc.addPage();
  });
  doc.save(`${fileName}`);
}

//Showing Selected Pages
function renderSelectedImages() {
  const imageContainer = document.getElementById("selected-image-container");
  imageContainer.style.overflowX = "scroll";
  imageContainer.innerHTML = "";
  selectedImages.forEach(function (image) {
    const newImage = document.createElement("img");
    newImage.src = image.src;
    newImage.alt = image.alt;
    newImage.className = "selected-image";
    newImage.addEventListener("click", function () {
      const index = selectedImages.indexOf(image);
      if (index !== -1) {
        selectedImages.splice(index, 1);
      }
      image.classList.remove("selected");
      renderSelectedImages();
      if (selectedImages.length == 0) {
        document.getElementById("select-head").innerText = "";
        downloadButton.style.display = "none";
        clearButton.style.display = "none";
      } else {
        document.getElementById("select-head").innerText = "Selected Pages";
        downloadButton.style.display = "block";
        clearButton.style.display = "block";
      }
    });
    imageContainer.appendChild(newImage);
  });
}

//showing pdf
// function previewPDF() {
//   var file = pdfDoc[0];
//   var fileReader = new FileReader();
//   fileReader.onload = function () {
//     var preview = document.querySelector("#pdf-preview");
//     preview.src = fileReader.result + "#toolbar=0";
//   };
//   fileReader.readAsDataURL(file);
// }

clearButton.addEventListener("click", function () {
  selectedImages = [];

  const images = document.querySelectorAll(".image");
  images.forEach((img) => {
    img.classList.remove("selected");
  });
  preview.style.display = "none";
  clearButton.style.display = "none";
  downloadButton.style.display = "none";
});
