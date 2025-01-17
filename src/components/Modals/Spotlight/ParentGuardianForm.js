import React from "react";
import LTSLogo from "../../../assets/images/LTS-logo-horizontal.png";
import "./styles.css"; 

const ParentGuardianForm = () => {
    return (
        <div className="waiver-container">
            <div className="waiver-content">
                <div className="header-container">
                    <div>
                        <img
                            src={LTSLogo}
                            alt="Learn to Start Logo"
                            className="lts-logo"
                            style={{ width: "300px" }}
                        />
                    </div>
                    <div className="address-container">
                        <p>9100 Conroy Windermere Rd</p>
                        <p>Suite 200-4315</p>
                        <p>Windermere, FL 34786</p>
                    </div>
                </div>
                <hr />
                <div className="section-title">
                    <h5>Parent/Guardian Waiver for Spotlight Pitch Competition</h5>
                </div>
                <p>Participant Information</p>
                <p>
                    Full Name of Participant: ___________________________
                    <br />
                    Age of Participant: ___________________________
                    <br />
                    School/Organization Name: ___________________________
                    <br />
                    Name of Parent/Guardian: ___________________________
                    <br />
                    Relationship to Participant: ___________________________
                    <br />
                    Parent/Guardian Contact Information (Phone/Email): ___________________________
                </p>
                <hr />
                <h4>1. Assumption of Risk</h4>
                <p>
                    I, the undersigned parent/guardian of the participant named above,
                    acknowledge that participation in the virtual pitch competition
                    ("Spotlight") involves certain risks. I understand that Spotlight will
                    be held online, and the participant will be submitting a pitch,
                    engaging in virtual presentations, and possibly interacting with other
                    participants, mentors, and judges. I assume all risks and
                    responsibilities associated with the participant's involvement in
                    Spotlight, including but not limited to any technological issues,
                    internet disruptions, or interactions with others through virtual
                    platforms.
                </p>
                <hr />
                <h4>2. Consent to Participate</h4>
                <p>
                    I give my full consent for the participant to participate in the
                    virtual pitch competition. I understand that Spotlight may include
                    public presentations, and that video, audio, and other materials
                    related to the participant’s pitch may be recorded and shared publicly.
                    I agree that the participant’s submission, pitch, and any related
                    content may be used by the organizers for promotional, educational, or
                    other purposes related to Spotlight.
                </p>
                <hr />
                <h4>3. Privacy and Data Protection</h4>
                <p>
                    I understand that the organizers will make reasonable efforts to
                    protect the privacy of participants. However, by agreeing to
                    participate, I acknowledge that the virtual nature of the event may
                    require sharing some personal information. The participant’s
                    information will be used solely for the purposes of administering the
                    event and will not be shared with third parties without prior consent.
                </p>
                <hr />
                <div className="footer">
                    <p style={{ marginTop: '5px'}}>Learn to Start</p>
                    <p>http://www.learnstart.com</p>
                </div>2
                <h4 style={{marginTop: '70px'}} >4. Media Release</h4>
                <p>
                    I hereby grant Spotlight organizers the right to record, photograph, or
                    otherwise capture the participant’s involvement in Spotlight, including
                    the participant’s image, voice, and performance. I understand that
                    these recordings may be used in social media, press releases, marketing
                    materials, and other promotional content. I waive any right to review
                    or approve such materials before they are published.
                </p>
                <hr />
                <h4>5. Code of Conduct</h4>
                <p>
                    I acknowledge that the participant is expected to comply with all rules
                    and guidelines provided by the organizers of the virtual pitch
                    competition, including maintaining respectful and appropriate conduct
                    during the event. This includes respecting other participants, mentors,
                    and judges. Failure to comply with the code of conduct may result in
                    disqualification from the event at the discretion of the organizers.
                </p>
                <hr />
                <h4>6. Liability Waiver</h4>
                <p>
                    I, the undersigned, waive any and all claims, demands, or causes of
                    action against the organizers, sponsors, and any affiliated individuals
                    or entities arising out of or in connection with the participant’s
                    involvement in the virtual pitch competition, including but not limited
                    to personal injury, property damage, or any other damages. This waiver
                    extends to any claims arising from the use of virtual platforms or any
                    activities associated with the event.
                </p>
                <hr />
                <h4>7. Acknowledgment and Signature</h4>
                <p>
                    By signing below, I confirm that I have read and understood this waiver
                    and the rules and expectations for the virtual pitch competition. I
                    agree to the terms outlined above and give my consent for the
                    participant to participate in the event.
                </p>
                <p>
                    Parent/Guardian Name: ___________________________
                    <br />
                    Parent/Guardian Signature: ___________________________
                    <br />
                    Date: ___________________________
                </p>
                <hr />
                <div className="footer">
                    <p>Learn to Start</p>
                    <p>http://www.learnstart.com</p>
                </div>
            </div>
        </div>
    );
};

export default ParentGuardianForm;
