const { spawn } = require('cross-spawn');

let workers = [];

/**
 * Inicia y gestiona el backend en Python
 */
async function initBackend() {
  if (process.env.NODE_ENV === 'development') {

    //Si usamos uvvicorn debemos ejecutar de esta manera python pero debemos ejecutar "poetry shell" manualmente antes de poder trabajar en el proyecto
    /*
    const pythonProcess = spawn('python', ['./backend/main.py'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false,
    });
    */

    //Podemos usar poetry aquí si es que se user Hypercorn en el back. Esto asegura que los procesos mueran en los momentos correspondientes
    /*
    const pythonProcess = spawn(
      'poetry',
      ['run', 'python', './backend/main.py'],
      {
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: false 
      },
    );
    */
    workers.push(pythonProcess);
  } else {
    const pythonProcess = spawn('./backend/dist/mangaOcrApi/mangaOcrApi.exe', {
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false,
    });
    //TODO: Investigar como se comporta esto en prod
    workers.push(pythonProcess);
  }

  workers[0].stderr.pipe(process.stdout);
  workers[0].stdout.on('data', (outdata) => {
    console.log(outdata.toString());
  });
  workers[0].stderr.on('data', (outdata) => {
    console.log(outdata.toString());
  });
  workers[0].on('error', (err) => {
    console.log('on error');
    console.log('child launch failed: ', err);
  });
  workers[0].on('close', (code) => {
    console.log('on close');
    console.log('child ended: ', code);
  });
  workers[0].on('exit', (code) => {
    console.log('on exit');
    console.log('child exit: ', code);
  });
}

module.exports = {
  initBackend,
};
