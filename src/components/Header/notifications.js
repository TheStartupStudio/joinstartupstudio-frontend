import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import NotificationTypes from "../../utils/notificationTypes";
import { format } from "date-fns";

const Notifications = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  // const [userHasAccess, setUserHasAccess] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  // useEffect(() => {
  //   const hasAccess = async () => {
  //     axiosInstance
  //       .get("/studentsInstructorss/has-access")
  //       .then((response) => {
  //         if (response.data.allow) {
  //           setUserHasAccess(true);
  //         } else {
  //           setUserHasAccess(false);
  //         }
  //       })
  //       .catch((e) => e);
  //   };
  //   hasAccess();
  // }, []);

  const formatDate = (date) => {
    if (!date) return;
    const dateNow = new Date();
    const notificationsDate = new Date(date);

    const dateDifference =
      (dateNow.getTime() - notificationsDate.getTime()) /
      (1000 * 60 * 60 * 24.0);

    if (dateDifference > 6) {
      return format(new Date(date), "MMMM dd, yyyy");
    } else {
      return format(new Date(date), "EEEE h:mmaaaaa'm'");
    }
  };

  const notificationClick = (notification) => {
    setLoading(true);
    axiosInstance
      .patch("/notifications", {
        id: notification.id,
      })
      .then(() => {
        if (!notification.read) {
          props.setUnreadNotifications(props.unreadNotifications - 1);
        }
        notification.read = true;
        props.setShowNotifications(false);
        setLoading(false);
        history.push(notification.url);
      });
  };

  return (
    <div className="notifications-wrapper" ref={props.notificationsRef}>
      <div className="position-relative">
        {loading && (
          <div className="notifications-loader">
            <FontAwesomeIcon
              icon={faSpinner}
              className="notifications-spinner"
              spin
            />
          </div>
        )}
        {props.notifications.length > 0 ? (
          <>
            {props.notifications.map((notification) => {
              // const isCertificationSubmit =
              //   notification.type === "CERTIFICATION_SUBMIT";

              // if (userHasAccess || !isCertificationSubmit) {
              return (
                <React.Fragment key={notification.id}>
                  <a
                    className={`nav-link notification-link px-0 pb-0`}
                    onClick={() => notificationClick(notification)}
                    key={notification.id}
                    style={{
                      color: notification.read ? "rgba(0,0,0,.55)" : "black",
                    }}
                    href
                  >
                    {notification.Sender.name}
                    {NotificationTypes[notification.type]?.value}
                  </a>
                  <span className="notification-date">
                    {formatDate(notification.createdAt)}
                  </span>
                </React.Fragment>
              );
              // } else {
              //   return null;
              // }
            })}
          </>
        ) : (
          <span>You dont have any notifications!</span>
        )}
      </div>
    </div>
  );
};

export default Notifications;
