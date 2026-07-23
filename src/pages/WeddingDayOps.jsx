import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ScheduleTracker from '../components/weddingday/ScheduleTracker';
import TransportPanel from '../components/weddingday/TransportPanel';
import EmergencyContactsPanel from '../components/weddingday/EmergencyContactsPanel';
import ResponsibilitiesPanel from '../components/weddingday/ResponsibilitiesPanel';
import './WeddingDayOps.css';

const TABS = [
  { key: 'schedule', label: 'Schedule' },
  { key: 'transport', label: 'Transport' },
  { key: 'contacts', label: 'Emergency Contacts' },
  { key: 'responsibilities', label: 'Responsibilities' },
];

export default function WeddingDayOps() {
  const {
    data,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    addScheduleItemsBulk,
    addTransportItem,
    updateTransportItem,
    deleteTransportItem,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    addResponsibility,
    updateResponsibility,
    deleteResponsibility,
    addResponsibilitiesBulk,
  } = useApp();

  const [tab, setTab] = useState('schedule');
  const { schedule, transport, emergencyContacts, responsibilities } = data.weddingDayOps;

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="page-eyebrow">Wedding Day Operations</p>
        <h1 className="page-title">Wedding Day Operations</h1>
        <p className="page-subtitle">The command center for the day itself — timing, transport, contacts, and who's doing what.</p>
      </div>

      <div className="lobola-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`lobola-tab ${tab === t.key ? 'lobola-tab-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'schedule' && (
        <ScheduleTracker
          schedule={schedule}
          onAdd={addScheduleItem}
          onUpdate={updateScheduleItem}
          onDelete={deleteScheduleItem}
          onBulkAdd={addScheduleItemsBulk}
        />
      )}

      {tab === 'transport' && (
        <TransportPanel
          transport={transport}
          onAdd={addTransportItem}
          onUpdate={updateTransportItem}
          onDelete={deleteTransportItem}
        />
      )}

      {tab === 'contacts' && (
        <EmergencyContactsPanel
          contacts={emergencyContacts}
          onAdd={addEmergencyContact}
          onUpdate={updateEmergencyContact}
          onDelete={deleteEmergencyContact}
        />
      )}

      {tab === 'responsibilities' && (
        <ResponsibilitiesPanel
          responsibilities={responsibilities}
          onAdd={addResponsibility}
          onUpdate={updateResponsibility}
          onDelete={deleteResponsibility}
          onBulkAdd={addResponsibilitiesBulk}
        />
      )}
    </div>
  );
}
