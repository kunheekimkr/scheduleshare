"use client";

import React, { useState, useEffect } from "react";

import { EditorPropsTypes, CalendarValue } from "../utils/types";
import { parseDate } from "../utils/parseDate";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar.css";
import TimeSelect from "./TimeSelect";

/**
 * handle calendar component
 */
export default function Scheduler(props: EditorPropsTypes) {
  const { content, actions, presences } = props;
  const [date, onChange] = useState<CalendarValue>(new Date());
  const currentDate = date ? parseDate(new Date(date.toString())) : "";
  const [selectedBlocks, setSelectedBlocks] = useState<boolean[]>(
    Array(48).fill(false)
  );

  useEffect(() => {
    let flag = false;
    content.forEach((item) => {
      if (item.date === currentDate) {
        flag = !flag;
        return 0;
      }
    });
    if (flag) {
      setSelectedBlocks(
        content
          .find((item) => item.date === currentDate)!
          .selectedBlocks.slice()
      );
    } else {
      actions.addContent(currentDate, Array(48).fill(false));
    }
  }, [date, content]);
  return (
    <div className="flex  p-4">
      <article className="flex items-center justify-evenly w-full">
        <Calendar
          onChange={onChange}
          value={date}
          locale="en-EN"
          showNeighboringMonth={false}
          formatDay={(locale, date) =>
            date.toLocaleString("en", { day: "numeric" })
          }
          tileClassName={({ date }) =>
            content.find(
              (item) =>
                item.date === parseDate(date) &&
                item.selectedBlocks.includes(true)
            )
              ? "highlight"
              : ""
          }
        />
        <div className="items-center">
          <TimeSelect
            selectedBlocks={selectedBlocks}
            setSelectedBlocks={setSelectedBlocks}
            actions={actions}
            date={currentDate}
          />
        </div>
      </article>
    </div>
  );
}
