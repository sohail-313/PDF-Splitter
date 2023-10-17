HTML ToDO
Initially the Header is set to display none when the user drops the pdf it will be set block




Script ToDo
WhenEver new File is Dropped The Selected Array should be cleared





Delete Code
// document.body.addEventListener('drop', function(e) {
//     e.preventDefault();
//     dropZone.style.display = 'none';
   
//     pdfDoc = e.dataTransfer.files;
 
// });
// dropZone.addEventListener("change", (event) => {
//     const file = event.target.files;

//   });






.sidebar {
  display: flex;
  height: 200px;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}

.sidebar::-webkit-scrollbar {
  display: none;
}

.sidebar p {
  margin: 0;
  text-align: center;

}



#pdf-images {
  display: flex; /* display images in a row */
  overflow-x: scroll; /* create a horizontal scrollbar */
  justify-content: center; /* center the images horizontally */
  width: 80%; /* occupy 80% of the width */
  margin: 0 auto; /* center the div horizontally */
}

#pdf-images > div {
  display: inline-block; /* display each image as a block */
  margin-right: 10px; /* add space between each image */
}

#pdf-images > div:last-child {
  margin-right: 0; /* remove margin from last image */
}