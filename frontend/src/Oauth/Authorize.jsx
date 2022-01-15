import React, { useEffect, useState } from 'react';
import useRouter from '@/_hooks/use-router';
import { authenticationService } from '@/_services';
import { Redirect } from 'react-router-dom';
import Configs from './Configs/Config.json';

export function Authorize() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const errorMessage = router.query.error_description || router.query.error;

    if (errorMessage) {
      return setError(errorMessage);
    }

    if (!(router.query.origin && Configs[router.query.origin])) {
      return setError('Login failed');
    }

    const configs = Configs[router.query.origin];

    authenticationService
      .signInViaOAuth({ token: router.query[configs.tokenParam], origin: router.query.origin })
      .then(() => setSuccess(true))
      .catch(() => setError('Github login failed'));
    // Disabled for useEffect not being called for updation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-tight auth-main px-lg-4">
      <div className="horizontal-line"></div>
      <div className="row">
        <div className="col-4 sso-ico d-flex">
          <div>
            <img
              src={`/assets/images/sso-buttons/${Configs[router.query.origin] ? router.query.origin : 'unknown'}.svg`}
            />
          </div>
        </div>
        <div className="col-4 text-center">
          <svg className="button" expanded="true">
            <circle cx="50%" cy="50%" r="35%" stroke="#8f8f8f" strokeWidth="10%" fill="#ffffff" />
            <circle className="innerCircle" cx="50%" cy="50%" r="25%" fill="#8f8f8f">
              <animate attributeName="r" begin="0s" dur="1s" repeatCount="indefinite" from="5%" to="25%" />
            </circle>
          </svg>
        </div>
        <div className="col-4 text-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="#ffffff" />
            <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
            <circle cx="12" cy="11" r="1" />
            <line x1="12" y1="12" x2="12" y2="14.5" />
          </svg>
        </div>
      </div>
      {(success || error) && (
        <Redirect
          to={{
            pathname: '/login',
            state: { errorMessage: success ? '' : error },
          }}
        />
      )}
    </div>
  );
}