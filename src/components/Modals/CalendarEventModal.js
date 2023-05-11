import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCalendarDeleteEventModal,
  closeEditTaskModal,
  deleteEventStart,
  getPeriodsStart,
  openCalendarDeleteEventModal,
  openEditTaskModal,
} from "../../redux/dashboard/Actions";
import TaskEventModal from "./TaskEventModal";
import DeleteEventModal from "./DeleteEventModal";
import IntlMessages from "../../utils/IntlMessages";
import { FormattedMessage } from "react-intl";

const CalendarModal = (props) => {
  const taskEventModal = useSelector(
    (state) => state.dashboard.editTaskEventModal
  );
  const openTaskEventModal = () => {
    dispatch(openEditTaskModal());
  };

  const closeTaskEventModal = () => {
    dispatch(closeEditTaskModal());
  };

  const calendarDeleteEventModal = useSelector(
    (state) => state.dashboard.calendarDeleteEventModal
  );
  const openDeleteEventModal = () => {
    dispatch(openCalendarDeleteEventModal());
  };

  const closeDeleteEventModal = () => {
    dispatch(closeCalendarDeleteEventModal());
  };
  const periods = useSelector((state) => state.dashboard.periods);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPeriodsStart());
  }, []);

  const onDeleteEvent = () => {
    return dispatch(deleteEventStart(props.event?.id));
  };

  const Event = (props) => {
    return (
      <div style={{ marginBottom: 4 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              backgroundColor: props.type == "event" ? "#ff3399" : "#a7ca42",
              marginRight: 10,
            }}
          ></div>
          <FormattedMessage id={`calendar_task-events.${props.title}`} />
        </div>
        <div
          style={{ marginLeft: 26 }}
          dangerouslySetInnerHTML={{ __html: props.eventInfo }}
        />
      </div>
    );
  };
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop="static"
        keyboard={false}
        style={{ marginTop: "3.9%" }}
        className="edit-modal general-modal-header"
      >
        <Modal.Header className="add-new-note-title general-modal-header my-auto p-0 mx-4">
          <h3
            className="mb-0 pt-4 mt-2 "
            style={{
              color: props.event?.type === "event" ? "#ff3399" : "#a7ca42",
            }}
          >
            {props.event?.type === "event" ? (
              <IntlMessages id="calendar_task-events.event" />
            ) : (
              <IntlMessages id="calendar_task-events.task" />
            )}
          </h3>
          <button
            type="button"
            className="btn-close me-1"
            aria-label="Close"
            onClick={props.onHide}
          />
        </Modal.Header>
        <Modal.Body className="mt-4 mb-3 mx-4 add-new-note">
          <Event
            eventInfo={props.event?.name}
            type={props.event?.type}
            title={
              props.event?.type === "event" ? "name_of_event" : "name_of_task"
            }
          />
          <Event
            eventInfo={props.event?.startDate}
            type={props.event?.type}
            title={
              props.event?.type === "event"
                ? "start_date_of_event"
                : "start_date_of_task"
            }
          />
          {props.event?.endDate !== "0000-00-00" && (
            <Event
              eventInfo={props.event?.endDate}
              type={props.event?.type}
              title={
                props.event?.type === "event"
                  ? "end_date_of_event"
                  : "end_date_of_task"
              }
            />
          )}
          <Event
            eventInfo={props.event?.startTime}
            type={props.event?.type}
            title={
              props.event?.type === "event"
                ? "start_time_of_event"
                : "start_time_of_task"
            }
          />
          <Event
            eventInfo={props.event?.endTime}
            type={props.event?.type}
            title={
              props.event?.type === "event"
                ? "end_time_of_event"
                : "end_time_of_task"
            }
          />
          <Event
            eventInfo={props.event?.description}
            type={props.event?.type}
            title={
              props.event?.type === "event"
                ? "description_of_event"
                : "description_of_task"
            }
          />
          <Event
            eventInfo={props.event?.requirements}
            type={props.event?.type}
            title={"requirements"}
          />
          <Event
            eventInfo={props.event?.period?.name}
            type={props.event?.type}
            title={"chosen_classes"}
          />
        </Modal.Body>
        <div
          style={{ border: "0px" }}
          className="mt-0 pt-0 border-0 border-none mx-4 pe-1 mb-4"
        >
          <button
            className="float-end m-0 px-md-5 save-button add-new-note-button-text ms-1"
            onClick={openTaskEventModal}
          >
            Edit
          </button>
          <button
            className="float-end m-0 px-md-5 save-button add-new-note-button-text ms-1"
            onClick={openDeleteEventModal}
          >
            Delete
          </button>
        </div>
      </Modal>
      <TaskEventModal
        event={props.event}
        show={taskEventModal}
        onHide={closeTaskEventModal}
        periods={periods}
        onEdit={props.onEdit}
        startDate={null}
      />
      <DeleteEventModal
        show={calendarDeleteEventModal}
        onHide={closeDeleteEventModal}
        onDelete={onDeleteEvent}
      />
    </>
  );
};
export default CalendarModal;
