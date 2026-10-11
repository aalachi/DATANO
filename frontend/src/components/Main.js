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

  // Current active taskId
  const activeTaskId = currInstru?.taskId || 'default';
  const currentTaskCrops = taskAnnotations[activeTaskId] || [];

  // Annotation handlers
  const handleAddCrop = (newCrop) => {
    setTaskAnnotations((prev) => ({
      ...prev,
      [activeTaskId]: [...(prev[activeTaskId] || []), newCrop]
    }));
  };

  const handleDeleteCrop = (cropId) => {
    setTaskAnnotations((prev) => ({
      ...prev,
      [activeTaskId]: (prev[activeTaskId] || []).filter((crop) => crop.id !== cropId)
    }));
  };

  const handleClearAllCrops = () => {
    setTaskAnnotations((prev) => ({
      ...prev,
      [activeTaskId]: []
    }));
  };

  if (!firstRow) {
    return (
      <div className="col-12 text-center py-5">
        <p className="text-muted">No collections found in dataset.</p>
      </div>
    );
  }

  return (
    <>
      <div className="col-lg-2">
        <LeftUp
          firstRow={firstRow}
          restCollec={restCollec}
          selectedCollection={currCollectionName}
          onSelectCollection={(name) => setCurrCollectionName(name)}
        />

        <div className="my-3" />

        <LeftDown
          viewCollec={viewCollec}
          currInstruId={currInstruId}
          onSelectInstruction={(id) => setCurrInstruId(String(id))}
        />
      </div>

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
    </>
  );
}

export default Main;
