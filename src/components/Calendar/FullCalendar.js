import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import "./index.css";
import "react-tippy/dist/tippy.css";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import CalendarEventModal from "../Modals/CalendarEventModal";
import { useDispatch } from "react-redux";
import {
  changeEventDateStart,
  editEventStart,
  getEventsStart,
  getPeriodsStart,
} from "../../redux/dashboard/Actions";

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, "");

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: "All-day event",
    start: todayStr,
  },
  {
    id: createEventId(),
    title: "All-day event2",
    start: todayStr,
  },
  {
    id: createEventId(),
    title: "All-day event3",
    start: todayStr,
  },
  {
    id: createEventId(),
    title: "All-day event4",
    start: todayStr,
  },
];

export function createEventId() {
  return String(eventGuid++);
}

const FullCalendarComponent = (props) => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const dispatch = useDispatch();

  const handleShowEventModal = () => {
    setShowEventModal(true);
  };

  const handleHideEventModal = () => {
    setShowEventModal(false);
  };

  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  const renderEventContent = (eventInfo) => {
    const backgroundColor = () => {
      if (eventInfo.event.extendedProps.type == "event") {
        return "green";
      } else if (eventInfo.event.extendedProps.type == "task") {
        return "blue";
      }
    };

    return (
      <div
        style={{
          backgroundColor: backgroundColor(),
        }}
      >
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };

  const [events, setEvents] = useState([]);
  useEffect(() => {
    const convertedEvents = props.events?.map((event) => {
      const start = moment(event.startDate).toDate();
      const end = moment(event.startDate).add(2, "hours").toDate();
      const className = event.type === "task" ? "event-task" : "event-event";
      const title = event.name;
      const id = event.id;

      return {
        id,
        start,
        end,
        className,
        title,
      };
    });
    console.log(convertedEvents);
    setEvents(convertedEvents);
  }, [props.events]);

  // useEffect(() => {
  //   const newEvents = [
  //     {
  //       className: "event-event",
  //       title: "Event 1",
  //       start: moment().toDate(),
  //       end: moment().add(2, "hours").toDate(),
  //     },
  //     {
  //       className: "event-task",
  //       title: "Event 2",
  //       start: moment().add(1, "day").toDate(),
  //       end: moment().add(1, "day").add(2, "hours").toDate(),
  //     },
  //     {
  //       className: "event-event",
  //       title: "Event 3",
  //       start: moment().add(1, "day").toDate(),
  //       end: moment().add(1, "day").add(3, "hours").toDate(),
  //     },
  //     {
  //       className: "event-event",
  //       title: "Event 4",
  //       start: moment().add(1, "day").toDate(),
  //       end: moment().add(1, "day").add(4, "hours").toDate(),
  //     },
  //     {
  //       className: "event-event",
  //       title: "Event 5",
  //       start: moment().add(1, "day").toDate(),
  //       end: moment().add(1, "day").add(2, "hours").toDate(),
  //     },
  //   ];
  //   debugger;
  //   setEvents(newEvents);
  // }, []);

  const [foundedEvent, setFoundedEvent] = useState(null);

  const foundEvent = (event) => {
    return props.events?.find((ev) => ev?.id == +event.event?.id);
  };
  const handleEventClick = (event) => {
    const eventFounded = foundEvent(event);
    setFoundedEvent(eventFounded);
    handleShowEventModal();
  };

  const ISOtoUSDateFormat = (date) => {
    const dateObj = new Date(date);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = dateObj
      .toLocaleDateString("en-US", options)
      .replace(/\//g, "-");
    return formattedDate;
  };
  const handleChangeDate = (event) => {
    const formattedDate = ISOtoUSDateFormat(event.event.start);
    const eventFounded = foundEvent(event);
    dispatch(changeEventDateStart(formattedDate, { eventId: eventFounded.id }));
  };
  const handleMouseEnter = (arg) => {
    tippy(arg.el, {
      content: arg.event.title,
    });
  };
  return (
    <>
      <FullCalendar
        dayCellClassNames={"fc-cell-custom"}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={2}
        weekends={weekendsVisible}
        events={events}
        headerToolbar={{
          left: "title",
          center: "",
          right: "prev,next",
        }}
        initialEvents={currentEvents}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={(event) => handleEventClick(event)}
        eventsSet={handleEvents}
        eventMouseEnter={handleMouseEnter}
        eventAdd={function () {}}
        eventChange={handleChangeDate}
        eventRemove={function () {}}
        duration={{ weeks: 4 }}
        moreLinkContent={(n) => (
          <div
            style={{
              backgroundColor: "#1ea1f1",
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              color: "#fff",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 6,
            }}
          >
            +{n.num}
          </div>
        )}
        moreLinkClassNames={"more-link"}
      />
      <CalendarEventModal
        show={showEventModal}
        onHide={handleHideEventModal}
        event={foundedEvent}
        onEdit={(event) => dispatch(editEventStart(event))}
      />
    </>
  );
};

export default FullCalendarComponent;
