"use client";

import React, { useState, useEffect } from "react";

import { EditorPropsTypes, CalendarValue } from "../utils/types";
import { parseDate } from "../utils/parseDate";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TimeSelect from "./TimeSelect";

/**
 * handle calendar component
 */
export default function Scheduler(props: EditorPropsTypes) {
  const { content, actions, presences } = props;
  const [date, onChange] = useState<CalendarValue>(new Date());
  const [userNames, setUserNames] = useState<Array<string>>([]);
  const currentDate = date ? parseDate(new Date(date.toString())) : "";

  useEffect(() => {
    // Check if props.presences is an array
    if (Array.isArray(presences)) {
      // Now you can safely use map
      let transformed = presences.reduce((result, item) => {
        const { clientID, presence } = item;
        const { userName } = presence;
        result[clientID] = userName;
        return result;
      }, {});
      setUserNames(Object.values(transformed));
    }
  }, [presences]);

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
        />
        <div className="items-center">
          <TimeSelect />
        </div>
      </article>
    </div>
  );
}
