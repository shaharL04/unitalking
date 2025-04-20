import React, { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

const iconMapping = {
  success: <CheckCircleIcon fontSize="inherit" />,
  info: <InfoIcon fontSize="inherit" />,
  warning: <WarningIcon fontSize="inherit" />,
  error: <ErrorIcon fontSize="inherit" />,
};

function Alerts({ alerts }) {
  const [alertsArr, setAlertsArr] = useState([]);

  useEffect(() => {
    setAlertsArr(alerts); 
  }, [alerts]);

  return (
    <div>
      {alertsArr.map((alert, index) => (
        <Alert 
          key={index} 
          severity={alert.type} 
          icon={iconMapping[alert.type]} 
          style={{ marginBottom: '10px' }}
        >
          {alert.message}
        </Alert>
      ))}
    </div>
  );
}

export default Alerts;
