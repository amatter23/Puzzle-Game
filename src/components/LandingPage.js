import React, { useState, useRef } from 'react';
import './LandingPage.css';
import img from '../blob-scene-haikei.svg';
function LandingPage() {
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

  function handleImageLoad(e) {
    const img = document.createElement('img');
    document.getElementById('main').style.display = 'none';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(img, 0, 0, 400, 400);
      const newPieces = [];
      const width = 400 / pieces;
      const height = 400 / pieces;
      for (let i = 0; i < pieces; i++) {
        for (let j = 0; j < pieces; j++) {
          const x = j * width;
          const y = i * height;
          const imageData = context.getImageData(x, y, width, height);
          const dataUrl = getDataUrl(imageData);
          newPieces.push({
            id: i * pieces + j,
            dataUrl,
            top: i,
            left: j,
            style: {
              opacity: 1,
              position: 'absolute',
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

  const [isPlaced, setIsPlaced] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const divRef = useRef([]);
  const imgRef = useRef([]);
  function divResive() {
    return rows.map(row => (
      <div style={{ display: 'flex', width: '100%' }}>
        {row.map(piece => (
          <div
            ref={el => (divRef.current[piece.id] = el)}
            id={piece.id}
            style={{
              border: '1px solid black',
              width: '100px',
              height: '100px',
            }}
          ></div>
        ))}{' '}
      </div>
    ));
  }

  function handleDragEnd(event, piece) {
    const divRect = divRef.current[piece.id].getBoundingClientRect();
    const imgRect = imgRef.current[piece.id].getBoundingClientRect();
    const diffX = Math.abs(divRect.x - imgRect.x);
    const diffY = Math.abs(divRect.y - imgRect.y);
    if (diffX <= 30 && diffY <= 30) {
      // If the piece is placed correctly, update its isPlaced property to true
      const newRows = [...rows];
      const row = newRows[piece.top];
      row[piece.left].isPlaced = true;
      setRows(newRows);
      piece.style.left = divRect.left + 'px';
      piece.style.top = divRect.top + 'px';
    }
    // Always update the piece's position to match its parent div
  }

  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);

  const [openInfo, setOpenInfo] = useState(false);
  return (
    <>
      <div className='contaner'>
        <div className='waviy'>
          <span>Welcome</span>
          <span>in</span>
          <span>Matter</span>
          <span>Game</span>
        </div>
        {/* <div class='content'>
        <h2>Kemi</h2>
        <h2>Kemi</h2>
      </div> */}
        <a
          onClick={() => {
            setOpenInfo(true);
          }}
          id='scroll-btn'
          href={'#sec2'}
        ></a>
      </div>
      <div className='about' id='sec2'>
        <div className='inbut'>
          <input type='file' onChange={handleImageUpload} />
        </div>
      </div>
      <div>
        {image && (
          <>
            <img
              src={URL.createObjectURL(image)}
              alt='S'
              onLoad={handleImageLoad}
              id='main'
            />{' '}
            <br />
            <label htmlFor='pieces'> Number of Pieces: </label>{' '}
            <select id='pieces' value={pieces} onChange={handlePiecesChange}>
              <option value={2}> 4 </option> <option value={4}> 16 </option>{' '}
              <option value={9}> 81 </option>{' '}
            </select>{' '}
            <br />{' '}
            {rows.map(row => (
              <div style={{ display: 'flex', width: '100%' }}>
                {' '}
                {row.map(piece => (
                  <img
                    ref={el => (imgRef.current[piece.id] = el)}
                    style={piece.style}
                    dragElastic={0.5}
                    dragMomentum={false}
                    alt={`Piece ${piece.id}`}
                    key={piece.id}
                    id={piece.id}
                    src={piece.dataUrl}
                    onDragStart={(event, data) => {
                      setStartX(event.clientX);
                      setStartY(event.clientY);
                    }}
                    onDragEnd={(event, data) => {
                      const div1Rect =
                        divRef.current[event.target.id].getBoundingClientRect();

                      console.log(div1Rect.x);
                      console.log(div1Rect.y - 150);
                      console.log(event.clientX - startX);
                      console.log(event.clientY - startY);
                      if (
                        event.clientX - startX <= div1Rect.x + 20 &&
                        event.clientY - startY <= div1Rect.y - 150 &&
                        event.clientX - startX >= div1Rect.x - 20
                      ) {
                        imgRef.current[event.target.id].style.left =
                          div1Rect.left + 'px';
                        imgRef.current[event.target.id].style.top =
                          div1Rect.top + 'px';
                        setIsPlaced(prev => {
                          prev[event.target.id] = 1;
                          return prev;
                        });
                      }
                    }}
                  />
                ))}{' '}
              </div>
            ))}
            {divResive()}
          </>
        )}
      </div>
    </>
  );
}

export default LandingPage;
