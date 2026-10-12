import React, { useState, useMemo, useEffect } from 'react';
import LeftUp from './LeftUp';
import LeftDown from './LeftDown';
import Center from './Center';
import Right from './Right';

function Main({ data = [] }) {
  const [currCollectionName, setCurrCollectionName] = useState('');
  const [currInstruId, setCurrInstruId] = useState('');
  // Store annotations keyed by taskId: { [taskId]: [crop1, crop2, ...] }
  const [taskAnnotations, setTaskAnnotations] = useState({});

  // Extract unique collection names
  const { firstRow, restCollec } = useMemo(() => {
    if (!data || data.length === 0) {
      return { firstRow: null, restCollec: [] };
    }

    const uniqueCollections = Array.from(new Set(data.map((item) => item.collection).filter(Boolean)));
    const first = uniqueCollections[0] || null;
    const rest = uniqueCollections.slice(1);

    return { firstRow: first, restCollec: rest };
  }, [data]);

  // Set default collection once data arrives
  useEffect(() => {
    if (firstRow && !currCollectionName) {
      setCurrCollectionName(firstRow);
    }
  }, [firstRow, currCollectionName]);

  // Filter tasks belonging to active collection
  const viewCollec = useMemo(() => {
    if (!data || !currCollectionName) return [];
    return data.filter((item) => item.collection === currCollectionName);
  }, [data, currCollectionName]);

  // Set default instruction when collection changes
  useEffect(() => {
    if (viewCollec.length > 0) {
      // If current instruction is not in viewCollec, select the first one
      const existsInCurrentView = viewCollec.some((item) => String(item.id) === String(currInstruId));
      if (!existsInCurrentView) {
        setCurrInstruId(String(viewCollec[0].id));
      }
    }
  }, [viewCollec, currInstruId]);

  // Get current active instruction object
  const currInstru = useMemo(() => {
    if (!data || !currInstruId) return null;
    return data.find((item) => String(item.id) === String(currInstruId)) || null;
  }, [data, currInstruId]);

  // Current active unique task key (using database id to avoid collision between collections sharing taskId)
  const activeTaskKey = currInstru ? String(currInstru.id) : 'default';
  const currentTaskCrops = taskAnnotations[activeTaskKey] || [];

  // Annotation handlers
  const handleAddCrop = (newCrop) => {
    setTaskAnnotations((prev) => ({
      ...prev,
      [activeTaskKey]: [...(prev[activeTaskKey] || []), newCrop]
    }));
  };

  const handleDeleteCrop = (cropId) => {
    setTaskAnnotations((prev) => ({
      ...prev,
      [activeTaskKey]: (prev[activeTaskKey] || []).filter((crop) => crop.id !== cropId)
    }));
  };

  const handleClearAllCrops = () => {
    setTaskAnnotations((prev) => ({
      ...prev,
      [activeTaskKey]: []
    }));
  };

  if (!firstRow) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
        <p>No collections found in dataset.</p>
      </div>
    );
  }

  return (
    <div className="datano-layout">
      <aside className="datano-sidebar">
        <LeftUp
          firstRow={firstRow}
          restCollec={restCollec}
          selectedCollection={currCollectionName}
          onSelectCollection={(name) => setCurrCollectionName(name)}
        />

        <LeftDown
          viewCollec={viewCollec}
          currInstruId={currInstruId}
          onSelectInstruction={(id) => setCurrInstruId(String(id))}
        />
      </aside>

      <Center
        currInstru={currInstru}
        onAddCrop={handleAddCrop}
        existingCrops={currentTaskCrops}
      />

      <Right
        currInstru={currInstru}
        crops={currentTaskCrops}
        onDeleteCrop={handleDeleteCrop}
        onClearAll={handleClearAllCrops}
      />
    </div>
  );
}

export default Main;
