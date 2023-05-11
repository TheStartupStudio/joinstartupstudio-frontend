import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

const TimePicker = (props) => {
  const [selectedTime, setSelectedTime] = useState("12:00 AM");

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
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
  };
  const convertTimeTo24HourFormat = (time) => {
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
  };

  const timeOptions = [];
  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      let timeString =
        hour.toString().padStart(2, "0") +
        ":" +
        minute.toString().padStart(2, "0");
      if (hour === 0) {
        timeOptions.push("00:" + minute.toString().padStart(2, "0") + " AM");
      } else if (hour >= 1 && hour <= 11) {
        timeOptions.push(timeString + " AM");
      } else if (hour === 12) {
        timeOptions.push("12:" + minute.toString().padStart(2, "0") + " PM");
      } else {
        timeOptions.push(
          (hour - 12).toString().padStart(2, "0") +
            ":" +
            minute.toString().padStart(2, "0") +
            " PM"
        );
      }
    }
  }

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
          {timeOptions.map((timeOption) => (
            <option key={timeOption}>{timeOption}</option>
          ))}
        </Form.Control>
      </InputGroup>
    </Form.Group>
  );
};

export default TimePicker;
