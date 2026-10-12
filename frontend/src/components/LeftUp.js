import React from 'react';

function LeftUp({ firstRow, restCollec = [], selectedCollection, onSelectCollection }) {
  const allCollections = [firstRow, ...restCollec].filter(Boolean);

  return (
    <div id="objectz" className="datano-card">
      <div id="objectzName" className="datano-card-header">
        Objects :
      </div>

      <div id="objectzList" className="datano-objects-list">
        {allCollections.map((item) => {
          const isChecked = selectedCollection === item;
          return (
            <label 
              key={item} 
              className="datano-checkbox-item"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCollection(item);
              }}
            >
              <input
                type="checkbox"
                name="collectionSelect"
                id={item}
                checked={isChecked}
                onChange={() => onSelectCollection(item)}
              />
              <span>{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default LeftUp;
