import {generateCalendarDates} from "./DateUtils.ts";
import {useState} from "react";
import {useI18n} from "../context/i18n/useI18n.tsx";
import {range} from "./NumberUtils.ts";

interface CalendarProps {
  date?: Date | undefined | null;
}

export function Calendar(props: CalendarProps) {
  const { t } = useI18n();
  const [date, setDate] = useState(props.date ?? new Date());
  const dates = generateCalendarDates(
    date.getFullYear(),
    date.getMonth() + 1,
    1,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
  const monthDiffChange = (monthDiff: number) => setDate(new Date(date.setMonth(date.getMonth() + monthDiff)));
  const monthChange = (month: number) => setDate(new Date(date.setMonth(month)));
  const yearChange = (year: number) => setDate(new Date(date.setFullYear(year)));
  const month = date.getMonth();
  const year = date.getFullYear();
  return <div key={"calendar"}>
    <div key={"current"} className={"grid grid-cols-12 gap-2 text-center p-2"}>
      <div key={"m-12"} className={"btn btn-sm btn-ghost"} onClick={() => monthDiffChange(-12)}>-</div>
      <select
        key={`year_${year}`}
        className={"select select-sm col-span-4"}
        onChange={(e) => yearChange(Number(e.target.value))}
        defaultValue={year}
      /*select*/>
        {range(year - 4, year + 4).map(value =>
          <option key={value} value={value}>{value}</option>)}
      </select>
      <div key={"m+12"} className={"btn btn-sm btn-ghost"} onClick={() => monthDiffChange(+12)}>+</div>
      <div key={"m-1"} className={"btn btn-sm btn-ghost"} onClick={() => monthDiffChange(-1)}>-</div>
      <select
        key={`month_${month}`}
        className={"select select-sm col-span-4"}
        onChange={(e) => monthChange(Number(e.target.value))}
        defaultValue={month}
      /*select*/>
        {range(0, 11).map(value =>
          <option key={value} value={value}>{t(`~month.${value}`)}</option>)}
      </select>
      <div key={"m+1"} className={"btn btn-sm btn-ghost"} onClick={() => monthDiffChange(+1)}>+</div>
    </div>
    <div key={`dates_${year}_${month}`} className={"grid grid-cols-7 gap-2 text-center"}>
      <div className={"col-span-7 border-b-2"}></div>
      {dates.filter((d, index) => index < 7).map((d, index) => <div key={`dw_${index}`}>{t(`~dayOfWeek.${d.getDay()}`)}</div>)}
      <div className={"col-span-7 border-b-2"}></div>
      {dates.map((d, index) => <button
        key={index}
        className={`btn ${d.getMonth() !== date.getMonth() ? "btn-ghost opacity-20" : d.getDate() === date.getDate() ? "btn-primary" : "btn-ghost"}`}
        value={d.toISOString()}>{d.getDate()}</button>)
      }
    </div>
  </div>
}