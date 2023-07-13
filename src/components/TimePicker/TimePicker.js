import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

const TimePicker = (props) => {
  const [selectedTime, setSelectedTime] = useState("Select time");

  const handleTimeChange = (event) => {
    if (event.target.value !== "Select time") {
      setSelectedTime(event.target.value);
    }
  };

  useEffect(() => {
    if (props.value) {
      setSelectedTime(convert24HourTo12HourFormat(props.value));
    }
  }, [props.value]);
  useEffect(() => {
    convertTimeTo24HourFormat(selectedTime);
  }, [selectedTime]);

  const convert24HourTo12HourFormat = (time) => {
    if (time) {
      const hourMinuteArray = time.split(":");
      const hour = parseInt(hourMinuteArray[0]);
      const minute = parseInt(hourMinuteArray[1]);

      let formattedHour = "";
      let formattedMinute = minute.toString().padStart(2, "0");
      let amPm = "";

      if (hour === 0) {
        formattedHour = "12";
        amPm = "AM";
      } else if (hour < 12) {
        formattedHour = hour.toString().padStart(2, "0");
        amPm = "AM";
      } else if (hour === 12) {
        formattedHour = "12";
        amPm = "PM";
      } else {
        formattedHour = (hour - 12).toString().padStart(2, "0");
        amPm = "PM";
      }

      return `${formattedHour}:${formattedMinute} ${amPm}`;
    }
  };
  const convertTimeTo24HourFormat = (time) => {
    if (time) {
      const timeArray = time.split(" ");
      const hourMinuteArray = timeArray[0].split(":");
      const hour = parseInt(hourMinuteArray[0]);
      const minute = parseInt(hourMinuteArray[1]);

      let formattedHour = hour.toString().padStart(2, "0");
      let formattedMinute = minute.toString().padStart(2, "0");

      if (timeArray[1] === "PM" && hour !== 12) {
        formattedHour = (hour + 12).toString().padStart(2, "0");
      } else if (timeArray[1] === "AM" && hour === 12) {
        formattedHour = "00";
      }

      const formattedTime = `${formattedHour}:${formattedMinute}`;
      props.onChange(formattedTime);
    }
  };

  const timeOptions = [
    "12:00 AM",
    "12:15 AM",
    "12:30 AM",
    "12:45 AM",
    "01:00 AM",
    "01:15 AM",
    "01:30 AM",
    "01:45 AM",
    "02:00 AM",
    "02:15 AM",
    "02:30 AM",
    "02:45 AM",
    "03:00 AM",
    "03:15 AM",
    "03:30 AM",
    "03:45 AM",
    "04:00 AM",
    "04:15 AM",
    "04:30 AM",
    "04:45 AM",
    "05:00 AM",
    "05:15 AM",
    "05:30 AM",
    "05:45 AM",
    "06:00 AM",
    "06:15 AM",
    "06:30 AM",
    "06:45 AM",
    "07:00 AM",
    "07:15 AM",
    "07:30 AM",
    "07:45 AM",
    "08:00 AM",
    "08:15 AM",
    "08:30 AM",
    "08:45 AM",
    "09:00 AM",
    "09:15 AM",
    "09:30 AM",
    "09:45 AM",
    "10:00 AM",
    "10:15 AM",
    "10:30 AM",
    "10:45 AM",
    "11:00 AM",
    "11:15 AM",
    "11:30 AM",
    "11:45 AM",
    "12:00 PM",
    "12:15 PM",
    "12:30 PM",
    "12:45 PM",
    "01:00 PM",
    "01:15 PM",
    "01:30 PM",
    "01:45 PM",
    "02:00 PM",
    "02:15 PM",
    "02:30 PM",
    "02:45 PM",
    "03:00 PM",
    "03:15 PM",
    "03:30 PM",
    "03:45 PM",
    "04:00 PM",
    "04:15 PM",
    "04:30 PM",
    "04:45 PM",
    "05:00 PM",
    "05:15 PM",
    "05:30 PM",
    "05:45 PM",
    "06:00 PM",
    "06:15 PM",
    "06:30 PM",
    "06:45 PM",
    "07:00 PM",
    "07:15 PM",
    "07:30 PM",
    "07:45 PM",
    "08:00 PM",
    "08:15 PM",
    "08:30 PM",
    "08:45 PM",
    "09:00 PM",
    "09:15 PM",
    "09:30 PM",
    "09:45 PM",
    "10:00 PM",
    "10:15 PM",
    "10:30 PM",
    "10:45 PM",
    "11:00 PM",
    "11:15 PM",
    "11:30 PM",
    "11:45PM",
  ];

  return (
    <Form.Group style={{ marginBottom: 24 }}>
      {/*<Form.Label>{props.label}</Form.Label>*/}
      <InputGroup className=" shadow-none">
        <Form.Control
          as="select"
          value={selectedTime}
          onChange={handleTimeChange}
          style={{ minWidth: "120px", outline: 0 }}
          className="shadow-none"
        >
          <option>Select time</option>
          {timeOptions.map((timeOption) => (
            <option key={timeOption}>{timeOption}</option>
          ))}
        </Form.Control>
      </InputGroup>
    </Form.Group>
  );
};

export default TimePicker;
