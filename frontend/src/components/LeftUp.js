import React from 'react';

function LeftUp({ firstRow, restCollec = [], selectedCollection, onSelectCollection }) {
  const allCollections = [firstRow, ...restCollec].filter(Boolean);

  return (
    <div id="objectz" className="col">
      <div id="objectzName" className="row">
        Objects :
      </div>

      <div id="objectzList" className="row">
        <div className="col">
          {allCollections.map((item) => {
            const isChecked = selectedCollection === item;
            return (
              <div 
                className="row py-1 align-items-center" 
                key={item}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectCollection(item)}
              >
                <label className="d-flex align-items-center mb-0" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="myCheckbox"
                    id={item}
                    checked={isChecked}
                    onChange={() => onSelectCollection(item)}
                    style={{ marginRight: '8px' }}
                  />
                  <span>{item}</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LeftUp;
