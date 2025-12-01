// client/src/components/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const nav = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-inner">
        <h1 className="notfound-code">
          4
          <span className="map-live-badge-dot notfound-dot" />
          4
        </h1>
        <p className="notfound-text">Ooops, I believe you are lost</p>

        <button
          type="button"
          className="notfound-button"
          onClick={() => nav('/')}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}