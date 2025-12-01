// client/src/components/AlertList.jsx
import React, { useState, useEffect } from 'react';
import { updateAlert } from '../api';

export default function AlertList({ alerts = [], onInspect, user }) {
  const [toast, setToast] = useState(null);

  async function doAction(id, action) {
    const actorName = user?.fullName || user?.name || user?.username || null;
    const actorId = user?.id || user?.username || null;

    const payload =
      action === 'escalated'
        ? {
            status: action,
            escalatedBy: actorId,
            escalatedByName: actorName
          }
        : { status: action };

    await updateAlert(id, payload);

    if (action === 'escalated') {
      setToast({
        type: 'success',
        message: 'Police unit has been deployed for this incident.',
      });
    } else if (action === 'declined') {
      setToast({
        type: 'danger',
        message: 'Alert has been declined.',
      });
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!alerts.length) {
    return <div style={{ color: '#9fbbd6' }}>No active alerts</div>;
  }

  return (
    <>
      <div className="alert-list">
        {alerts.map(a => {
          const isEscalated = a.status === 'escalated';

          return (
            <div key={a.id} className="alert-item">
              <div className="alert-header">
                <div>
                  {/* FIRST LINE: A-1041 style incident id */}
                  <div className="alert-title">
                    {a.id}
                  </div>

                  {/* SECOND LINE: same style as History: type • weapon • time • status/conf */}
                  <div className="alert-meta">
                    {a.type} • {a.weapon} • {new Date(a.timestamp).toLocaleString()} •
                    {' '}Confidence: {(a.confidence || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="alert-actions">
                <button
                  className="alert-btn alert-btn-primary"
                  onClick={() => onInspect(a.id)}
                >
                  Inspect incident
                </button>

                <div className="alert-actions-row">
                  {isEscalated ? (
                    <div className="alert-processing-pill">
                      Processing escalation… dispatching police unit
                    </div>
                  ) : (
                    <>
                      <button
                        className="alert-btn alert-btn-escalate"
                        onClick={() => doAction(a.id, 'escalated')}
                      >
                        Escalate
                      </button>
                      <button
                        className="alert-btn alert-btn-decline"
                        onClick={() => doAction(a.id, 'declined')}
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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

