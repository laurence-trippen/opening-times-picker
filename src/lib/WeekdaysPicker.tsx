// Packages
import { Checkbox, FormControlLabel, Stack, styled } from '@mui/material';
import { useEffect, useState } from 'react';

// Modules
import { Day } from './types/Day.type';
import { DayEnum } from './types/Day.enum';

// Types
type WeekdaysPickerProps = {
  disabled?: boolean;
  disabledDays: Day[];
  checkedDays?: Day[];
  onDaysChanged: (days: number[]) => void;
};

type WeekdayState = {
  [key: number]: {
    label: string;
    checked: boolean;
    disabled?: boolean;
  };
};

// Styled
const DayCheckbox = styled(Checkbox)({
  padding: 0,
});

function WeekdaysPicker(props: WeekdaysPickerProps) {
  // Props
  const { onDaysChanged, disabled: globalDisabled, disabledDays, checkedDays } = props;

  // State
  const [weekdays, setWeekdays] = useState<WeekdayState>({
    [DayEnum.MONDAY]: { checked: false, label: 'Mo' },
    [DayEnum.TUESDAY]: { checked: false, label: 'Di' },
    [DayEnum.WEDNESDAY]: { checked: false, label: 'Mi' },
    [DayEnum.THURSDAY]: { checked: false, label: 'Do' },
    [DayEnum.FRIDAY]: { checked: false, label: 'Fr' },
    [DayEnum.SATURDAY]: { checked: false, label: 'Sa' },
    [DayEnum.SUNDAY]: { checked: false, label: 'So' },
  });

  // Set disabled days
  useEffect(() => {
    const weekdaysCopy = { ...weekdays };

    disabledDays.forEach((disabledDay) => {
      weekdaysCopy[disabledDay].disabled = true;
    });

    setWeekdays(weekdaysCopy);
  }, [disabledDays]);

  // Set checked days
  useEffect(() => {
    const weekdaysCopy = { ...weekdays };

    checkedDays?.forEach((checkedDay) => {
      weekdaysCopy[checkedDay].checked = true;
    });

    setWeekdays(weekdaysCopy);
  }, [checkedDays]);

  // Event Handlers
  const handleDayChanged = (event: React.ChangeEvent<HTMLInputElement>, day: number) => {
    const { checked } = event.target;
    const { label } = weekdays[day];

    const newWeekdays: WeekdayState = {
      ...weekdays,
      [day]: { checked, label },
    };

    setWeekdays(newWeekdays);

    const daysChanged = Object.keys(newWeekdays)
      .filter((weekayKey) => {
        const { checked } = newWeekdays[Number(weekayKey)];

        return checked;
      })
      .map((dayString) => Number(dayString));

    onDaysChanged(daysChanged);
  };

  return (
    <Stack direction="row">
      {Object.keys(weekdays).map((weekayKey) => {
        const { checked, label, disabled: localDisabled } = weekdays[Number(weekayKey)];

        return (
          <FormControlLabel
            key={weekayKey}
            control={
              <DayCheckbox
                size="small"
                disabled={globalDisabled || localDisabled}
                checked={checked}
                onChange={(e) => handleDayChanged(e, Number(weekayKey))}
              />
            }
            label={label}
            labelPlacement="top"
          />
        );
      })}
    </Stack>
  );
}

export default WeekdaysPicker;
