import React, { useEffect, useState } from "react";
import { DropdownButton, Modal } from "react-bootstrap";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEventStart,
  getEventsStart,
  getPeriodsStart,
  postEventStart,
} from "../../redux/dashboard/Actions";
import TaskEventModal from "./taskEventModal";
import { changeSidebarState } from "../../redux";
import { DeleteConfirmation } from "../Portfolio/Confirm_modal";
import DeleteEventModal from "./DeleteEventModal";

const CalendarModal = (props) => {
  const [taskEventModal, setTaskEventModal] = useState(false);
  const [deleteEventModal, setDeleteEventModal] = useState(false);
  const periods = useSelector((state) => state.dashboard.periods);
  const openTaskEventModal = () => {
    setTaskEventModal(true);
  };
  const closeTaskEventModal = () => {
    setTaskEventModal(false);
  };

  const openDeleteTaskEventModal = () => {
    setDeleteEventModal(true);
  };
  const closeDeleteTaskEventModal = () => {
    setDeleteEventModal(false);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPeriodsStart());
  }, []);

  const onDeleteEvent = () => {
    return dispatch(deleteEventStart(props.event?.id));
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
          <h3 className="mb-0 pt-4 mt-2 ">
            {/*<IntlMessages id="calendar_task-events.add_a_new_task/event" />*/}
            Event
          </h3>
          <button
            type="button"
            className="btn-close me-1"
            aria-label="Close"
            onClick={props.onHide}
          />
        </Modal.Header>
        <Modal.Body className="mt-4 mb-3 mx-4 add-new-note">
          <div className="row w-100 m-0 mb-4">{props.event?.name}</div>
          <div className="row px-2 add-new-note">{props.event?.date}</div>
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
            onClick={openDeleteTaskEventModal}
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
      />
      <DeleteEventModal
        show={deleteEventModal}
        onHide={closeDeleteTaskEventModal}
        onDelete={onDeleteEvent}
      />
    </>
  );
};
export default CalendarModal;
