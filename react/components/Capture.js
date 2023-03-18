import React, { useRef, useState, useEffect } from 'react';
const { ipcRenderer } = require('electron');

const Capture = () => {
  useEffect(() => {
    console.log('Capture Cargado');
  }, []);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(163, 163, 194, 0.4)'; // Establecer el color de fondo en azul transparente
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function drawRectangle() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(163, 163, 194, 0.4)'; // Establecer el color de fondo en azul transparente
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(
        startCoords.x,
        startCoords.y,
        endCoords.x - startCoords.x,
        endCoords.y - startCoords.y,
      );
    }
    if (isDrawing) {
      drawRectangle();
    }
  }, [isDrawing, startCoords, endCoords]);

  async function handleMouseDown(event) {
    ipcRenderer.send('event/mousedown');

    setIsDrawing(true);
    setStartCoords({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
    setEndCoords({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  }

  //Todo si el ratón sale del rango del canvas (ejemplo a otra pantalla o a la barra de navegación) debemos detener el proceso de captura
  function handleMouseMove(event) {
    if (!isDrawing) return;
    setEndCoords({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  }

  const handleMouseUp = async () => {
    ipcRenderer.send('event/mouseup');
    setIsDrawing(false);
    //TODO, poner algún icono de carga ?
    await ipcRenderer.invoke('captureScreenshot');
    ipcRenderer.send('closeCaptureWin');
  };

  return (
    <div
      style={{
        height: '100vh',
        position: 'absolute',
        width: '100%',
      }}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default Capture;
