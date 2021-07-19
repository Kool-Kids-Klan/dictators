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
    <div className="confirmation">
      <header className="confirmation__header">Operation Successful</header>
      <span className="confirmation__info">You will be redirected shortly...</span>
    </div>
  );
};

export default Confirmation;
