import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAlerts, updateAlert } from '../api';

export default function IncidentDetails({ user }) {
  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const statusLockRef = useRef(null); // keeps optimistic status from being overwritten
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAlerts().then(list => {
      const incoming = list.find(a => a.id === id);
      setAlert(prev => {
        const merged = { ...(prev || {}), ...(incoming || {}) };
        const lock = statusLockRef.current;
        // Preserve optimistic status if a stale payload arrives.
        if (lock && incoming?.status !== lock) {
          merged.status = lock;
        } else if (lock && incoming?.status === lock) {
          statusLockRef.current = null; // server confirmed optimistic status
        }
        return merged;
      });
    });
  }, [id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!alert) return <div className="card">Loading incident...</div>;

  async function setStatus(s) {
    // Optimistically update status while keeping existing fields intact.
    const actorName = user?.fullName || user?.name || user?.username || null;
    const actorId = user?.id || user?.username || null;

    statusLockRef.current = s;
    setAlert(prev =>
      prev
        ? {
            ...prev,
            status: s,
            officer: s === 'escalated' ? actorName : prev.officer
          }
        : prev
    );

    try {
      const payload =
        s === 'escalated'
          ? {
              status: s,
              escalatedBy: actorId,
              escalatedByName: actorName
            }
          : { status: s };
      const updated = await updateAlert(id, payload);
      setAlert(prev => {
        if (!prev) return updated || { status: s };
        const merged = { ...prev, ...(updated || {}) };
        // Do not let stale responses override the optimistic status.
        const lock = statusLockRef.current;
        if (lock && updated?.status !== lock) {
          merged.status = lock;
        } else if (!('status' in merged)) {
          merged.status = s;
        } else if (lock && updated?.status === lock) {
          statusLockRef.current = null; // confirmed by server
        }
        return merged;
      });
    } catch (err) {
      console.error('[incident] failed to update status', err);
      // Optionally restore previous status or keep optimistic value; leaving as-is to avoid flicker.
    }

    if (s === 'escalated') {
      setToast({
        type: 'success',
        message: 'Police unit has been deployed for this incident.',
      });
    } else if (s === 'declined') {
      setToast({
        type: 'danger',
        message: 'Alert has been declined.',
      });
    }
  }

  const status = alert.status || '';

  return (
    <>
      <div>
        <div style={{ marginBottom: 16 }}>
          <Link to="/" className="back-link">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="row">
          {/* LEFT: incident info */}
          <div className="col card incident-card">
            <h3 className="incident-title">Incident {alert.id}</h3>

            <div className="incident-field-pill">
              <span className="incident-field-label">Type:</span>
              <span className="incident-field-value">{alert.type}</span>
            </div>

            <div className="incident-field-pill">
              <span className="incident-field-label">Weapon:</span>
              <span className="incident-field-value">{alert.weapon}</span>
            </div>

            <div className="incident-field-pill">
              <span className="incident-field-label">Confidence:</span>
              <span className="incident-field-value">
                {(alert.confidence || 0).toFixed(2)}
              </span>
            </div>

            <div className="incident-field-pill">
              <span className="incident-field-label">Timestamp:</span>
              <span className="incident-field-value">
                {new Date(alert.timestamp).toLocaleString()}
              </span>
            </div>

            {/* ACTIONS / STATUS PILL */}
            <div className="incident-actions">
              {status === 'escalated' && (
                <div className="incident-processing-pill incident-processing-pill--escalated">
                  Processing escalation… dispatching police unit
                </div>
              )}

              {status === 'declined' && (
                <div className="incident-processing-pill incident-processing-pill--declined">
                  Alert has been declined
                </div>
              )}

              {status === 'resolved' && (
                <div className="incident-processing-pill incident-processing-pill--resolved">
                  Incident resolved and closed
                </div>
              )}

              {status !== 'escalated' &&
                status !== 'declined' &&
                status !== 'resolved' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStatus('escalated')}
                      className={
                        'incident-action-btn incident-action-btn--primary' +
                        (status === 'escalated'
                          ? ' incident-action-btn--active'
                          : '')
                      }
                    >
                      Escalate
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatus('declined')}
                      className={
                        'incident-action-btn incident-action-btn--muted' +
                        (status === 'declined'
                          ? ' incident-action-btn--active'
                          : '')
                      }
                    >
                      Decline
                    </button>
                  </>
                )}
            </div>
          </div>

          {/* RIGHT: video / snapshot */}
          <div className="card incident-media">
            <h3 className="incident-title">Video / Snapshot</h3>

            <div className="incident-media-box">
              {alert.snapshot ? (
                <img
                  src={alert.snapshot}
                  alt="snapshot"
                  className="incident-media-img"
                />
              ) : (
                <div className="incident-media-placeholder">
                  No snapshot available
                </div>
              )}
            </div>

            <div className="incident-location-pill">
              <span className="incident-field-label">Location</span>
              <span className="incident-field-value">
                {alert.location
                  ? `${alert.location.lat}, ${alert.location.lng}`
                  : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className={
            'alert-toast ' +
            (toast.type === 'success'
              ? 'alert-toast-success'
              : 'alert-toast-danger')
          }
        >
          <span className="alert-toast-title">Incident update</span>
          <span className="alert-toast-message"> {toast.message}</span>
        </div>
      )}
    </>
  );
}
