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
    <div>
      <h1>Operation Successful</h1>
      <p>You will be redirected shortly</p>
    </div>
  );
};

export default Confirmation;
