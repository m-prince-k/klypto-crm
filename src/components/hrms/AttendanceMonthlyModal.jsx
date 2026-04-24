import React, { useState, useEffect } from "react";
import { X, CalendarDays, Loader } from "lucide-react";
import apiClient from "../../api/apiClient";

const AttendanceMonthlyModal = ({ employeeId, employeeName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  
  // Default to current month YYYY-MM
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const [selectedMonth, setSelectedMonth] = useState(`${year}-${month}`);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/attendance?employeeId=${employeeId}&month=${selectedMonth}`);
        
        // Map and format the backend records
        const formattedRecords = res.data.map(record => {
          let checkIn = "-";
          let checkOut = "-";
          let workDuration = "00:00";

          if (record.checkIn) {
            checkIn = new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          if (record.checkOut) {
            checkOut = new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          if (record.checkIn && record.checkOut) {
            const diffMs = new Date(record.checkOut) - new Date(record.checkIn);
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            workDuration = `${diffHrs}:${diffMins.toString().padStart(2, "0")}`;
          }

          const localDate = new Date(record.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

          return {
            ...record,
            localDate,
            checkIn,
            checkOut,
            workDuration
          };
        });

        // Sort records by date ascending
        formattedRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
        setRecords(formattedRecords);

      } catch (err) {
        console.error("Error fetching monthly attendance", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [employeeId, selectedMonth]);

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
      justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%', maxWidth: '700px', maxHeight: '90vh',
        backgroundColor: 'var(--bg-card)', borderRadius: '16px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{employeeName}'s Attendance Log</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>View detailed daily check-ins and working hours.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'var(--column-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarDays size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Select Month:</span>
          </div>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="hrms-input"
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-body)', color: 'var(--text)', outline: 'none' }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spinner" /></div>
          ) : records.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No attendance records found for this month.</div>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', padding: '10px 16px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <div>Date</div>
                <div>In Time</div>
                <div>Out Time</div>
                <div>Work Dur.</div>
                <div style={{ textAlign: 'right' }}>Status</div>
              </div>
              
              {records.map(record => (
                <div key={record.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', padding: '14px 16px', borderRadius: '8px', backgroundColor: 'var(--column-bg)', border: '1px solid var(--border)', fontSize: '13px', alignItems: 'center' }}>
                  <div style={{ fontWeight: '600' }}>{record.localDate}</div>
                  <div style={{ color: record.checkIn !== '-' ? 'var(--text)' : 'var(--text-muted)' }}>{record.checkIn}</div>
                  <div style={{ color: record.checkOut !== '-' ? 'var(--text)' : 'var(--text-muted)' }}>{record.checkOut}</div>
                  <div style={{ fontWeight: '500' }}>{record.workDuration}</div>
                  <div style={{ textAlign: 'right', fontWeight: '700', color: record.status === 'Present' ? '#10b981' : record.status === 'Leave' ? '#f59e0b' : record.status === 'Late' ? '#0ea5e9' : '#ef4444' }}>
                    {record.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceMonthlyModal;
