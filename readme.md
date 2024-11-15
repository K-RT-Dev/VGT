## This project is no longer maintained

Due to time constraints, I am forced to abandon this project. I believe it is an excellent proof of concept. With the advancements in AI over the past few years, I have no doubt that similar projects will continue to be developed. Everyone is welcome to fork the code and create their own implementations. The following tasks are necessary:

- Update the use of the OpenAI API to support the latest models.
- Fix minor bugs related to the length of the OpenAI API Key.
- Add support for multiple monitors.

I believe this project can be a valuable contribution by demonstrating how to integrate Manga-OCR, a front-end with ElectronJS, a back-end with FastAPI, and the ability to package everything into an easy-to-use .exe.

## Introduction

Program with a graphical interface for taking screenshots and translating Japanese text to another language found in those screenshots. The system uses [Manga-OCR](https://github.com/kha-white/manga-ocr) for detecting Japanese characters in the images, and the [OpenAI API](https://openai.com/blog/openai-api) to utilize the [GPT Models](https://platform.openai.com/docs/models) for translating the text. 

![test](https://github.com/K-RT-Dev/VGT/blob/master/media/c.gif)

There are configurations available to change the image capture shortcut and also the base [prompt](https://platform.openai.com/docs/guides/completion) to use for translation with GPT. The program starts a [FastAPI](https://fastapi.tiangolo.com/) based server for processing images and interfacing with OpenAI. The graphical interface is built using a combination of [ElectronJS](https://www.electronjs.org/) and [ReactJS](https://es.reactjs.org/).

**A compiled .exe version** (using [PyInstaller](https://pyinstaller.org/en/stable/) and [electron-packager](https://github.com/electron/electron-packager)) is provided for quick installation. The installer has an approximate file size of 220Mb. After the program is installed, it automatically downloads the [model](https://huggingface.co/kha-white/manga-ocr-base) used by Manga-OCR for character detection. This model has a file size of 450Mb.

### Download executable: 

- From: [Github Release](https://github.com/K-RT-Dev/VGT/releases/tag/v0.2)

Currently, the program only works on Windows.

## Install and execute from code:

- Have [Node 16.X](https://nodejs.org/es/download/releases) installed.
- Have [Python 3.9](https://www.python.org/downloads/release/python-390/) and [Poetry](https://python-poetry.org/) installed.

1. Download the repo.
2. Install the server (backend) dependencies using: `poetry shell` and then `poetry install`
3. Install the graphical interface dependencies (frontend) with: `npm install`
4. Start project in development mode with: `poetry shell` and then `npm run electron-dev`

### Build executables
This process is not yet fully automated. First, we need to compile the server using PyInstaller. After that, compile ElectronJS using electron-packager. Finally, combine the results of these two processes in a final folder that we can compress into an installer

1. Run PyInstaller inside the backend directory: `cd backend` then `poetry shell` and then`pyinstaller mangaOcrApi.spec`. This should generate a folder named "dist" with the compiled server.
2. Build the ReactJS bundle with: `npm run electron-build` and then compile the ElectronJS application with: `npm run package`. This should generate a folder named "release-builds" with the compiled frontend.
3. Go to "release-builds/VGT-win32-x64" and create a directory named "backend". Copy the folder located at "backend/dist" inside this directory. The "release-builds" folder should look like this:
```
--release-builds
----backend
------mangaOcrApi
```
4. We can compress this folder into an installer using WinRaR.

### Limitations:

- **Requires an OpenAI API KEY**
- Only recognizes Japanese characters
- Only works on Windows

#### The system is divided into 2 parts:

1. A graphical interface based on ElectronJs and ReactJs (Javascript). This layer allows interaction with the user and captures images from the screen.

2. A local server based on FastAPI (Python). This performs image analysis for character extraction (OCR) and communication with online services such as the GPT API.

When ElectronJS is started, it takes care of running the server as a child process.

#### To-do list:

- Allow selecting multiple GPT models [OK].
- Ability to use another type of translator, such as DeepL.
- Add options to use other OCRs to detect other languages.
- Add functionality to support multiple monitors.
- Allow creating pipelines to combine the results of various OCR and/or translators (bagging) to improve the final performance.

#### Future experiments:

- Use the translation history to improve GPT results. This way, context can be added to the entries to be translated.
- Use multiple languages as intermediaries to improve GPT results. For example, translate a text to four different languages and then request to combine those results into a final language.
- Implement other translators, such as DeepL, Google, and Yandex, to combine multiple translations into a better one.

##### Base on boilerplate:
- [simple-electron-react](https://github.com/bradtraversy/simple-electron-react)
- [react-deluge](https://github.com/varyoo/react-deluge/tree/61a7b979f86b35bcca72dfedbb5a1712f356aade)
- [electron-transparency-demo](https://github.com/toonvanvr/electron-transparency-demo)

##### Media:
![test](https://github.com/K-RT-Dev/VGT/blob/master/media/a.gif)
