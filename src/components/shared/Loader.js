import React from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';
import animationData from '../../assets/Tellor__Loader.json';

const LoadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
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
      <Lottie options={defaultOptions} height={120} width={120} />
    </LoadingDiv>
  );
};

export default Loader;
