A program with a graphical interface to capture screenshots and detect Japanese characters in them. Then, translate the text to another language using GTP AI. Manga-Ocr is used to recognize the japanese characters from the captured screenshots. The program allows changing the "prompt" used as the basis for the GTP translation.

Limitations:
- **Requires an OpenAI API KEY**
- Only recognizes Japanese characters

To-do list:
- Allow selecting multiple GTP models
- Add options to use other OCRs to detect other languages
- Add functionality to support multiple monitors

Future experiments:
- Use the translation history to improve GTP results. This way, context can be added to the entries to be translated.
- Use multiple languages as intermediaries to improve GTP results. For example, translate a text to four different languages and then request to combine those results into a final language.
- Implement other translators, such as DeepL, Google, and Yandex, to combine multiple translations into a better one.

The system is divided into 2 parts:

1. A graphical interface based on ElectronJs and ReactJs. This layer allows interaction with the user and captures images from the screen.

2. A local server based on FastAPI (Python). This performs image analysis for character extraction (OCR) and communication with online services such as the GTP API.

Usando Node 16.19.1
Solo funciona en Windows

//Instalar repositorios
cd backend --> poetry shell --> poetry install
npm install

//Iniciar en dev mode
poetry shell --> npm run electron-dev

//Construir release
cd backend --> pyinstaller mangaOcrApi.spec
npm run electron-build
npm run package
Acomodar archivos


Base on boilerplate:
https://github.com/bradtraversy/simple-electron-react
https://github.com/varyoo/react-deluge/tree/61a7b979f86b35bcca72dfedbb5a1712f356aade
https://github.com/toonvanvr/electron-transparency-demo
