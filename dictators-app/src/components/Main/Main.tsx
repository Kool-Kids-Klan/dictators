import { RecoilRoot, useRecoilState } from 'recoil';
import React from 'react';
import Login from './LogIn/Login';
import { appState } from '../../store/atoms';
import MainMenu from '../MainMenu/MainMenu';
import Register from './LogIn/Register';

const Main = () => {
  const [{ authenticated }] = useRecoilState(appState);

  if (!authenticated) {
    return (
      <div className="Main">
        <Login />
        <Register />
      </div>
    );
  }
  return (
    <div className="Main">
      <MainMenu />
    </div>
  );
};

export default Main;
