import React, { useState } from "react";
import "./index.css";
import Dropdown from "../customComponents/dropdown";
import { types } from "./helpers";
import TagOption from "./tagOption";
import Explanation from "./explanation";
import ApproveUploadModal from "./approveUploadModal";
import RejectUploadModal from "./rejectUploadModal";
import ImportedJournal from "./importedJournal";
import UploadLink from "./uploadLink";
import ConfirmUploadModal from "./confirmUploadModal";
import DenyUploadModal from "./denyUploadModal";
import axiosInstance from "../../../utils/AxiosInstance";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Upload = ({ upload, skill, editUpload }) => {
  const [expandedSkillDropdown, setExpandedSkillDropdown] = useState(false);
  const [expandedTypeDropdown, setExpandedTypeDropdown] = useState(false);
  const [showApproveUploadModal, setShowApproveUploadModal] = useState(false);
  const [showRejectUploadModal, setShowRejectUploadModal] = useState(false);
  const [showConfirmUploadModal, setShowConfirmUploadModal] = useState(false);
  const [showDenyUploadModal, setShowDenyUploadModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const isApprovable = upload.status === "submitted";
  console.log("upload", upload);

  useEffect(() => {
    setIsConfirmed(upload.approved_by_instructor);
  }, [upload]);

  // const certificationType =
  //   id == 1
  //     ? "student-certification-1"
  //     : id == 2
  //     ? "student-certification-2"
  //     : null;

  useEffect(() => {
    hasAccessHandler();
  }, []);

  const hasAccessHandler = async () => {
    await axiosInstance
      .get("/studentsInstructorss/has-access")
      .then((data) => setHasAccess(data.data.allow));
  };

  return (
    <>
      <div className="upload my-3">
        <div className="row">
          <div className="col-12 col-md-6 mb-2">
            <span className="page-content-title mb-2">TITLE</span>
            <input
              className="upload-item"
              type="text"
              placeholder="Title"
              name="title"
              value={upload.title}
              readOnly={true}
            />
          </div>
          <div className="col-12 col-md-6 mb-2">
            <span className="page-content-title mb-2">TYPE</span>
            <Dropdown
              title={`${upload.type ? upload.type : "Type"}`}
              expanded={expandedTypeDropdown}
              toggle={setExpandedTypeDropdown}
            >
              <ul className="custom-dropdown-options">
                {types.map((type) => (
                  <li key={type} name="type">
                    {type}
                  </li>
                ))}
              </ul>
            </Dropdown>
          </div>
          {upload.link && <UploadLink link={upload.link} />}

          {upload.imported_journal_entry && (
            <ImportedJournal importedJournal={upload.imported_journal_entry} />
          )}
          <div className="col-12">
            <span className="page-content-title mb-2">SELECTED SKILL TAGS</span>
            <Dropdown
              title={`${skill.title} - SKILL DROP DOWN MENU`}
              expanded={expandedSkillDropdown}
              toggle={setExpandedSkillDropdown}
            >
              <ul className="custom-dropdown-options">
                {skill.SkillTags.map((tag) => (
                  <TagOption
                    tag={tag}
                    key={tag.id}
                    checked={upload?.SelectedTags?.some(
                      (row) => row.id === tag.id
                    )}
                  />
                ))}
              </ul>
            </Dropdown>
          </div>
          {upload?.SelectedTags?.map((tag) => (
            <Explanation key={tag.id} tag={tag} />
          ))}
        </div>
        {isApprovable && (
          <div className="row m-0 my-4">
            <div className="col-12 col-sm-6 m-0 p-0">
              <button
                className="lts-button float-end mt-2 me-sm-3"
                style={{ background: "#99cc33" }}
                onClick={() => setShowApproveUploadModal(true)}
              >
                PROFICIENT
              </button>
            </div>
            <div className="col-12 col-sm-6 m-0 p-0">
              <button
                className="lts-button float-start mt-2 ms-sm-3"
                style={{ background: "#ff3399" }}
                onClick={() => setShowRejectUploadModal(true)}
              >
                DEVELOPING
              </button>
            </div>
          </div>
        )}
        {hasAccess && upload.status === "proficient" && (
          <div className="row m-0 my-4">
            <div className="col-12 col-sm-6 m-0 p-0">
              <button
                className="lts-button float-end mt-2 me-sm-3"
                style={{ background: "#99cc33" }}
                onClick={() => setShowConfirmUploadModal(true)}
                disabled={upload.approved_by_instructor}
              >
                APPROVE
              </button>
            </div>
            <div className="col-12 col-sm-6 m-0 p-0">
              <button
                className="lts-button float-start mt-2 ms-sm-3"
                style={{ background: "#ff3399" }}
                onClick={() => setShowDenyUploadModal(true)}
                // disabled={!upload.approved_by_instructor}
              >
                DENY
              </button>
            </div>
          </div>
        )}
      </div>

      <ApproveUploadModal
        show={showApproveUploadModal}
        upload={upload}
        onHide={() => setShowApproveUploadModal(false)}
        editUpload={editUpload}
      />
      <RejectUploadModal
        show={showRejectUploadModal}
        upload={upload}
        onHide={() => setShowRejectUploadModal(false)}
        editUpload={editUpload}
      />
      <ConfirmUploadModal
        show={showConfirmUploadModal}
        upload={upload}
        onHide={() => setShowConfirmUploadModal(false)}
        editUpload={editUpload}
      />
      <DenyUploadModal
        show={showDenyUploadModal}
        upload={upload}
        onHide={() => setShowDenyUploadModal(false)}
        editUpload={editUpload}
      />
    </>
  );
};

export default Upload;
