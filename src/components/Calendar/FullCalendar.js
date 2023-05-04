import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment';
import {formatDate} from "@fullcalendar/core";
import './index.css'


let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

console.log(todayStr)
export const INITIAL_EVENTS = [
    {
        id: createEventId(),
        title: 'All-day event',
        start: todayStr
    },
    {
        id: createEventId(),
        title: 'All-day event2',
        start: todayStr
    },
    {
        id: createEventId(),
        title: 'All-day event3',
        start: todayStr
    },
    {
        id: createEventId(),
        title: 'All-day event4',
        start: todayStr
    },
]

export function createEventId() {
    return String(eventGuid++)
}

const FullCalendarComponent = (props) => {
    const [weekendsVisible, setWeekendsVisible] = useState(true);
    // const [events,setEvents] = useState(props.events)
    const [currentEvents, setCurrentEvents] = useState([]);
    console.log(currentEvents)

    const formatEvents = (events) => {

        const NEW_EVENTS =events?.map(item => ({
            id: String(item.id),
            title: item.name,
            start: item.date,
            type:item.type
        }));

        return NEW_EVENTS


    }




    useEffect(()=>{
       props.events && setEvents(formatEvents(props.events))
    },[props.events])

    console.log(props.events)
    const handleWeekendsToggle = () => {
        setWeekendsVisible(!weekendsVisible);
    };

    const handleDateSelect = (selectInfo) => {
        let title = prompt('Please enter a new title for your event');
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

    const handleEventClick = (clickInfo) => {
        // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        //     clickInfo.event.remove();
        // }
    };

    const handleEvents = (events) => {
        setCurrentEvents(events);
    };


    const renderEventContent = (eventInfo) => {
        console.log(eventInfo.event.extendedProps.type)

        const backgroundColor = () => {
            if(eventInfo.event.extendedProps.type == 'event') {
                return 'green'
            } else if (eventInfo.event.extendedProps.type == 'task') {
                return 'blue'
            }
        }

        return (
            <div style={{backgroundColor:  backgroundColor(),
                // height: 2
            }}>
                {/*<b>{eventInfo.timeText}</b>*/}
                <i>{eventInfo.event.title}</i>
            </div>
        );
    };

    const renderSidebarEvent = (event) => {
        return (
            <li key={event.id}>
                <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
                <i>{event.title}</i>
            </li>
        );
    };


    const [events, setEvents] = useState([]);

    // useEffect(() => {
    //     setEvents([
    //         {
    //             title: 'Event 1',
    //             start: moment().toDate(),
    //             end: moment().add(2, 'hours').toDate(),
    //         },
    //         {
    //             title: 'Event 2',
    //             start: moment().add(1, 'day').toDate(),
    //             end: moment().add(1, 'day').add(2, 'hours').toDate(),
    //         },
    //         {
    //             title: 'Event 3',
    //             start: moment().add(1, 'day').toDate(),
    //             end: moment().add(1, 'day').add(3, 'hours').toDate(),
    //         },
    //         {
    //             title: 'Event 4',
    //             start: moment().add(1, 'day').toDate(),
    //             end: moment().add(1, 'day').add(4, 'hours').toDate(),
    //         },
    //     ]);
    // }, []);

const    eventContent = (info) => {
        // Determine the event type
        var eventType = info.event.extendedProps.type;

        // Set the background color based on the event type
        var eventBackgroundColor;
        if (eventType === 'task') {
            eventBackgroundColor = 'red';
        } else if (eventType === 'event') {
            eventBackgroundColor = 'green';
        } else {
            eventBackgroundColor = 'blue';
        }

        // Create the HTML for the event
        var eventHtml = '<div class="fc-content">' +
            '<span class="fc-title">' + info.event.title + '</span>' +
            '</div>';

        // Set the background color
        var backgroundColor = eventBackgroundColor;

        // Return the modified HTML
        return {
            html: eventHtml,
            backgroundColor: backgroundColor
        };
    }


    return (
        <FullCalendar
            height={250}

            // eventBackgroundColor={'#000'}
            // eventColor={'#000'}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                // left: 'prev,next today',
                // center: 'title',
                // right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={4}
            weekends={weekendsVisible}
            events={events}
            initialEvents={currentEvents}
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents}
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
/>
);
};

export default FullCalendarComponent;
