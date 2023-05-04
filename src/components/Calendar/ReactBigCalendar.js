import React, { useState, useEffect } from 'react';
import {Calendar} from 'react-big-calendar';
import moment from 'moment';
// import CustomToolbar from './toolbar';
import Popup from 'react-popup';
// import Input from './input';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-popup/style.css';

// const localizer = Calendar.momentLocalizer(moment);
//DEMO EVENTS DATA
export const eventData =  [
    {
        id: 1,
        title: 'Board meeting',
        location: 'Dhaka, Bangladesh',
        start: new Date(2018, 9, 4, 9, 0, 0),
        end: new Date(2018, 9, 4, 13, 0, 0)
    },
    {
        id: 2,
        title: 'Team lead meeting',
        location: 'Rajshahi, Bangladesh',
        start: new Date(2018, 9, 15, 9, 0, 0),
        end: new Date(2018, 9, 15, 13, 0, 0)
    },
    {
        id: 3,
        title: 'Coxbazar Tour',
        location: 'Coxbazar, Bangladesh',
        start: new Date(2018, 9, 30, 8, 30, 0),
        end: new Date(2018, 9, 30, 12, 30, 0)
    },
    {
        id: 4,
        title: "JoomShaper's Event",
        location: 'Dhanmondi, Dhaka',
        start: new Date(2018, 10, 2, 8, 30, 0),
        end: new Date(2018, 10, 2, 12, 30, 0)
    }
];

 const BigCalendar = () => {
    // const [events, setEvents] = useState([]);
    //
    // useEffect(() => {
    //     fetchEvents();
    // }, []);
    //
    // const fetchEvents = () => {
    //     // fetch events from backend or local storage and set the events state
    // };
    //
    // const createEvent = (newEvent) => {
    //     // add the new event to the events state
    //     setEvents([...events, newEvent]);
    // };
    //
    // const updateEvent = (updatedEvent) => {
    //     // find the index of the updated event in the events state array and update it
    //     const updatedIndex = events.findIndex(event => event.id === updatedEvent.id);
    //     if (updatedIndex !== -1) {
    //         const updatedEvents = [...events];
    //         updatedEvents[updatedIndex] = updatedEvent;
    //         setEvents(updatedEvents);
    //     }
    // };
    //
    // const deleteEvent = (deletedEventId) => {
    //     // filter out the deleted event from the events state array
    //     const updatedEvents = events.filter(event => event.id !== deletedEventId);
    //     setEvents(updatedEvents);
    // };
    //
    // const renderEventContent = (slotInfo) => {
    //     const date = moment(slotInfo.start).format('MMMM D, YYYY');
    //     return (
    //         <div>
    //             <p>Date: <strong>{date}</strong></p>
    //             <p>Location: {slotInfo.location}</p>
    //         </div>
    //     );
    // }
    //
    // const onSelectEventHandler = (slotInfo) => {
    //     Popup.create({
    //         title: slotInfo.title,
    //         content: renderEventContent(slotInfo),
    //         buttons: {
    //             right: [{
    //                 text: 'Edit',
    //                 className: 'info',
    //                 action: function () {
    //                     Popup.close();
    //                     openPopupForm(slotInfo, 'Update Event');
    //                 }.bind(this)
    //             }, {
    //                 text: 'Delete',
    //                 className: 'danger',
    //                 action: function () {
    //                     deleteEvent(slotInfo.id);
    //                     Popup.close();
    //                 }.bind(this)
    //             }]
    //         }
    //     });
    // }
    //
    // const onSelectEventSlotHandler = (slotInfo) => {
    //     openPopupForm(slotInfo);
    // }
    //
    // const openPopupForm = (slotInfo) => {
    //     let newEvent = false;
    //     let popupTitle = "Update Event";
    //     if (!slotInfo.hasOwnProperty('id')) {
    //         slotInfo.id = moment().format('x');
    //         slotInfo.title = null;
    //         slotInfo.location = null;
    //         popupTitle = "Create Event";
    //         newEvent = true;
    //     }
    //
    //     let titleChange = function (value) {
    //         slotInfo.title = value;
    //     };
    //     let locationChange = function (value) {
    //         slotInfo.location = value;
    //     };
    //
    //     Popup.create({
    //         title: popupTitle,
    //         content: <div>
    //             {/*<Input onChange={titleChange} placeholder="Event Title" defaultValue={slotInfo.title}/>*/}
    //             {/*<Input onChange={locationChange} placeholder="Event Location" defaultValue={slotInfo.location}/>*/}
    //         </div>,
    //         buttons: {
    //             left: ['cancel'],
    //             right: [{
    //                 text: 'Save',
    //                 className: 'success',
    //                 action: function () {
    //                     if (newEvent) {
    //                         // props.createEvent(slotInfo);
    //                     } else {
    //                         // props.updateEvent(slotInfo);
    //                     }
    //                     Popup.close();
    //                 }
    //             }]
    //         }
    //     });
    // }
    //
    // const eventStyleGetter = (event, start, end, isSelected) => {
    //     let current_time = moment().format('YYYY MM DD');
    //     let event_time = moment(event.start).format('YYYY MM DD');
    //     let background = (current_time > event_time) ? '#DE6987' : '#8CBD4C';
    //     return {
    //         style: {
    //             backgroundColor: background
    //         }
    //     };
    // }

  return  <div className="calendar-container">
        <Calendar
            popup
            selectable
            // localizer={localizer}
            // defaultView={Calendar.Views.MONTH}
            // components={{toolbar: CustomToolbar}}
            views={['month']}
            style={{height: 600}}
            events={eventData}
            // eventPropGetter={(event, start, end, isSelected) => eventStyleGetter(event, start, end, isSelected)}
            // onSelectEvent={(slotInfo) => onSelectEventHandler(slotInfo)}
            // onSelectSlot={(slotInfo) => onSelectEventSlotHandler(slotInfo)}
        />
        <Popup/>
    </div>
}

export default BigCalendar
