// client/src/components/History.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function History({ alerts = [] }) {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [officerFilter, setOfficerFilter] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);

  const statusRef = useRef(null);
  const nav = useNavigate();

  // close popup when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (!statusRef.current) return;
      if (!statusRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const list = alerts.filter(a => {
    const ts = new Date(a.timestamp);
    const dateStr = ts.toLocaleDateString();
    const timeStr = ts.toLocaleTimeString(); // still used for display

    const matchesSearch =
      !search ||
      a.id?.toLowerCase().includes(search.toLowerCase()) ||
      a.type?.toLowerCase().includes(search.toLowerCase()) ||
      a.weapon?.toLowerCase().includes(search.toLowerCase());

    const matchesDate = !dateFilter || dateStr.includes(dateFilter);
    const matchesStatus = !statusFilter || a.status === statusFilter;
    const matchesOfficer =
      !officerFilter ||
      (a.officer &&
        a.officer.toLowerCase().includes(officerFilter.toLowerCase()));

    return (
      matchesSearch &&
      matchesDate &&
      matchesStatus &&
      matchesOfficer
    );
  });

  const statusLabel = statusFilter ? `Status: ${statusFilter}` : 'Status: any';

  const statusOptions = [
    { value: '', label: 'Status: any' },
    { value: 'active', label: 'Status: active' },
    { value: 'escalated', label: 'Status: escalated' },
    { value: 'declined', label: 'Status: declined' },
    { value: 'resolved', label: 'Status: resolved' },
  ];

  return (
    <div className="card history-card">
      <h3 className="history-title">Incident History</h3>

      {/* Filters row */}
      <div className="history-filters">
        <div className="history-filter-pill">
          <span className="history-filter-icon">🔍</span>
          <input
            className="history-filter-input"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="history-filter-pill">
          <span className="history-filter-icon">📅</span>
          <input
            className="history-filter-input"
            placeholder="MM/DD/YYYY"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>

        {/* Officer filter */}
        <div className="history-filter-pill">
          <span className="history-filter-icon">👮</span>
          <input
            className="history-filter-input"
            placeholder="Officer"
            value={officerFilter}
            onChange={e => setOfficerFilter(e.target.value)}
          />
        </div>

        {/* Custom status popup */}
        <div
          className="history-filter-pill history-status-pill"
          ref={statusRef}
        >
          <button
            type="button"
            className="history-status-trigger"
            onClick={() => setStatusOpen(o => !o)}
          >
            <span className="history-filter-icon">🧿</span>
            <span className="history-status-label">{statusLabel}</span>
            <span className="history-status-caret">▾</span>
          </button>

          {statusOpen && (
            <div className="history-status-menu">
              {statusOptions.map(opt => (
                <button
                  key={opt.value || 'any'}
                  type="button"
                  className={
                    'history-status-option' +
                    (opt.value === statusFilter ? ' is-active' : '')
                  }
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setStatusOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="history-table">
        <div className="history-header-row">
          <div className="history-header-cell history-col-id">Name/ID</div>
          <div className="history-header-cell history-col-tag">TAG</div>
          <div className="history-header-cell history-col-date">Date</div>
          <div className="history-header-cell history-col-time">Time</div>
          <div className="history-header-cell history-col-officer">Officer</div>
          <div className="history-header-cell history-col-status">Status</div>
        </div>

        {list.map(a => {
          const ts = new Date(a.timestamp);
          const dateStr = ts.toLocaleDateString();
          const timeStr = ts.toLocaleTimeString();

          return (
            <div
              key={a.id}
              className={
                'history-row ' +
                (a.status === 'active' ? 'history-row-active' : '')
              }
              onClick={() => nav(`/incident/${a.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  nav(`/incident/${a.id}`);
                }
              }}
            >
              <div className="history-cell history-col-id">
                <span className="history-id-link">{a.id}</span>
              </div>
              <div className="history-cell history-col-tag">
                {a.type}, {a.weapon}
              </div>
              <div className="history-cell history-col-date">{dateStr}</div>
              <div className="history-cell history-col-time">{timeStr}</div>
              <div className="history-cell history-col-officer">
                {a.officer || '—'}
              </div>
              <div className="history-cell history-col-status">
                <span
                  className={
                    'history-status-pill-text history-status-' + a.status
                  }
                >
                  {a.status}
                </span>
              </div>
            </div>
          );
        })}

        {list.length === 0 && (
          <div className="history-empty">No incidents match filters.</div>
        )}
      </div>
    </div>
  );
}

