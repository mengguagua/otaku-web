// 动画效果菜单，适用于门户，博客，个人网站
import React, {useEffect, useState} from "react";
import "./index.scss";
import {useNavigate} from "react-router-dom";

function AnimateMenu() {
  const navigate = useNavigate();

  let goLink = () => {
    navigate('/otaku/home');
  }

  return(
    <div>
      <nav className="menu">
        <input type="checkbox" href="#" className="menu-open" name="menu-open" id="menu-open"/>
        <label className="menu-open-button" htmlFor="menu-open">
          <span className="hamburger hamburger-1"></span>
          <span className="hamburger hamburger-2"></span>
          <span className="hamburger hamburger-3"></span>
        </label>
        <a className="menu-item div-center" onClick={goLink}>
          <div className={'poke-ball'}/>
        </a>
        <a className="menu-item div-center">
          <div className={'emojione-monotone--rice-ball'}/>
        </a>
        <a className="menu-item div-center">
          <div className={'fluent-emoji-high-contrast--alien-monster'}/>
        </a>
        <a className="menu-item div-center">
          <div className={'codicon--book'}/>
        </a>
        <a className="menu-item div-center">
          <div className={'ph--rainbow-cloud-bold'}/>
        </a>
      </nav>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="shadowed-goo">

            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"/>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                           result="goo"/>
            <feGaussianBlur in="goo" stdDeviation="3" result="shadow"/>
            <feColorMatrix in="shadow" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2"
                           result="shadow"/>
            <feOffset in="shadow" dx="1" dy="1" result="shadow"/>
            <feBlend in2="shadow" in="goo" result="goo"/>
            <feBlend in2="goo" in="SourceGraphic" result="mix"/>
          </filter>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"/>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                           result="goo"/>
            <feBlend in2="goo" in="SourceGraphic" result="mix"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default AnimateMenu;
