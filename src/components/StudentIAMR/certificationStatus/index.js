import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import { useParams } from "react-router-dom";
import "./index.css";
import LoadingAnimation from "../loadingAnimation";
import { showErrors } from "../../../utils/helpers";

const CertificationStatus = () => {
  const [loading, setLoading] = useState(true);
  const [certificationStatus, setCertificationStatus] = useState();
  const [hasAccess, setHasAccess] = useState(false);

  const { studentId, id } = useParams();

  const certificationType =
    id == 1
      ? "student-certification-1"
      : id == 2
      ? "student-certification-2"
      : "";

  const { status, unCompletedSkills, unApprovedSkills } =
    certificationStatus || {};

  useEffect(() => {
    if (id == 1 || id == 2) {
      getCertificationStatus();
      setLoading(true);
      hasAccessHandler();
      return;
    }
    setLoading(false);
  }, [id]);

  const getCertificationStatus = async () => {
    if (!certificationType) {
      setLoading(false);
      return;
    }

    await axiosInstance
      .get(
        `/instructor/iamr/students/certification-status/${studentId}/${certificationType}`
      )
      .then(({ data }) => {
        setCertificationStatus(data);
      })
      .catch((e) => showErrors(e));
    setLoading(false);
  };

  const hasAccessHandler = async () => {
    await axiosInstance
      .get("/studentsInstructorss/has-access")
      .then((data) => setHasAccess(data.data.allow));
  };

  const certificationStatusHandler = async (status) => {
    await axiosInstance
      .patch(`/iamr/certifications/status/${studentId}/${certificationType}`, {
        status: status,
      })
      .then((data) => console.log("data", data));
  };

  return (
    <>
      <div className="certification-status">
        {loading ? (
          <LoadingAnimation show={loading} />
        ) : !certificationType ? (
          <p className="title text-danger">Invalid certification type</p>
        ) : (
          <>
            <p className="title">Certification {id} Skills</p>
            {!status && unCompletedSkills?.length > 0 ? (
              <>
                <p>
                  Student is still developing certian skills and will need to
                  update their proof to earn certification:
                </p>
                {certificationStatus.unCompletedSkills.map((skill) => (
                  <p className="text-danger" key={skill}>
                    {skill}
                  </p>
                ))}
              </>
            ) : (
              unApprovedSkills?.length > 0 && (
                <>
                  <p>
                    The student still has unapproved skills and will need to
                    update their proof to earn certification:
                  </p>
                  {certificationStatus.unApprovedSkills.map((skill) => (
                    <p className="text-danger" key={skill}>
                      {skill}
                    </p>
                  ))}
                </>
              )
            )}
            {hasAccess &&
            (!unCompletedSkills || unCompletedSkills?.length === 0) &&
            (!unApprovedSkills || unApprovedSkills?.length === 0) ? (
              <button
                className="lts-button float-end mt-2 me-sm-3"
                style={{ background: "#99cc33" }}
                onClick={() => certificationStatusHandler("approved")}
                disabled={status === "approved"}
                //  onClick={() => setShowConfirmUploadModal(true)}
                //  disabled={upload.approved_by_instructor}
              >
                {status === "pending" ? "Certify" : "CERTIFICATED"}
              </button>
            ) : status && status === "pending" ? (
              <p> Student has a pending certification request! </p>
            ) : (
              status === "approved" && (
                <p> Student`s certification has been approved!</p>
              )
            )}

            {!status &&
              unCompletedSkills?.length === 0 &&
              unApprovedSkills?.length === 0 && (
                <div className="completed-certification">
                  <p>
                    It is time for student to submit their proof of skills to
                    The Startup Studio to earn the Market-Ready Certification{" "}
                    {id}:{" "}
                    <span style={{ color: "#333d3d", fontWeight: 500 }}>
                      Competitive Entry Level Employability
                    </span>
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </>
  );
};

export default CertificationStatus;
