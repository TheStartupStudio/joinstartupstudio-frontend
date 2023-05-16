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
import TaskEventModal from "./TaskEventModal";
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
        id="subscription-modal"
      >
        <Modal.Body
          style={{
            borderRadius: 5,
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
        >
          <div className="mt-4 mb-4 blocked-user-modal confirmation-modal px-md-5 text-center">
            <p
              style={{ color: props.type == "task" ? "#A7CA42" : "#FF3399" }}
            >{`Are you sure that you want to delete this ${props.type}`}</p>
            <button
              className="cancel-subscription-button"
              style={{ background: "#51C7DF" }}
              onClick={() => props.onDelete()}
            >
              Yes, delete the {props.type}
            </button>
            <button
              className="cancel-subscription-button mt-2"
              onClick={() => props.onHide()}
              style={{
                color: "#BBBDBF",
                background: "#fff",
                border: "1px solid #BBBDBF",
              }}
            >
              No, don't delete my {props.type}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default DeleteEventModal;
