// Function to check if a font is loaded
export const checkFontLoaded = (fontFamily: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if the font is already loaded
    if (document.fonts.check(`12px ${fontFamily}`)) {
      resolve(true);
      return;
    }

    // Try to load the font
    const testElement = document.createElement("span");
    testElement.style.fontFamily = fontFamily;
    testElement.style.position = "absolute";
    testElement.style.visibility = "hidden";
    testElement.textContent = "Test";
    document.body.appendChild(testElement);

    // Check if the font is loaded after a short delay
    setTimeout(() => {
      const isLoaded = document.fonts.check(`12px ${fontFamily}`);
      document.body.removeChild(testElement);
      resolve(isLoaded);
    }, 1000);
  });
};

// Function to load a font
export const loadFont = async (fontFamily: string): Promise<void> => {
  try {
    const isLoaded = await checkFontLoaded(fontFamily);
    if (!isLoaded) {
      console.warn(
        `Font ${fontFamily} is not loaded. Attempting to load it...`
      );

      // Try to load the font using the FontFace API
      if ("FontFace" in window) {
        let fontUrl = "";

        if (fontFamily === "Nasalization") {
          fontUrl = "/fonts/nasalization/Nasalization Rg.otf";
        } else if (fontFamily === "Montserrat") {
          fontUrl = "/fonts/Montserrat/Montserrat-VariableFont_wght.ttf";
        }

        if (fontUrl) {
          const font = new FontFace(fontFamily, `url(${fontUrl})`);
          await font.load();
          document.fonts.add(font);
          console.log(`Font ${fontFamily} loaded successfully.`);
        }
      }
    } else {
      console.log(`Font ${fontFamily} is already loaded.`);
    }
  } catch (error) {
    console.error(`Error loading font ${fontFamily}:`, error);
  }
};
