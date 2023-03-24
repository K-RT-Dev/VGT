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
import multiprocessing
import os
import signal
# import openai

#Proceso encargado de verificar de matar al worker de FastApi en caso que deje de existir electron.exe (o VGT.exe)
#Este proceso se auto-mata en caso que el proceso padre deje de existir
#La verificación se realiza cada 2 segundos
def watcher(parent_pid):
    while True:
        info = []
        parentRunning = False
        for proc in psutil.process_iter():
            #TODO: Usar "electron.exe" para dev y "VGT.exe" para prod
            if proc.name() == "electron.exe" or proc.name() == "VGT.exe":
                info.append(str(proc))
            if proc.pid == parent_pid:
                parentRunning = True
        if parentRunning is False:
            raise SystemExit
        if(len(info) == 0):
            #Aunque esta instrucción termina el proceso correctamente es considerado un error a nivel asyncio
            os.kill(parent_pid, signal.SIGTERM)
            raise SystemExit
        time.sleep(1)

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


#Vemos si tenemos un argumento de entrada para identificar que queremos correr el backend sin que electron este presente
standalone = False
if len(sys.argv) == 2:
    if sys.argv[1] == "standalone":
        standalone = True

#Al iniciar FastApi generamos un proceso hijo al cual le pasamos el pid del padre (o sea, este proceso)
#Este proceso hijo estar encargado de verificar que electron este siendo ejecutado, en caso de no estarlo, este proceso esta encargado de matar el padre (o sea, este proceso)
#Esta lógica solo se aplica cuando estamos corriendo backend en modo *no* standalone
#Esta solución se debería aplicar dado el problema de procesos de python huérfanos generados cuando la aplicación principal se cierra en algunas condiciones especiales
#Estos procesos huérfanos no se terminan y bloquean la capacidad de volver a ejecutar la aplicación
if standalone is False:
    @app.on_event("startup")
    def watchElectron():
        parent_pid = os.getpid()
        bye_process = multiprocessing.Process(target=watcher, args=(parent_pid,))
        bye_process.start()


@app.get("/check")
def check():
    return "ok"

@app.get("/modelCheck")
def model_check():
    hf_cache_info = scan_cache_dir()
    for repo in hf_cache_info.repos:
        if repo.repo_id == "kha-white/manga-ocr-base":
            if len(repo.revisions) > 0 and repo.nb_files >= 6: #Ojo: Especificamos no solo que exista por lo menos una revision, sino que también existan 6 o mas archivos. Esto es en caso de descargas interrumpidas
                return "inDisk"
    return "notInDisk"


# Inicia el proceso de carga MangaOcr
# Bug conocido: si en dev se interrumpe el proceso de descarga, queda un proceso de python que no permite reiniciar el sistema
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


