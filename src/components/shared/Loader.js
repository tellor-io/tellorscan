import React from 'react';
import LoadingOutlined from '@ant-design/icons';
import styled from 'styled-components';

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
  return (
    <LoadingDiv>
      <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
      <lottie-player
        src="https://assets6.lottiefiles.com/packages/lf20_QTYe4e.json"
        background="transparent"
        speed="1"
        style={{ width: '300px', height: '300px' }}
        loop
        controls
        autoplay
      ></lottie-player>
    </LoadingDiv>
  );
};

export default Loader;
