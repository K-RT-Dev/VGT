from fastapi import FastAPI, File, UploadFile, Body, BackgroundTasks
from fastapi_utils.tasks import repeat_every
from manga_ocr import MangaOcr
import io
from PIL import Image
import time
import base64
from huggingface_hub import scan_cache_dir
import psutil
import sys
# import openai


app = FastAPI()

mocr = None

#TODO: Si el modelo no esta cargado en memoria por secuencia de hot-reload, recargar

# openai.api_key = "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"
model_engine = "text-davinci-003"
basePrompt = "traduce esto del japones al ingles y luego dicha traduccion al español: \n"

# @app.post("/translateDataUrlImg")
# async def translate_dataurl_img(data: dict):
#    imagen_decodificada = base64.b64decode(data["img"].split(",")[1])
#    with Image.open(io.BytesIO(imagen_decodificada)) as image:
#        text = mocr(image)
#    return { "id": data["id"], "text": text}

# start = time.process_time()
# file_name = file.filename
# file_extension = file_name.split(".")[-1] in ("jpg", "jpeg")
# if not file_extension:
#    return {"error": "File extension not allowed. Please upload a jpg file"}
# with Image.open(io.BytesIO(contents)) as image:
#    text = mocr(image)
# lapse = time.process_time() - start
# return {"texto": text, "lapse": str(lapse)}

# @app.post("/translateText")
# async def translate_text(data: dict):
#    print(data["text"])

#    completion = openai.Completion.create(
#        engine=model_engine,
#        prompt=basePrompt + data["text"],
#        max_tokens=100,
#        temperature=0.3,
#        top_p=1,
#        frequency_penalty=0,
#        presence_penalty=0
#    )

#    print(completion)
#    return { "id": data["id"], "trad": completion.choices[0].text.strip()}


# --------------------

standalone = False
if len(sys.argv) == 2:
    if sys.argv[1] == "standalone":
        standalone = True

#Puede que esta logica no sea necesaria en prod porque el proceso de python queda siempre directamente anclado a VGT.exe
if standalone is False:
    @app.on_event("startup")
    @repeat_every(seconds=3)
    def watchElectron():
        info = []
        for proc in psutil.process_iter():
            #TODO: Usar "electron.exe" para dev y "VGT.exe" para prod
            if proc.name() == "electron.exe" or proc.name() == "VGT.exe":
                info.append(str(proc))
        if(len(info) == 0):
            #TODO: Aunque esta instrucción termina el proceso correctamente es considerado un error a nivel asyncio
            raise SystemExit


@app.get("/check")
def check():
    return "ok"

@app.get("/modelCheck")
def model_check():
    hf_cache_info = scan_cache_dir()
    for repo in hf_cache_info.repos:
        if repo.repo_id == "kha-white/manga-ocr-base":
            if len(repo.revisions) > 0:
                return "inDisk"
    return "notInDisk"


# Inicia el proceso de carga MangaOcr
@app.post("/loadMangaOCR")
def load_manga_ocr():
    print("loadMangaOCR")
    global mocr
    if mocr is None:
        mocr = MangaOcr()
        return {"msg": "Manga OCR Ready"}
    else:
        return {"msg": "MangaOCR has already been loaded"}

# Nos retorna una texto detectado de una imagen de muestra mediante el uso de Manga OCR

@app.get("/test")
def test():
    print("test")
    global mocr
    if mocr is None:
        return {"msg": "Manga OCR not Ready"}
    #TODO: Esta Path es un problme, ya que funciona en dev pero no en prod
    text = mocr('backend/img/00.jpg')
    return {"Test": text}


# Requiere cargar el modelo nuevamente luego de realizar la limpieza
@app.post("/cleanMangaOCRCache")
def clean_manga_orc_cache():
    print("cleanMangaOCRCache")
    global mocr
    hf_cache_info = scan_cache_dir()
    for repo in hf_cache_info.repos:
        if repo.repo_id == "kha-white/manga-ocr-base":  # Solo eliminamos revisiones del modelo de manga-ocr
            for revision in repo.revisions:
                scan_cache_dir().delete_revisions(revision.commit_hash).execute()
    mocr = None
    return {"msg": "Manga OCR cache model delete"}

@app.get("/ping")
def ping():
    print("jusdc  ccd")
    return "ping"


