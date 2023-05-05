// Modules
import { BusinessDay } from "./types/BusinessDay.type";
import { Day } from "./types/Day.type";
import { WithStringId } from "./types/WithStringId.type";


type OpeningTimesPickerSpanProps = {
  fromDay: Day;
  toDay: Day;
  businessDay: WithStringId<BusinessDay>;
  style?: React.CSSProperties;
  customColor?: {
    bg: string;
    text: string;
  };
  onClick?: (id: string) => void;
};

function OpeningTimesPickerSpan(props: OpeningTimesPickerSpanProps) {
  const { fromDay, toDay, businessDay, style, customColor, onClick } = props;

  if (fromDay > toDay) return null;

  // Event Handlers
  const handleClick = (): void => {
    onClick?.(businessDay._id);
  };

  return (
    <div
      className="bb-ot-picker__interaction__item"
      style={{ ...style, gridColumnStart: fromDay, gridColumnEnd: toDay + 1 }}
    >
      <button
        className="bb-ot-picker__interaction__item__fill"
        style={
          customColor
            ? { backgroundColor: customColor.bg }
            : { backgroundColor: businessDay.closed ? '#cc3535' : '#a8ce51' }
        }
        onClick={handleClick}
      >
        <span style={customColor ? { color: customColor.text } : undefined}>
          {businessDay.closed ? 'Geschlossen' : 'Offen'}
        </span>
      </button>
    </div>
  );
}

export default OpeningTimesPickerSpan;
