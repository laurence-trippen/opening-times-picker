// Packages
import { Button, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { v4 as uuidv4 } from 'uuid';

// Modules
import { BusinessDay } from './types/BusinessDay.type';
import { WithStringId } from './types/WithStringId.type';
import { Day } from './types/Day.type';
import OpeningTimesDialog from './OpeningTimesDialog';
import OpeningTimesPickerSpan from './OpeningTimesPickerSpan';

type OpeningTimesPickerProps = {
  onBusinessDaysChanged: (businessDays: BusinessDay[]) => void;
  editModePayload?: BusinessDay[];
  style?: React.CSSProperties;
};

function OpeningTimesPicker(props: OpeningTimesPickerProps) {
  // Props
  const { style, editModePayload, onBusinessDaysChanged } = props;

  // Refs
  const inEditModeRef = useRef<boolean>(false);
  const selectedBusinessDay = useRef<WithStringId<BusinessDay>>();

  // State
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [openingTimes, setOpeningTimes] = useState<WithStringId<BusinessDay>[]>([]);

  // Hooks
  useEffect(() => {
    if (!editModePayload) return;

    setOpeningTimes(
      editModePayload.map((openingTime) => ({
        ...openingTime,
        _id: uuidv4(),
      })),
    );
  }, [editModePayload]);

  // Event Handlers
  const handleTimeSpanClicked = (id: string): void => {
    const foundOpeningTime = openingTimes.find((openingTime) => openingTime._id === id);

    if (!foundOpeningTime) return;

    // Update side-effect modal refs
    inEditModeRef.current = true;
    selectedBusinessDay.current = foundOpeningTime;

    // Open dialog in edit mode
    setDialogOpen(true);
  };

  const handleAddTimeSpanClick = (): void => {
    setDialogOpen(true);
  };

  const handleDialogClosed = (): void => {
    inEditModeRef.current = false;

    setDialogOpen(false);
  };

  const handleDialogSaved = (dayResult: WithStringId<BusinessDay>): void => {
    if (inEditModeRef.current === true) {
      // Remove element with id
      const filteredOpeningTimes = openingTimes.filter((openingTime) => openingTime._id !== dayResult._id);
      const newOpeningTimes = [...filteredOpeningTimes, dayResult];

      setOpeningTimes(newOpeningTimes);
      onBusinessDaysChanged(newOpeningTimes);

      setDialogOpen(false);
    } else {
      const newOpeningTimes = [...openingTimes, dayResult];

      setOpeningTimes(newOpeningTimes);
      onBusinessDaysChanged(newOpeningTimes);

      setDialogOpen(false);
    }

    inEditModeRef.current = false;
  };

  const handleDialogDeleted = (id: string): void => {
    if (!(inEditModeRef.current === true)) return;

    // Remove element with id
    const filteredOpeningTimes = openingTimes.filter((openingTime) => openingTime._id !== id);

    setOpeningTimes(filteredOpeningTimes);
    onBusinessDaysChanged(filteredOpeningTimes);

    setDialogOpen(false);
    inEditModeRef.current = false;
  };

  // Functions
  const computeSpans = (businessDay: WithStringId<BusinessDay>): JSX.Element[] => {
    const spans: JSX.Element[] = [];

    // Sort numerical
    const sortedDays = businessDay.days.sort((a, b) => a - b);

    // Find sub-sequent number spans
    let cachedStart = sortedDays[0];

    for (let i = 0; i < sortedDays.length; i += 1) {
      const current = sortedDays[i];
      const next = sortedDays[i + 1];

      // Check if subsequent sequence ended
      if (current + 1 !== next) {
        const uniqueKey = `${businessDay._id}_${i}`;

        spans.push(
          <OpeningTimesPickerSpan
            key={uniqueKey}
            fromDay={cachedStart}
            toDay={current}
            businessDay={businessDay}
            onClick={handleTimeSpanClicked}
            style={{ order: cachedStart }}
          />,
        );

        cachedStart = next;
      }
    }

    return spans;
  };

  const getDaysFromOpeningTimes = (): Day[] => {
    const days: Day[] = [];

    openingTimes.forEach((openingTime) => {
      days.push(...openingTime.days);
    });

    return days;
  };

  return (
    <>
      <Stack spacing={1} alignItems="start">
        <Button variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />} onClick={handleAddTimeSpanClick}>
          Zeitspanne hinzufügen
        </Button>

        <div className="bb-ot-picker" style={style}>
          <div className="bb-ot-picker__display">
            <div className="bb-ot-picker__display__item">Mo</div>
            <div className="bb-ot-picker__display__item">Di</div>
            <div className="bb-ot-picker__display__item">Mi</div>
            <div className="bb-ot-picker__display__item">Do</div>
            <div className="bb-ot-picker__display__item">Fr</div>
            <div className="bb-ot-picker__display__item">Sa</div>
            <div className="bb-ot-picker__display__item">So</div>
          </div>

          <div className="bb-ot-picker__interaction">
            {openingTimes.map((openingTime) => computeSpans(openingTime))}
          </div>
        </div>
      </Stack>

      <OpeningTimesDialog
        open={dialogOpen}
        editMode={inEditModeRef.current}
        editModePayload={selectedBusinessDay.current}
        onClose={handleDialogClosed}
        onSave={handleDialogSaved}
        onDelete={handleDialogDeleted}
        disabledDays={getDaysFromOpeningTimes()}
      />
    </>
  );
}

export default OpeningTimesPicker;
