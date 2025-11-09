import React from 'react';
import situLogo from '../assets/SITU.svg';
import AuthButtons from './AuthButtons';

const MainHeader = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <img src={situLogo} alt="SITU" width="52" />
          </div>
          <div className="version-badge">1.0.9-open-beta</div>
        </div>
        <div className="header-right">
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
