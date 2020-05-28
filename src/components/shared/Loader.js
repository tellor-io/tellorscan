import React from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';
import animationData from '../../assets/Tellor__Loader.json';

const LoadingDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  svg {
    width: 200px;
    height: 200px;
  }
`;

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <LoadingDiv>
      <Lottie options={defaultOptions} height={150} width={150} />
    </LoadingDiv>
  );
};

export default Loader;
