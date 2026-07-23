import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { generateNegotiationAgenda, generateTalkingPoints } from '../../utils/negotiationContent';

export default function NegotiationAgenda({ groomName, brideName, lobolaDate }) {
  const [openStage, setOpenStage] = useState(0);
  const agenda = generateNegotiationAgenda({ groomName, brideName, lobolaDate });
  const talkingPoints = generateTalkingPoints();

  return (
    <div className="card">
      <div className="card-header-row">
        <h3>Negotiation Day Agenda</h3>
      </div>
      <p className="page-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
        A guide for your munyai to adapt — every family's specific requests will differ. Use this to
        keep the day structured.
      </p>
      <div className="agenda-list">
        {agenda.map((stage, i) => (
          <div key={i} className="agenda-stage">
            <button
              className="agenda-stage-header"
              onClick={() => setOpenStage(openStage === i ? -1 : i)}
              aria-expanded={openStage === i}
            >
              <span>{stage.stage}</span>
              {openStage === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openStage === i && (
              <ul className="agenda-points">
                {stage.points.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="talking-points">
        <h4>Talking Points for the Munyai</h4>
        <ul>
          {talkingPoints.map((tp, i) => <li key={i}>{tp}</li>)}
        </ul>
      </div>
    </div>
  );
}
