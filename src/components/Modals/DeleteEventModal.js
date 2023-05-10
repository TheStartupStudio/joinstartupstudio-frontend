import React, { useEffect, useState } from "react";
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
import PeriodSelector from "../PeriodSelector/PeriodSelector";
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

const DeleteEventModal = (props) => {
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
          <div>Are you sure that you want to delete this event?</div>
        </Modal.Body>
        <div
          style={{ border: "0px" }}
          className="mt-0 pt-0 border-0 border-none mx-4 pe-1 mb-4"
        >
          <button
            onClick={props.onDelete}
            className="float-end m-0 px-md-5 save-button add-new-note-button-text ms-1"
          >
            Yes
          </button>
          <button
            onClick={props.onHide}
            className="float-end m-0 px-md-5 save-button add-new-note-button-text ms-1"
          >
            No
          </button>
        </div>
      </Modal>
    </>
  );
};
export default DeleteEventModal;
