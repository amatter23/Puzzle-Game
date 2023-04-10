import React, { useState } from 'react';

function Home() {
  const [image, setImage] = useState(null);

  const [rows, setRows] = useState([]);
  const [pieces, setPieces] = useState(4);
  const [isCompleted, setIsCompleted] = useState(false);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    setImage(file);
  }

  function handlePiecesChange(event) {
    const value = parseInt(event.target.value);
    setPieces(value);
  }

  let isShuffled = false;

  function handleImageLoad() {
    const img = document.createElement('img');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 600;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(img, 0, 0, 400, 600);
      const newPieces = [];
      const width = 400 / pieces;
      const height = 600 / pieces;
      for (let i = 0; i < pieces; i++) {
        for (let j = 0; j < pieces; j++) {
          const x = j * width;
          const y = i * height;
          const imageData = context.getImageData(x, y, width, height);
          const dataUrl = getDataUrl(imageData);
          newPieces.push({
            id: i * pieces + j,
            dataUrl,
            isPlaced: false,
            top: 0,
            left: 0,
            style: {
              opacity: 1,
              border: '1px solid black',
            },
          });
        }
      }

      const newRows = [];
      for (let i = 0; i < pieces; i++) {
        const row = newPieces.slice(i * pieces, i * pieces + pieces);
        newRows.push(row);
      }
      setRows(newRows);
    };
    img.src = URL.createObjectURL(image);
  }

  function getDataUrl(imageData) {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const context = canvas.getContext('2d');
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }

  return (
    <div>
      <h1>Matter Puzzle Game</h1>
      <input type='file' onChange={handleImageUpload} />
      <br />
      {image && (
        <>
          <img
            src={URL.createObjectURL(image)}
            alt='S'
            onLoad={handleImageLoad}
          />
          <br />
          <label htmlFor='pieces'>Number of Pieces: </label>
          <select id='pieces' value={pieces} onChange={handlePiecesChange}>
            <option value={2}>4</option>
            <option value={4}>16</option>
            <option value={9}>81</option>
          </select>
          <br />

          {rows.map(row => (
            <div style={{ display: 'flex' }}>
              {row.map((piece, index) => (
                <img
                  key={piece.id}
                  src={piece.dataUrl}
                  alt={`Piece ${piece.id}`}
                  draggable={!piece.isPlaced}
                  style={{ margin: '10px 10px' }}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Home;
