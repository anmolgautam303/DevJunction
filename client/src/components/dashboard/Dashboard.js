import React , { useEffect } from 'react';
import { connect } from 'react-redux';

import { deleteAccount, getCurrentProfile } from '../../actions/Profile';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
  deleteAccount,
}) => {
  useEffect(() => {
    const getCurrentProfileData = async () => {
      await getCurrentProfile();
    };

    getCurrentProfileData()
  }, [getCurrentProfile]);

  return loading && profile === null ? <Spinner /> : (
    <>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user">Welcome {user && user.name}</i>
      </p>
      {profile !== null ? (
        <>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </>
      ): (
        <>
          <p>You have not yet setup a profile, please add your info</p>
          <Link to="/create-profile" className="btn btn-primary my-1" >
            Create Profile
          </Link>
        </>
      )}
    </>
  )
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
});

const mapDispatchToProps = ({
  getCurrentProfile,
  deleteAccount,
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
