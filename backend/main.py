import uvicorn

#import asyncio
#from hypercorn.config import Config
#from hypercorn.asyncio import serve
#from app import app

from multiprocessing import freeze_support

# TODO: Quitar paquete taskipy de poetry y sacar referencias del .toml (lo usamos para correr python run task test)

if __name__ == "__main__":
    freeze_support()
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True, workers=1)

    """
    customConfig = {
        'use_reloader': True,
        'accesslog': '-',
        "errorlog": '-',
    }
    config = Config.from_mapping(customConfig)
    asyncio.run(serve(app, config))
    """
    
