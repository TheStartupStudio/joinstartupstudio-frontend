import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faTv,
  faMapSigns,
  faChild,
} from "@fortawesome/free-solid-svg-icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { setAccordionToggled } from "../../redux";
import IntlMessages from "../../utils/IntlMessages";
import SUSLogo from "../../assets/images/LTS-logo.png";
import sidebarImage from "../../assets/images/side-logo.png";
import sidebarImageES from "../../assets/images/side-logo-es.png";
import SUSLogoStudent from "../../../assets/images/LTS-logo.png";

function Sidebar() {
  const sideBarState = useSelector((state) => state.general.sidebarState);

  const currentLanguage = useSelector((state) => state.lang.locale);

  const dispatch = useDispatch();

  return (
    <nav
      id="sidebar"
      className={`sidebar-area ${sideBarState ? " sidenav active" : ""}`}
    >
      <div className="scroll sidebar-sticky sidebar-scroll">
        <PerfectScrollbar
          option={{ suppressScrollX: true, wheelPropagation: false }}
          className="sidebar-sticky"
        >
          <div className="content">
            <div className="sidebar-header">
              <NavLink to="/dashboard">
                <img src={SUSLogo} alt="logo" />
              </NavLink>
            </div>
            <ul
              className="list-unstyled components sidebar-menu-item"
              id="side-menu-main"
            >
              <li>
                <NavLink
                  onClick={() => dispatch(setAccordionToggled(false))}
                  to={"/dashboard"}
                  className="mt-md-1"
                  activeclassname="sidenav active"
                >
                  <div className="d-flex" style={{ alignItems: "center" }}>
                    <div className="dashboard me-1"></div>
                    <div className="ms-2">
                      <IntlMessages id="navigation.dashboard" />
                    </div>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => dispatch(setAccordionToggled(false))}
                  to="/startup-live"
                  activeclassname="sidenav active"
                >
                  <div className="d-flex" style={{ alignItems: "center" }}>
                    <FontAwesomeIcon
                      className="sidebar-icon me-1"
                      icon={faTv}
                    />
                    <div className="ms-2">
                      <IntlMessages id="navigation.startup_live" />
                    </div>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => dispatch(setAccordionToggled(false))}
                  to="/portfolio"
                  activeclassname="sidenav active"
                >
                  <div className="d-flex" style={{ alignItems: "center" }}>
                    <FontAwesomeIcon
                      className="sidebar-icon me-1 me-4"
                      icon={faIdCard}
                    />
                    <div className="ms-2">PORTFOLIO</div>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/beyond-your-course`}
                  activeclassname="active"
                  onClick={() => dispatch(setAccordionToggled(false))}
                >
                  <div className="d-flex" style={{ alignItems: "center" }}>
                    <FontAwesomeIcon
                      className="sidebar-icon me-1"
                      icon={faMapSigns}
                    />
                    <div className="ms-2">
                      <IntlMessages id="navigation.beyond_your_course" />
                    </div>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/story-in-motion`}
                  activeclassname="sidenav active"
                  onClick={() => dispatch(setAccordionToggled(false))}
                >
                  <div className="d-flex" style={{ alignItems: "center" }}>
                    <FontAwesomeIcon
                      className="sidebar-icon me-1"
                      icon={faChild}
                    />
                    <div className="ms-2">
                      <IntlMessages id="sidebar.story_in_motion" />
                    </div>
                  </div>
                </NavLink>
              </li>
            </ul>
            <div className="sidebar-bottom">
              {currentLanguage === "en" ? (
                <img src={sidebarImage} alt="sidebar" />
              ) : (
                <img src={sidebarImageES} alt="sidebar" />
              )}
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </nav>
  );
}

export default Sidebar;
