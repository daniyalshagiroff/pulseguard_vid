// client/src/components/LiveCam.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function LiveCam() {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  // enumerate camera devices
  useEffect(() => {
    async function loadDevices() {
      try {
        // warm-up permission so labels appear
        await navigator.mediaDevices.getUserMedia({ video: true, audio: false }).catch(() => {});
        const all = await navigator.mediaDevices.enumerateDevices();
        const cams = all.filter(d => d.kind === 'videoinput');
        setDevices(cams);
        if (cams.length > 0 && !deviceId) {
          setDeviceId(cams[0].deviceId);
        }
      } catch (err) {
        console.error('[LiveCam] enumerateDevices failed:', err);
        setError('Cannot list cameras. Check browser permissions.');
      }
    }

    if (navigator.mediaDevices?.enumerateDevices) {
      loadDevices();
    } else {
      setError('Media devices API not supported in this browser.');
    }
  }, [deviceId]);

  // start/refresh stream whenever deviceId changes
  useEffect(() => {
    if (!deviceId) return;
    let stream;

    async function start() {
      setIsStarting(true);
      setError(null);
      try {
        const constraints = {
          video: {
            deviceId: { exact: deviceId },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error('[LiveCam] getUserMedia failed:', err);
        setError('Unable to start selected camera. Check permissions or try another device.');
      } finally {
        setIsStarting(false);
      }
    }

    start();

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [deviceId]);

  return (
    <div>
      {/* camera selector */}
      <div style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#aaa' }}>Camera:</span>
        <select
          value={deviceId || ''}
          onChange={e => setDeviceId(e.target.value)}
          style={{
            flex: 1,
            padding: '4px 8px',
            borderRadius: 4,
            border: '1px solid #444',
            background: '#111',
            color: '#eee',
            fontSize: 13,
          }}
        >
          {devices.length === 0 && <option>No cameras found</option>}
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Camera ${d.deviceId.slice(0, 6)}`}
            </option>
          ))}
        </select>
      </div>

      {/* video / error area in fixed aspect ratio */}
      {error ? (
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 6,
            background: '#111',
            color: '#f77',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {isStarting && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ccc',
                background: 'rgba(0,0,0,0.35)',
                zIndex: 1,
                fontSize: 13,
              }}
            >
              Starting camera…
            </div>
          )}

          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: 6,
              overflow: 'hidden',
              background: '#000',
            }}
          >
            <video
              ref={videoRef}
              muted
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // fill box nicely
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
