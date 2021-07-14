import React from 'react';
import { useRecoilState } from 'recoil';
import { appState } from '../../store/atoms';
import MainMenu from '../MainMenu/MainMenu';

const Home = () => {
  const [{ authenticated }] = useRecoilState(appState);

  if (!authenticated) {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Dictators</h1>
          <p className="text-muted">Please login or register</p>
        </div>
      </div>
    );
  }
  return (
    <div className="Home">
      <div className="lander">
        <h1>Dictators</h1>
        <MainMenu />
      </div>
    </div>
  );
};

export default Home;
