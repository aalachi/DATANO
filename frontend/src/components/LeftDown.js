import React from 'react';

function LeftDown({ viewCollec = [], currInstruId, onSelectInstruction }) {
  if (!viewCollec || viewCollec.length === 0) {
    return null;
  }

  return (
    <div id="lezobjet" className="col">
      <div id="apnxt" className="row">
        Up Next ({viewCollec.length})
      </div>

      <div className="row">
        <div className="col" style={{ height: '550px', overflowY: 'auto' }}>
          <div className="row" style={{ height: '10px' }} />
          {viewCollec.map((item) => {
            const isSelected = String(item.id) === String(currInstruId);
            return (
              <div className="row mb-3" key={item.id}>
                <div className="col">
                  <div
                    style={{
                      border: isSelected ? '3px solid #007bff' : '2px solid transparent',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 10px rgba(0,123,255,0.5)' : 'none'
                    }}
                    onClick={() => onSelectInstruction(item.id)}
                  >
                    <img
                      alt={item.instru || 'Task image'}
                      src={item.src}
                      id={String(item.id)}
                      style={{ width: '100%', display: 'block' }}
                      loading="lazy"
                    />
                  </div>
                  <div className="d-flex justify-content-between text-muted px-1 mt-1" style={{ fontSize: '11px' }}>
                    <span>{item.taskId}</span>
                    <span className="badge bg-secondary" style={{ fontSize: '10px' }}>{item.urgency || 'Normal'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LeftDown;