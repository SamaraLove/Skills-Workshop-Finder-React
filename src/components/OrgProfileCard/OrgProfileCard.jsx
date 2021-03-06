import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventCard from "../EventCard/EventCard";
import "./OrgProfileCard.css";
import logo from "../../Spinner.svg";

const OrgProfileCard = (props) => {
  const [orgDataProfile, setOrgDataProfile] = useState({});
  let user = window.localStorage.getItem("username");
  const [isBusy, setBusy] = useState(true);
  const [eventsHosted, setEventsHosted] = useState([]);

  const fetchOrg = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}users/org/${user}/profile/`
    );
    if (response.ok) {
      const data = await response.json();
      if (data) {
        setOrgDataProfile(data);
        // setBusy(false);
      }
      return;
    }
    const data = await response.json();
  };

  const fetchOrgEvents = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}events/${user}/events-hosted/`
    );
    if (response.ok) {
      const data = await response.json();
      if (data) {
        setEventsHosted(data);
        setBusy(false);
      }
      return;
    }
    const data = await response.json();
  };

  useEffect(() => {
    fetchOrg();
    fetchOrgEvents();
  }, []);

  const org_profile = {
    is_org: props.props.is_org,
    username: props.props.username,
    email: props.props.email,
    company_name: orgDataProfile.company_name,
    contact_name: orgDataProfile.contact_name,
    org_bio: orgDataProfile.org_bio,
    //   "https://cdn.shecodes.com.au/wp-content/uploads/2018/10/SheCodes-01.png",
    org_image: orgDataProfile.org_image,
  };

  function IsOwnerCanEdit() {
    // if (username != null) {
    if (user === org_profile.username) {
      return (
        <div id="owner-links">
          <Link to={`/profile/${user}/edit`}>
            <p>Edit</p>
          </Link>
          <Link to={`/profile/${user}/delete`}>
            <p>Delete</p>
          </Link>
        </div>
      );
    } else {
      return <p></p>;
    }
  }
  // }

  return (
    <>
      {isBusy ? (
        <img id="spinner-img" src={logo} alt="loading..." />
      ) : (
        <>
          <div id="profile-exist">
            {(org_profile.company_name === null ||
              org_profile.company_name === undefined) &&
            // (org_profile.org_image === null || org_profile.org_image === undefined)&&
            (org_profile.org_bio === null ||
              org_profile.org_bio === undefined) &&
            (org_profile.contact_name === null ||
              org_profile.contact_name === undefined) ? (
              <div>
                <h2>{org_profile.username}</h2>
                <h2>There is no profile set up for this company </h2>
                {user === org_profile.username ? (
                  <>
                    <p>Tell us about the company</p>
                    <IsOwnerCanEdit />
                    <br></br>
                    <p>Email: {org_profile.email}</p>
                  </>
                ) : (
                  <p></p>
                )}
              </div>
            ) : (
              <>
                <div id="o-profile-sections-1-2">
                  <div id="o-profile-section-1">
                    <div id="o-profile-left">
                      <IsOwnerCanEdit />
                      <h3>{org_profile.username}</h3>
                      <h5>Contact person: {org_profile.contact_name}</h5>
                      <h5>{org_profile.email}</h5>
                    </div>
                    <div id="o-profile-right">
                      <img
                        id="o-profile-image"
                        src={org_profile.org_image}
                        alt={org_profile.name}
                      />
                    </div>
                  </div>
                  <div id="o-profile-section-2">
                    <h1>{org_profile.company_name}</h1>

                    <h3>Bio</h3>
                    <p>{org_profile.org_bio}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
      <div id="m-profile-section-3">
        <h3>Events hosted</h3>
        <div className="event-grid">
          {eventsHosted.map((eventData, key) => {
            return <EventCard key={key} eventData={eventData} />;
          })}
        </div>
      </div>
    </>
  );
};

export default OrgProfileCard;
