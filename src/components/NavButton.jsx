import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavButton = ({ item }) => {
  const location = useLocation();
  
  const handleClick = () => {
    // Find the scroll viewport and scroll to top
    // const scrollViewport = document.querySelector('.scroll-viewport');
    // if (scrollViewport) {
    //   scrollViewport.scrollTo({ top: 0, behavior: 'auto' });
    // }
  };
  
  const getBadgeClass = () => {
    if (!item.badge) return 'badge';
    const badgeLower = item.badge.toLowerCase();
    if (badgeLower.includes('experimental')) {
      return 'badge badge-warning';
    }
    if (badgeLower.includes('beta')) {
      return 'badge badge-beta';
    }
    return 'badge badge-default';
  };

  return (
    <Link
      key={item.id}
      to={item.path}
      className={`navbar-item ${location.pathname === item.path ? 'active' : ''}`}
      onClick={handleClick}
    >
      {item.label}
      {item.badge && <span className={getBadgeClass()}>{item.badge}</span>}
    </Link>
  );
};

export default NavButton;
