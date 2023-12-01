import React, { useState, useRef, CSSProperties } from "react";
import { TimeBlockProps, TimeSelectProps } from "../utils/types";

function TimeBlock(props: TimeBlockProps) {
  const { selected, onClick, onMouseDown, onMouseEnter } = props;
  const blockStyle: CSSProperties = selected
    ? { backgroundColor: "green" }
    : {};

  return (
    <div
      className="h-5 text-center cursor-pointer w-12 leading-8 select-none border border-sold border-black hover:bg-gray-200"
      style={blockStyle}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      <button type="button" onClick={onClick} style={{ display: "none" }} />
    </div>
  );
}

export default function TimeSelect(props: TimeSelectProps) {
  const { selectedBlocks, setSelectedBlocks, actions, date } = props;
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const initialIndexRef = useRef<number>(-1);

  const handleBlockClick = (index: number) => {
    const newSelectedBlocks = [...selectedBlocks];
    newSelectedBlocks[index] = !newSelectedBlocks[index];
    setSelectedBlocks(newSelectedBlocks);
    actions.updateContent(date, newSelectedBlocks);
  };

  const handleMouseDown = (index: number) => {
    setIsSelecting(true);
    initialIndexRef.current = index;
    handleBlockClick(index);
  };

  const handleMouseEnter = (index: number) => {
    if (isSelecting) {
      const startIndex = initialIndexRef.current;
      const endIndex = index;
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);

      const newSelectedBlocks = selectedBlocks.map(
        (_, i) => i >= start && i <= end
      );

      // newselectedBlocks[i] = newselectedBlocks[i] OR selectedBlocks[i]
      for (let i = 0; i < 48; i++) {
        newSelectedBlocks[i] = newSelectedBlocks[i] || selectedBlocks[i];
      }

      setSelectedBlocks(newSelectedBlocks);
      actions.updateContent(date, newSelectedBlocks);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    initialIndexRef.current = -1;
  };

  const generateTimeBlocks = () => {
    const blocks: JSX.Element[] = [];
    for (let i = 0; i < 48; i++) {
      blocks.push(
        <TimeBlock
          key={i}
          selected={selectedBlocks[i]}
          onClick={() => handleBlockClick(i)}
          onMouseDown={() => handleMouseDown(i)}
          onMouseEnter={() => handleMouseEnter(i)}
        />
      );
    }
    return blocks;
  };

  const generateTimeText = () => {
    const timeText: JSX.Element[] = [];
    for (let i = 0; i < 49; i++) {
      timeText.push(
        <div className="text-xs text-white h-5 align-top " key={i}>
          {i % 2 == 0 ? `${i / 2}:00` : ``}
        </div>
      );
    }
    return timeText;
  };

  return (
    <div className="flex">
      <div className="w-1/4">{generateTimeText()}</div>
      <div className="w-3/4 ml-4">
        <div className="flex flex-col w-full" onMouseUp={handleMouseUp}>
          {generateTimeBlocks()}
        </div>
        <br />
        <button
          type="button"
          style={{
            backgroundColor: "red",
            width: "50px",
            height: "20px",
            color: "white",
          }}
          onClick={() => {
            setSelectedBlocks(Array(48).fill(false));
            actions.updateContent(date, Array(48).fill(false));
          }}
        >
          clear
        </button>
      </div>
    </div>
  );
}
