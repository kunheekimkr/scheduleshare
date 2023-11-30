import React from "react";

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
      className="h-5 text-center cursor-pointer w-12 leading-8 select-none border border-sold border-black hover:bg-gray-200"
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
};

export default TimeSelect;
