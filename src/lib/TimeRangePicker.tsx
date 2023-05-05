// Packages
import { IconButton, Stack, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState, KeyboardEvent } from 'react';
import { useSnackbar } from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';

// Modules
import { WithStringId } from './types/WithStringId.type';
import { TimeRange } from './types/TimeRange.type';


// Types
type TimeRangePickerProps = {
  timeRange: WithStringId<TimeRange>;
  onChanged: (timeRange: WithStringId<TimeRange>) => void;
  onDelete: (id: string) => void;
};

function TimeRangePicker(props: TimeRangePickerProps) {
  // Props
  const { timeRange, onChanged, onDelete } = props;

  // State
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('00:00', 'HH:mm'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs('00:00', 'HH:mm'));

  // Hooks
  const { enqueueSnackbar } = useSnackbar();

  // Side Effects
  useEffect(() => {
    const { from, to } = timeRange;

    if (!from || !to) return;

    const fromDate = dayjs(from, 'HH:mm');
    const toDate = dayjs(to, 'HH:mm');

    if (!fromDate.isValid() || !toDate.isValid()) return;

    setStartDate(fromDate);
    setEndDate(toDate);
  }, [timeRange]);

  // Event Handlers
  // TODO: Handle date changed validation if entered by Keyboard.
  const handleStartDateChanged = (newDate: Dayjs | null): void => {
    if (!newDate) return;

    if (endDate && !newDate.isBefore(endDate)) {
      enqueueSnackbar('Start-Zeit kann nicht nach End-Zeit sein!');
      return;
    }

    setStartDate(newDate);

    if (!endDate || !endDate.isValid()) return;

    onChanged({
      ...timeRange,
      from: newDate.format('HH:mm'),
      to: endDate.format('HH:mm'),
    });
  };

  // TODO: Handle date changed validation if entered by Keyboard.
  const handleEndDateChanged = (newDate: Dayjs | null): void => {
    if (!newDate) return;

    if (startDate && !newDate.isAfter(startDate)) {
      enqueueSnackbar('End-Zeit kann nicht vor Start-Zeit sein!');
      return;
    }

    setEndDate(newDate);

    if (!startDate || !startDate.isValid()) return;

    onChanged({
      ...timeRange,
      from: startDate.format('HH:mm'),
      to: newDate.format('HH:mm'),
    });
  };

  const preventKeyDownInput = (e: KeyboardEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1}>
          <TimePicker
            label="Start Zeit"
            value={startDate}
            onChange={handleStartDateChanged}
            renderInput={(params) => <TextField {...params} size="small" onKeyDown={preventKeyDownInput} />}
          />

          <TimePicker
            label="End Zeit"
            value={endDate}
            onChange={handleEndDateChanged}
            renderInput={(params) => <TextField {...params} size="small" onKeyDown={preventKeyDownInput} />}
          />
        </Stack>

        <IconButton color="error" onClick={() => onDelete(timeRange._id)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </>
  );
}

export default TimeRangePicker;
