// Packages
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Modules
import { WithStringId } from './types/WithStringId.type';
import { BusinessDay } from './types/BusinessDay.type';
import { Day } from './types/Day.type';
import { TimeRange } from './types/TimeRange.type';
import WeekdaysPicker from './WeekdaysPicker';
import TimeRangePicker from './TimeRangePicker';

// Types
type OpeningTimesDialogProps = {
  open: boolean;
  editMode: boolean;
  editModePayload?: WithStringId<BusinessDay>;
  disabledDays: Day[];
  onClose: () => void;
  onSave: (businessDay: WithStringId<BusinessDay>) => void;
  onDelete: (id: string) => void;
};

function OpeningTimesDialog(props: OpeningTimesDialogProps) {
  // Props
  const { open, editMode, editModePayload, disabledDays, onClose, onSave, onDelete } = props;

  // State
  const [dayClosed, setDayClosed] = useState<boolean>(true);
  const [timeRanges, setTimeRanges] = useState<WithStringId<TimeRange>[]>([]);
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    // Legit Edit Mode check
    // TODO: Optimize if-check
    const isEditMode = editModePayload && editMode === true;
    const closed = isEditMode === true ? editModePayload!.closed : true;
    const ranges = isEditMode === true ? editModePayload!.timeRanges : [];
    const days = isEditMode === true ? editModePayload!.days : [];

    setDayClosed(closed);

    setTimeRanges(
      ranges.map((range) => ({
        ...range,
        _id: uuidv4(),
      })),
    );

    setDays(days);
  }, [editMode]);

  // Functions
  const resetState = (): void => {
    setDayClosed(true);
    setTimeRanges([]);
    setDays([]);
  };

  // Event Handlers
  const handleClosedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDayClosed(event.target.checked);
  };

  const handleAddTimeRangeClick = (): void => {
    setTimeRanges([
      ...timeRanges,
      {
        _id: uuidv4(),
      },
    ]);
  };

  const handleRemoveTimeRangeClick = (id: string): void => {
    setTimeRanges(timeRanges.filter((timeRange) => timeRange._id !== id));
  };

  const handleDaysChanged = (days: number[]): void => {
    setDays(days as Day[]);
  };

  const handleSave = (): void => {
    const id = editModePayload && editMode === true ? editModePayload._id : uuidv4();

    const businessDay: WithStringId<BusinessDay> = {
      _id: id,
      closed: dayClosed,
      timeRanges: timeRanges,
      days: days,
    };

    resetState();
    onSave(businessDay);
  };

  const handleClose = (): void => {
    resetState();
    onClose();
  };

  const handleDelete = (): void => {
    if (!(editModePayload && editMode === true)) return;

    resetState();
    onDelete(editModePayload._id);
  };

  const handleTimeRangeChanged = (changedTimeRange: WithStringId<TimeRange>): void => {
    // It is important to map and update the state to keep the correct order!
    const updatedTimeRanges = timeRanges.map((timeRange) => {
      if (timeRange._id === changedTimeRange._id) {
        return {
          ...changedTimeRange,
        };
      }

      return timeRange;
    });

    setTimeRanges(updatedTimeRanges);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Öffnungszeiten</DialogTitle>
      <DialogContent sx={{ maxWidth: '440px' }}>
        <WeekdaysPicker
          onDaysChanged={handleDaysChanged}
          disabled={editModePayload && editMode === true}
          disabledDays={disabledDays}
          checkedDays={editModePayload && editMode === true ? editModePayload.days : undefined}
        />

        <FormGroup sx={{ marginTop: '1rem' }}>
          <FormControlLabel
            control={<Switch checked={dayClosed} onChange={handleClosedChange} />}
            label="Geschlossen"
          />
        </FormGroup>

        <div hidden={dayClosed}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="primary" sx={{ margin: '1rem 0' }}>
              Zeiten
            </Typography>

            <Button variant="outlined" size="small" onClick={handleAddTimeRangeClick}>
              Zeit-Spanne hinzufügen
            </Button>
          </Stack>

          <Stack spacing={2} sx={{ maxHeight: '220px', overflowY: 'scroll', padding: '0.4rem 0' }}>
            {timeRanges.length === 0 ? (
              <Typography variant="subtitle2" color="gray">
                Keine Zeiten hinterlegt.
              </Typography>
            ) : (
              timeRanges.map((timeRange) => (
                <TimeRangePicker
                  key={timeRange._id}
                  timeRange={timeRange}
                  onChanged={handleTimeRangeChanged}
                  onDelete={handleRemoveTimeRangeClick}
                />
              ))
            )}
          </Stack>
        </div>
      </DialogContent>
      <DialogActions>
        {editMode === true ? (
          <Button onClick={handleDelete} color="error" size="small">
            Löschen
          </Button>
        ) : null}

        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={handleSave} disabled={days.length === 0}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OpeningTimesDialog;
