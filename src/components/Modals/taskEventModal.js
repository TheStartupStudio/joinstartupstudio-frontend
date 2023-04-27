import React, { useState } from "react";
import { DropdownButton, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import IntlMessages from "../../utils/IntlMessages";
import { FormattedMessage } from "react-intl";
import ReactQuill from "react-quill";
import FoulWords from "../../utils/FoulWords";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DatePicker from "react-datepicker";
import "react-quill/dist/quill.snow.css";

const TaskEventModal = (props) => {
  const [tab, setTab] = useState("task");
  const [startDate, setStartDate] = useState(new Date());

  const initialState = {
    taskName: "",
    taskDate: "",
    taskDescription: "",
    eventName: "",
    eventDate: "",
    eventDescription: "",
    requirements: "",
    chooseClasses: "",
  };
  const [state, setState] = useState(initialState);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const task = {
    taskName: state.taskName,
    taskDate: state.taskDate,
    taskDescription: state.taskDescription,
    requirements: state.requirements,
    chooseClasses: state.chooseClasses,
  };
  const event = {
    eventName: state.eventName,
    eventDate: state.eventDate,
    eventDescription: state.eventDescription,
    requirements: state.requirements,
    chooseClasses: state.chooseClasses,
  };

  console.log(tasks);

  const handleInputChange = (name, value) => {
    setState({ ...state, [name]: value });
  };
  const activeTabStyle = {
    backgroundColor: "#51c7df",
    color: "#fff",
    border: "1px solid #51c7df",
  };

  const inActiveTabStyle = {
    backgroundColor: "#fff",
    color: "#666",
    border: "1px solid #666",
  };
  const toggleTab = (tab) => {
    setTab(tab);
    setState(initialState);
  };

  const onSave = () => {
    tab == "task" && setTasks([...tasks, task]);
    tab == "event" && setEvents([...events, event]);
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],

      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],

      ["clean"],
    ],
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "indent",
    "list",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "formula",
  ];

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      // close={props.closeAddModalSaved}
      backdrop="static"
      keyboard={false}
      style={{ marginTop: "3.9%" }}
      className="edit-modal general-modal-header"
    >
      <Modal.Header className="add-new-note-title general-modal-header my-auto p-0 mx-4">
        <h3 className="mb-0 pt-4 mt-2 ">
          <IntlMessages id="calendar_task-events.add_a_new_task/event" />
        </h3>
        <button
          type="button"
          className="btn-close me-1"
          aria-label="Close"
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className="mt-4 mb-3 mx-4 add-new-note">
        <div className="row w-100 m-0 mb-4">
          <div className="col-md-6">
            <button
              style={tab == "task" ? activeTabStyle : inActiveTabStyle}
              className="btn w-100"
              onClick={() => toggleTab("task")}
            >
              Task
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn w-100"
              style={tab == "event" ? activeTabStyle : inActiveTabStyle}
              onClick={() => toggleTab("event")}
            >
              Event
            </button>
          </div>
        </div>
        <div className="row px-2 add-new-note">
          <div className="col-md-12">
            <label
              htmlFor={tab === "task" ? "taskName" : "eventName"}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <FormattedMessage id={`calendar_task-events.name_of_${tab}`} />
            </label>
            <FormattedMessage id={`calendar_task-events.name_of_${tab}`}>
              {(placeholder) => (
                <input
                  className="my-1 mb-4 py-2 px-2 w-100 rounded-0 bg-light"
                  type="text"
                  name={tab === "task" ? "taskName" : "eventName"}
                  style={{ height: 55 }}
                  placeholder={placeholder}
                  id={tab === "task" ? "taskName" : "eventName"}
                  onChange={(e) =>
                    handleInputChange(
                      tab === "task" ? "taskName" : "eventName",
                      e.target.value
                    )
                  }
                  value={state[tab === "task" ? "taskName" : "eventName"]}
                />
              )}
            </FormattedMessage>
          </div>

          <div className="col-md-12 w-100">
            <label
              htmlFor="date"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <FormattedMessage id={`calendar_task-events.date_of_${tab}`} />
            </label>
            <FormattedMessage id={`calendar_task-events.date_of_${tab}`}>
              {(placeholder) => (
                <input
                  className="my-1 mb-4 py-2 px-2 w-100 rounded-0 bg-light"
                  type="date"
                  name={tab === "task" ? "taskDate" : "eventDate"}
                  style={{ height: 55 }}
                  placeholder={placeholder}
                  id={tab === "task" ? "taskDate" : "eventDate"}
                  pattern="\d{4}-\d{2}-\d{2}"
                  onChange={(e) =>
                    handleInputChange(
                      tab === "task" ? "taskDate" : "eventDate",
                      e.target.value
                    )
                  }
                  value={tab === "task" ? state.taskDate : state.eventDate}
                />
              )}
            </FormattedMessage>
          </div>

          <div className="col-md-12">
            <label
              htmlFor="description"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <FormattedMessage
                id={`calendar_task-events.description_of_${tab}`}
              />
            </label>
            <FormattedMessage id={`calendar_task-events.description_of_${tab}`}>
              {(placeholder) => (
                <ReactQuill
                  theme="snow"
                  name={tab === "task" ? "taskDescription" : "eventDescription"}
                  id={tab === "task" ? "taskDescription" : "eventDescription"}
                  className="my-1 mb-4 py-2 px-0 w-100 rounded-0 scroll-add-new-note-modal"
                  style={{ height: "150px" }}
                  placeholder={placeholder}
                  modules={modules}
                  formats={formats}
                  onChange={(e) =>
                    handleInputChange(
                      tab === "task" ? "taskDescription" : "eventDescription",
                      e
                    )
                  }
                  value={
                    tab === "task"
                      ? state.taskDescription
                      : state.eventDescription
                  }
                />
              )}
            </FormattedMessage>
          </div>

          <div className="col-md-12">
            <label
              htmlFor="requirements"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <FormattedMessage id="calendar_task-events.requirements" />
            </label>
            <FormattedMessage id="calendar_task-events.requirements">
              {(placeholder) => (
                <input
                  className="my-1 mb-4 py-2 px-2 w-100 rounded-0 bg-light"
                  type="text"
                  name="requirements"
                  style={{ height: 55 }}
                  // onChange={handleUserInput}
                  placeholder={placeholder}
                  id="requirements"
                  onChange={(e) =>
                    handleInputChange("requirements", e.target.value)
                  }
                  value={state.requirements}
                />
              )}
            </FormattedMessage>
          </div>
          <div className="col-md-12">
            <label
              htmlFor="chooseClasses"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <FormattedMessage id="calendar_task-events.choose_classes" />
            </label>
            <select
              style={{ outline: "none" }}
              className="form-select form-select-md mb-3 rounded-0 shadow-none"
              onChange={(e) =>
                handleInputChange("chooseClasses", e.target.value)
              }
              value={state.chooseClasses}
              name="chooseClasses"
            >
              <option disabled selected>
                Open this select menu
              </option>
              <option value="class-1">Class One</option>
              <option value="class-2">Class Two</option>
              <option value="class-3">Class Three</option>
            </select>
          </div>

          {/*{foulWords && (*/}
          {/*  <div className="p-2 foul-words-notice">*/}
          {/*    {FoulWords.printMessage(foulWords)}*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      </Modal.Body>
      <div
        style={{ border: "0px" }}
        className="mt-0 pt-0 border-0 border-none mx-4 pe-1 mb-4"
      >
        <button
          className="float-end m-0 px-md-5 save-button add-new-note-button-text ms-1"
          // onClick={handleSubmit}
          onClick={onSave}
        >
          {/*{loading ? "loading" : <IntlMessages id="general.save" />}*/}
          <IntlMessages id="general.save" />
        </button>
      </div>
    </Modal>
  );
};
export default TaskEventModal;
