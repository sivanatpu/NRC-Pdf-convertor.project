// jQuery(document).ready(function () {
//   $('#btn').click(function () {
//     // Target the content that needs to be converted to a PDF
//     const element = document.querySelector("#content");

//     // Capture the content using html2canvas
//     html2canvas(element, {
//       scale: 3, // Use a higher scale for better quality
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');

//       // Create a new jsPDF instance with A4 format
//       const pdf = new jsPDF('p', 'mm', 'a4');

//       // Dynamically calculate content dimensions
//       const elementWidth = canvas.width; // Element width in pixels
//       const elementHeight = canvas.height; // Element height in pixels

//       const pdfWidth = 210; // A4 width in mm
//       const pdfHeight = 297; // A4 height in mm

//       // Calculate scaled dimensions for 90% zoom
//       const scaleFactor = 0.9; // Scale to 90%
//       const imgWidth = (elementWidth / 96) * 25.4 * scaleFactor; // Convert pixels to mm
//       const imgHeight = (elementHeight / 96) * 25.4 * scaleFactor; // Convert pixels to mm

//       // Adjust the horizontal position to remove left/right margins
//       const xOffset = (pdfWidth - imgWidth) / 2; // Center the content
//       const yOffset = 0; // Starting from the top

//       // Track position for multi-page handling
//       let position = yOffset;
//       let heightLeft = imgHeight;

//       // Add the scaled image to the PDF
//       pdf.addImage(imgData, 'PNG', xOffset, position, imgWidth, imgHeight);
//       heightLeft -= pdfHeight;

//       // Add more pages if needed
//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', xOffset, position, imgWidth, imgHeight);
//         heightLeft -= pdfHeight;
//       }

//       // Save the PDF with a filename
//       pdf.save('custom-content.pdf');
//     }).catch((error) => {
//       console.error("Error generating PDF: ", error);
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");

  if (searchButton) {
      searchButton.addEventListener("click", function () {
          const searchArea = document.getElementById("search-area");
          const dynamicText = document.getElementById("dynamic-text");

          // Create an input element
          const inputField = document.createElement("input");
          inputField.type = "text";
          inputField.value = "Search something";
          inputField.className = "search-input";

          // Replace dynamic text with input field
          if (searchArea && dynamicText) {
              searchArea.replaceChild(inputField, dynamicText);

              // Focus the input field with a blinking cursor
              inputField.focus();

              // Select the text inside the input field for easy typing
              inputField.select();
          } else {
              console.error("Search area or dynamic text element not found.");
          }
      });
  } else {
      console.error("Search button not found.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const changeLogoButton = document.getElementById("change-logo-btn");
  const logoElement = document.getElementById("logo");

  // List of image URLs
  const images = [
      "url('logo3.png')", // Replace with your actual image paths
      "url('logo2.png')",
      "url('logo.webp')",
      "url('last.png')",
  ];

  let currentImageIndex = 0;

  if (changeLogoButton) {
      changeLogoButton.addEventListener("click", function () {
          // Update the background image
          currentImageIndex = (currentImageIndex + 1) % images.length; // Cycle through the images
          logoElement.style.backgroundImage = images[currentImageIndex];
          logoElement.style.backgroundSize = "cover"; // Ensure the image fits the container
          logoElement.style.backgroundPosition = "center";
      });
  } else {
      console.error("Change logo button not found.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const uploadInput = document.getElementById("upload-image");
  const imageElements = document.querySelectorAll(".image p, .image1");

  if (uploadInput) {
      uploadInput.addEventListener("change", function (event) {
          const file = event.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = function (e) {
                  const img = new Image();
                  img.src = e.target.result;

                  img.onload = function () {
                      const canvas = document.createElement("canvas");
                      const context = canvas.getContext("2d");

                      // Set a higher resolution for the canvas
                      const targetWidth = 500; // Adjust to desired width
                      const aspectRatio = img.height / img.width;
                      canvas.width = targetWidth;
                      canvas.height = targetWidth * aspectRatio;

                      // Draw image on canvas with improved resolution
                      context.drawImage(img, 0, 0, canvas.width, canvas.height);

                      // Convert canvas to a high-quality data URL
                      const highQualityImage = canvas.toDataURL("image/png", 1.0);

                      // Update both div elements
                      imageElements.forEach(element => {
                          element.style.backgroundImage = `url(${highQualityImage})`;
                          element.style.backgroundSize = "cover";
                          element.style.backgroundPosition = "center";
                      });
                  };
              };
              reader.readAsDataURL(file);
          }
      });
  } else {
      console.error("Image upload input not found.");
   }
});

jQuery(document).ready(function () {
  $('#btn').click(function () {
      const pdf = new jsPDF('p', 'mm', 'a4'); // Initialize jsPDF
      const boxes = ['.box1', '.second-box']; // Class names for the boxes
      let currentY = 10; // Starting position on the PDF
      let isFirstPage = true; // Track if it's the first page

      const processBox = (selector, callback) => {
          const box = document.querySelector(selector);

          html2canvas(box, {
              scale: 3, // High-quality rendering
              useCORS: true, // Handle cross-origin images if any
          }).then((canvas) => {
              const imgData = canvas.toDataURL('image/png');
              const contentWidth = canvas.width * 0.264583; // Convert px to mm
              const contentHeight = canvas.height * 0.264583; // Convert px to mm
              const pdfWidth = 210; // A4 width in mm
              const pdfHeight = 280; // A4 height in mm

              // Calculate scaling factors for width and height
              const widthScale = pdfWidth / contentWidth;
              const heightScale = pdfHeight / contentHeight;

              // Use the smaller scale to fit the content proportionally
              const scale = Math.min(widthScale, heightScale);
              const scaledWidth = contentWidth * scale;
              const scaledHeight = contentHeight * scale;

              // Add some padding to ensure borders are not clipped
              const padding = 2; // Adjust padding as needed

              // Check if content exceeds the page
              if (!isFirstPage && currentY + scaledHeight + padding > pdfHeight) {
                  pdf.addPage(); // Add a new page
                  currentY = 10; // Reset Y position for the new page
              }

              // Add the image to the PDF
              pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, currentY, scaledWidth, scaledHeight + padding);
              currentY += scaledHeight + padding + 10; // Update Y position for the next box
              isFirstPage = false; // Mark that the first page has been used
              callback(); // Continue to the next box
          }).catch((error) => {
              console.error(`Error processing ${selector}:`, error);
              callback(); // Continue even if an error occurs
          });
      };

      let index = 0;

      const next = () => {
          if (index < boxes.length) {
              processBox(boxes[index], () => {
                  index++;
                  next(); // Process the next box
              });
          } else {
              pdf.save('content.pdf'); // Save the PDF after all boxes are added
          }
      };

      next(); // Start processing the boxes
  });
});



































