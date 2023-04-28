import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import defaultImage from "../../../assets/images/profile-image.png";
import axiosInstance from "../../../utils/AxiosInstance";
import { toast } from "react-toastify";
import "../index.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const EditStudentModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const { user } = useSelector((state) => state.user.user);
  const [newInstructorId, setNewInstructorId] = useState(null);

  const defaultData = {
    name: "",
    email: "",
    user_note: "",
    certificat: false,
    deactivated: false,
  };

  const [data, setData] = useState(defaultData);

  useEffect(() => {
    if (!props?.data) {
      setData(defaultData);
    } else {
      setData(props.data);
    }
    setResetSubmitted(false);
  }, [props.data]);

  const defaultLevels = [
    { label: "LS", value: "LS" },
    { label: "MS", value: "MS" },
    { label: "HS", value: "HS" },
    { label: "HE", value: "HE" },
  ];

  const defaultYears = [
    { label: "LTS1", value: "LTS1" },
    { label: "LTS2", value: "LTS2" },
    { label: "LTS3", value: "LTS3" },
    { label: "LTS4", value: "LTS4" },
  ];

  const handleChange = (e) => {
    const { name, value } = e;
    if (name === "instructor_id") {
      if (props.data.instructor_id !== value) {
        setNewInstructorId(value);
      }

      if (newInstructorId !== null && props.data.instructor_id === value) {
        setNewInstructorId(null);
      }
    } else {
      setData((old) => ({ ...old, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    let newStudentData = data;

    if (newInstructorId) {
      setLoading(true);
      await axiosInstance
        .post("/instructor/transfers", {
          userId: props.data.id,
          toInstructor: newInstructorId,
        })
        .then((transfer) => {
          props.addNewTransferRequest(transfer.data);
          newStudentData.transferHistory[0] = transfer.data;
          toast.success("New transfer request submitted!");
        })
        .catch((e) => toast.error("Transfer failed!"));
      setNewInstructorId(null);
    }

    if (JSON.stringify(props.data) === JSON.stringify(data)) {
      setLoading(false);
      return;
    }

    setLoading(true);

    await axiosInstance
      .put(`/instructor/update-student/${data.id}`, {
        ...data,
      })
      .then(async (response) => {
        props.updateState(data?.id, newStudentData);
        props.setStudentToEdit({});
        props.onHide();
        toast.success("Data was successfully updated!");
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
    setNewInstructorId(null);
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    setResetLoading(true);

    await axiosInstance
      .put(`/instructor/change-student-password/${data.id}`)
      .then(async () => {
        setResetSubmitted(true);
      })
      .catch((err) => {
        toast.error("Something went wrong, please try again!");
      });
    setResetLoading(false);
  };

  return data?.id ? (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      className="edit-profile-modal"
    >
      <Modal.Header className="pb-0 general-modal-header mt-4 mx-4 row position-relative">
        <div className="col-12 col-lg-3 p-0">
          <p className="view-student-title p-0 m-0">VIEW STUDENT</p>
        </div>
        <div className="col-12 col-lg-9 mt-2 pb-2 pe-lg-4">
          <div className="row align-items-end justify-content-end">
            <div className="col-12 col-sm-7 col-lg-5 certification-status d-flex align-items-end justify-content-lg-end p-0">
              <p className="p-0 m-0">CERTIFICATION STATUS</p>
              <span
                style={{ cursor: "pointer", paddingBottom: "3px" }}
                className={`ms-1 ${
                  props.data.certificat ? "statusOk" : "statusFalse"
                }`}
              >
                ●
              </span>
            </div>
            <div className="col-12 col-sm-5 col-lg-5 view-student-portfolio-journals d-flex justify-content-start justify-content-sm-end align-items-end pe-lg-4 p-0">
              <Link
                to={`/user-portfolio/${props.data.username}`}
                className="d-flex"
              >
                <span>Portfolio</span>
              </Link>
              <span
                className="px-1 my-auto fw-normal"
                style={{ color: "#707070" }}
              >
                |
              </span>
              <Link
                to={`/students-journals/${props.data.id}`}
                className="d-flex"
              >
                <span>Journals</span>
              </Link>
              <span
                className="px-1 my-auto fw-normal"
                style={{ color: "#707070" }}
              >
                |
              </span>
              <Link to={`/student-iamr/${props.data.id}`} className="d-flex">
                <span>IAMR</span>
              </Link>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn-close edit-student-close"
          style={{ position: "absolute", top: "0px", right: 0 }}
          aria-label="Close"
          onClick={() => {
            props.onHide();
          }}
        />
        {/* <div className='col-1 px-0'>
          
        </div> */}
      </Modal.Header>
      <Modal.Body className="row px-0 mx-4">
        <div className="col-12 col-lg-2 mb-2 mb-lg-0 pt-2 text-center">
          <img
            src={data.profile_image ? data.profile_image : defaultImage}
            className="border border-1 rounded-circle border border-dark text-center mx-auto"
            width={"101px"}
            height={"101px"}
            alt="#"
          />
        </div>
        <div className="col-12 col-lg-6 pe-lg-4">
          <div className="input-group mb-1">
            <label htmlFor=" w-100">User Name</label>

            <input
              type="text"
              className="form-control w-100"
              name="name"
              // defaultValue={data?.name}
              value={data?.name}
              onChange={(e) =>
                handleChange({ name: "name", value: e.target.value })
              }
            />
          </div>
          <div className="input-group mb-1">
            <label htmlFor="userName w-100">User Email</label>
            <input
              type="text"
              className="form-control w-100"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              // defaultValue={data?.email}
              value={data?.email}
              onChange={(e) =>
                handleChange({ name: "email", value: e.target.value })
              }
              name="UserEmail"
            />
          </div>
          {/* <div className='input-group mb-3'>
            <label htmlFor='userName w-100'>User Chosen Role</label>
            <input
              type='text'
              className='form-control w-100'
              aria-label='Sizing example input'
              aria-describedby='inputGroup-sizing-default'
              disabled
              name='UserChosenRole'
            />
          </div> */}
          <div className="mt-2">
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              // defaultValue={data.user_note}
              value={data?.user_note ? data?.user_note : ""}
              name="user_note"
              onChange={(e) =>
                handleChange({ name: "user_note", value: e.target.value })
              }
              placeholder="Add user notes here..."
              rows="4"
            ></textarea>
          </div>
          <div className="mt-2 reset-student-password d-flex flex-column">
            <button
              className="lts-button reset-button"
              style={{
                background: !resetSubmitted ? "#ea3b97" : "rgb(187, 189, 191)",
                hover: {
                  background: !resetSubmitted
                    ? "#a7ca42"
                    : "rgb(187, 189, 191)",
                },
              }}
              onClick={() => {
                handlePasswordReset();
              }}
              disabled={resetLoading || resetSubmitted}
            >
              {resetLoading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                "RESET PASSWORD"
              )}
            </button>
            {resetSubmitted && (
              <p className="user-id-label mt-1">
                Default password was set to:{" "}
                <span style={{ color: "#01c5d1" }}> Learntostart1! </span>
              </p>
            )}
          </div>
        </div>
        <div className="col-lg-4 col-12">
          <div className="row mx-auto">
            {/* <div className='col-6 px-0'>
              <label htmlFor='userId' className='user-id-label'>
                User ID Number
              </label>
              <input
                type='text'
                className='form-control text-center'
                value={data.id}
                aria-label='Sizing example input'
                aria-describedby='inputGroup-sizing-default'
                disabled
                name='userId'
              />
            </div> */}
            <div className="col-12 px-0 text-center mt-2 mt-lg-0">
              <label htmlFor="unit" className="user-id-label">
                Unit
              </label>
              <Select
                options={props?.school}
                // defaultValue={data?.Instructor?.University?.name}
                name="university"
                placeholder={data?.Instructor?.University?.name}
                // onChange={(newValue) => {
                //   handleChange({
                //     name: 'university',
                //     value: newValue.value,
                //     universityChanged: 'true'
                //   })
                // }}
                isDisabled={true}
                className="my-auto py-auto"
                // styles={customStyles}
              />
            </div>
          </div>
          <div className="row mx-auto">
            <div className="col-6 px-0 text-center">
              <label htmlFor="level" className="user-id-label">
                Level
              </label>
              <Select
                options={defaultLevels}
                // defaultValue={data?.level}
                placeholder={data?.level}
                onChange={(newValue) => {
                  handleChange({
                    name: "level",
                    value: newValue.value,
                  });
                }}
                className="my-auto py-auto"
                // styles={customStyles}
              />
            </div>
            <div className="col-6 px-0 ps-2 text-center">
              <label htmlFor="year" className="user-id-label">
                Year
              </label>
              <Select
                options={defaultYears}
                // defaultValue={data?.year}
                placeholder={data?.year}
                onChange={(newValue) => {
                  handleChange({
                    name: "year",
                    value: newValue.value,
                  });
                }}
                className="my-auto py-auto"
                // styles={customStyles}
              />
            </div>
          </div>
          <div className="row mx-auto">
            <div className="col-12 px-0 text-center">
              <label htmlFor="userId" className="user-id-label">
                Instructor
              </label>
              {data?.transferHistory[0]?.transferTo?.User?.name ? (
                <p
                  className="text-center text-warning p-0 m-0"
                  style={{
                    // color: '#ff894d',
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Pending transfer
                </p>
              ) : (
                <Select
                  options={props?.instructors}
                  // defaultValue={user?.name}
                  placeholder={user?.name}
                  onChange={(newValue) => {
                    handleChange({
                      name: "instructor_id",
                      value: newValue.value,
                    });
                  }}
                  isDisabled={false}
                  className="my-auto py-auto"
                  // styles={customStyles}
                />
              )}
            </div>
          </div>
          <div className="row mx-auto mt-3">
            <div className=" col-12 ms-auto my-auto blunk-activated-div d-flex">
              <p className="my-auto">Activated </p>
              <label className="px-0 ps-sm-1 ps-lg-1 form-switch my-auto d-flex w-100">
                <input
                  type="checkbox"
                  checked={data?.deactivated == true ? false : true}
                  onChange={(e) => {
                    handleChange({
                      name: "deactivated",
                      value: data?.deactivated == true ? false : true,
                    });
                  }}
                />
                <i className="ms-auto"></i>
              </label>
            </div>
          </div>
          <div className="row mx-auto mt-3">
            <button
              className="lts-button w-100"
              onClick={() => {
                handleSubmit();
              }}
              disabled={loading ? true : false}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                "SAVE"
              )}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  ) : null;
};

export default EditStudentModal;
