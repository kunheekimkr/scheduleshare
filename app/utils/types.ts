export interface ENVtypes {
  url: string;
  apiKey: string;
}

export interface ContentTypes {
  date: string;
  selectedBlocks: Array<boolean>;
}

export interface EditorPropsTypes {
  content: Array<ContentTypes>;
  actions: { [name: string]: any };
  presences: any;
}

export interface ProfileStackProps {
  presences: any;
  myClientID: string;
}

export interface TimeBlockProps {
  selected: boolean;
  onClick: () => void;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

export interface TimeSelectProps {
  selectedBlocks: boolean[];
  setSelectedBlocks: React.Dispatch<React.SetStateAction<boolean[]>>;
  actions: { [name: string]: any };
  date: string;
}

export interface CustomModalProps {
  isOpen: boolean;
  userName: string;
  handleUsernameInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleModalSubmit: () => void;
}

export type ChangeEventHandler = (
  event: React.ChangeEvent<HTMLInputElement>
) => void;

type ValuePiece = Date | any;

export type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];
