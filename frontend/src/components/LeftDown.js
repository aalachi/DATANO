import React from 'react';

function LeftDown({ viewCollec = [], currInstruId, onSelectInstruction }) {
  if (!viewCollec || viewCollec.length === 0) {
    return null;
  }

  return (
    <div id="lezobjet" className="datano-card">
      <div id="apnxt" className="datano-card-header">
        Up Next ({viewCollec.length})
      </div>

      <div className="datano-queue-scroll">
        {viewCollec.map((item) => {
          const isSelected = String(item.id) === String(currInstruId);
          return (
            <div
              key={item.id}
              className={`datano-thumb-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectInstruction(item.id)}
            >
              <img
                alt={item.instru || 'Task image'}
                src={item.src}
                id={String(item.id)}
                loading="lazy"
              />
              <div className="datano-thumb-meta">
                <span>{item.taskId}</span>
                <span className="datano-badge datano-badge-secondary">
                  {item.urgency || 'Normal'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeftDown;