import { useApp } from '../context/AppContext';
import { daysUntil, formatDate } from '../utils/dateUtils';
import HoneymoonDetails from '../components/honeymoon/HoneymoonDetails';
import PackingListPanel from '../components/honeymoon/PackingListPanel';
import TravelPlansPanel from '../components/honeymoon/TravelPlansPanel';
import './HoneymoonPlanner.css';

export default function HoneymoonPlanner() {
  const {
    data,
    updateHoneymoon,
    addPackingItem,
    updatePackingItem,
    deletePackingItem,
    addPackingItemsBulk,
    addTravelPlanItem,
    updateTravelPlanItem,
    deleteTravelPlanItem,
  } = useApp();

  const { honeymoon } = data;
  const departureDays = honeymoon.startDate ? daysUntil(honeymoon.startDate) : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="page-eyebrow">Honeymoon Planner</p>
        <h1 className="page-title">Honeymoon Planner</h1>
        <p className="page-subtitle">
          {honeymoon.destination
            ? `${honeymoon.destination}${departureDays !== null && departureDays >= 0 ? ` — ${departureDays} day${departureDays === 1 ? '' : 's'} until departure` : ''}`
            : 'Where are you headed after the celebrations end?'}
        </p>
      </div>

      <HoneymoonDetails honeymoon={honeymoon} currency={data.meta.currency} onUpdate={updateHoneymoon} />

      <div className="honeymoon-columns">
        <PackingListPanel
          packingList={honeymoon.packingList}
          onAdd={addPackingItem}
          onUpdate={updatePackingItem}
          onDelete={deletePackingItem}
          onBulkAdd={addPackingItemsBulk}
        />
        <TravelPlansPanel
          travelPlans={honeymoon.travelPlans}
          onAdd={addTravelPlanItem}
          onUpdate={updateTravelPlanItem}
          onDelete={deleteTravelPlanItem}
        />
      </div>
    </div>
  );
}
