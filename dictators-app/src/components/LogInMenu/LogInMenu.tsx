import React from 'react';

interface ILogInMenu {
  logIn: () => void;
}

const LogInMenu: React.FC<ILogInMenu> = (props) => {
  const { logIn } = props;

  return (
    <div className="menu">
      <button type="button" onClick={logIn}>Log In</button>
      <button type="button">Sign In</button>
    </div>
  );
};

export default LogInMenu;
