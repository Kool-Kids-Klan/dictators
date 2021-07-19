import React from 'react';
import { useRecoilState } from 'recoil';
import { appState } from '../../store/atoms';
import MainMenu from '../MainMenu/MainMenu';

const Home = () => {
  const [{ authenticated }] = useRecoilState(appState);

  return (
    <div className="Home">
      <div className="lander">
        <header className="lander__header">Dictators</header>
        <span className="lander__moto">Gather troops, conquer enemy land... be the last one standing!</span>
        {!authenticated && <span className="lander__info">Please login or register</span>}
      </div>
      {authenticated && <MainMenu />}
    </div>
  );
};

export default Home;
