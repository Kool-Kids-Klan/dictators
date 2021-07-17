import React from 'react';
import { useRecoilState } from 'recoil';
import { appState } from '../../store/atoms';
import MainMenu from '../MainMenu/MainMenu';
import Logo from '../../resources/images/logo.svg';

const Home = () => {
  const [{ authenticated }] = useRecoilState(appState);

  if (!authenticated) {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Dictators</h1>
          <p className="text-muted">Please login or register</p>
          <img src={Logo} alt="" />
        </div>
      </div>
    );
  }
  return (
    <div className="Home">
      <div className="lander">
        <h1>Dictators</h1>
        <MainMenu />
        <img src={Logo} alt="" />
      </div>
    </div>
  );
};

export default Home;
