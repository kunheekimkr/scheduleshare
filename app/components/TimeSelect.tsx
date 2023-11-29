import React from "react";
import "../styles/TimeSelect.css"; // You can create a CSS file for styling

interface TimeBlockProps {
  selected: boolean;
  onClick: () => void;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

interface TimeSelectProps {
  selectedBlocks: boolean[];
  setSelectedBlocks: React.Dispatch<React.SetStateAction<boolean[]>>;
  actions: { [name: string]: any };
  presences: any;
  date: string;
}

const TimeBlock: React.FC<TimeBlockProps> = ({
  selected,
  onClick,
  onMouseDown,
  onMouseEnter,
}) => {
  const blockStyle: React.CSSProperties = selected
    ? { backgroundColor: "green" }
    : {};

  return (
    <div
      className="time-block"
      style={blockStyle}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      <button type="button" onClick={onClick} style={{ display: "none" }} />
    </div>
  );
};

const TimeSelect: React.FC<TimeSelectProps> = (props) => {
  const { selectedBlocks, setSelectedBlocks, actions, presences, date } = props;
  const [isSelecting, setIsSelecting] = React.useState<boolean>(false);
  const initialIndexRef = React.useRef<number>(-1);

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

  return (
    <div>
      <div className="time-select" onMouseUp={handleMouseUp}>
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
  );
};

export default TimeSelect;
