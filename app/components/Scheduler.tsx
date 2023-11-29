"use client";

import React, { useState } from "react";

import { EditorPropsTypes, CalendarValue } from "../utils/types";
import { parseDate } from "../utils/parseDate";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

/**
 * handle calendar component
 */
export default function Scheduler(props: EditorPropsTypes) {
  const { content, actions } = props;
  const [date, onChange] = useState<CalendarValue>(new Date());

  const currentDate = date ? parseDate(new Date(date.toString())) : "";

  return (
    <article>
      <div>
        <div className="flex items-center justify-center">
          <Calendar
            onChange={onChange}
            value={date}
            locale="en-EN"
            showNeighboringMonth={false}
            formatDay={(locale, date) =>
              date.toLocaleString("en", { day: "numeric" })
            }
            tileClassName={({ date }) =>
              content.find((item) => item.date === parseDate(date))
                ? "highlight"
                : ""
            }
          />
        </div>
        <p>selected day : {currentDate}</p>
        <div>
          {content.map((item, i: number) => {
            if (item.date === currentDate) {
              return <p key={i}>{item.text}</p>;
            }
          })}
        </div>
      </div>
    </article>
  );
}
