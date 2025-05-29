import React, { useState, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";

const DraggableItem = ({ id, x, y, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    position: "absolute",
    left: x + (transform?.x || 0),
    top: y + (transform?.y || 0),
    cursor: "grab",
    touchAction: "none",
    userSelect: "none",
    pointerEvents: "auto",
    zIndex: 10,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {children}
    </div>
  );
};

const SignatureOverlay = ({ items = [], pageNumber, onItemsChange }) => {
  const [localItems, setLocalItems] = useState(items);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // Глобальний обробник drag завершення
  const handleDragEnd = (event) => {
    const { delta, active } = event;
    const { id } = active;

    const updatedItems = localItems.map((item) =>
      item.id === id
        ? {
            ...item,
            x: (item.x ?? 0) + delta.x,
            y: (item.y ?? 0) + delta.y,
          }
        : item
    );

    setLocalItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const handleTextChange = (id, text) => {
    const updated = localItems.map((item) =>
      item.id === id ? { ...item, text } : item
    );
    setLocalItems(updated);
    onItemsChange(updated);
  };

  const handleTextResize = (id, width, height) => {
    const updated = localItems.map((item) =>
      item.id === id ? { ...item, width, height } : item
    );
    setLocalItems(updated);
    onItemsChange(updated);
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        {localItems.map((item) => (
          <DraggableItem key={item.id} id={item.id} x={item.x} y={item.y}>
            {item.type === "image" && (
              <img
                src={item.src}
                alt="Підпис"
                style={{
                  maxWidth: 150,
                  maxHeight: 70,
                  userSelect: "none",
                  pointerEvents: "auto",
                  draggable: false,
                }}
              />
            )}

            {item.type === "text" && (
              <textarea
                value={item.text}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                onBlur={(e) =>
                  handleTextResize(
                    item.id,
                    e.target.offsetWidth,
                    e.target.offsetHeight
                  )
                }
                style={{
                  width: item.width,
                  height: item.height,
                  resize: "both",
                  fontSize: 14,
                  padding: 4,
                  pointerEvents: "auto",
                  boxSizing: "border-box",
                  backgroundColor: "transparent"
                }}
              />
            )}
          </DraggableItem>
        ))}
      </DndContext>
    </div>
  );
};

export default SignatureOverlay;
