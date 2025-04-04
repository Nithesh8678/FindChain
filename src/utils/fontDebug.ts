// Function to debug font loading issues
export const debugFontLoading = () => {
  console.log("Debugging font loading...");

  // Check if the fonts are in the document.fonts collection
  console.log("Document fonts:", document.fonts);

  // Check if the font files are accessible
  const fontFiles = [
    "/fonts/nasalization/Nasalization Rg.otf",
    "/fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
    "/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf",
  ];

  fontFiles.forEach((fontFile) => {
    fetch(fontFile)
      .then((response) => {
        if (response.ok) {
          console.log(`Font file ${fontFile} is accessible.`);
        } else {
          console.error(
            `Font file ${fontFile} is not accessible. Status: ${response.status}`
          );
        }
      })
      .catch((error) => {
        console.error(`Error accessing font file ${fontFile}:`, error);
      });
  });

  // Check if the CSS variables are defined
  const rootStyles = getComputedStyle(document.documentElement);
  console.log("CSS variables:", {
    "--font-nasalization": rootStyles.getPropertyValue("--font-nasalization"),
    "--font-montserrat": rootStyles.getPropertyValue("--font-montserrat"),
  });

  // Check if the font classes are applied
  const testElement = document.createElement("div");
  testElement.className = "font-nasalization";
  document.body.appendChild(testElement);
  const computedStyle = window.getComputedStyle(testElement);
  console.log("Font family for .font-nasalization:", computedStyle.fontFamily);
  document.body.removeChild(testElement);
};
