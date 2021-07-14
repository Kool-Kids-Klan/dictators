import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Confirmation = () => {
  const history = useHistory();

  useEffect(() => {
    const redirect = async () => {
      await new Promise((f) => setTimeout(f, 2000));
      history.push('/');
    };
    redirect();
  });

  return (
    <h1>Operation Successful</h1>
  );
};

export default Confirmation;
