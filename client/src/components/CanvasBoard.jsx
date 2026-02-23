import { useEffect, useRef, useState } from "react";
import socket from "../socket";

function CanvasBoard({ roomId, isDrawer }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    socket.on("draw_data", ({ x, y }) => {
      draw(x, y);
    });

    socket.on("clear_canvas", () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    });

    return () => {
      socket.off("draw_data");
      socket.off("clear_canvas");
    };
  }, []);

  const startDrawing = () => {
    if (!isDrawer) return;
    setDrawing(true);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const drawMove = (e) => {
    if (!drawing || !isDrawer) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    socket.emit("draw_data", { roomId, stroke: { x, y } });
    draw(x, y);
  };

  const draw = (x, y) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      style={{ border: "1px solid black" }}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={drawMove}
    />
  );
}

export default CanvasBoard;