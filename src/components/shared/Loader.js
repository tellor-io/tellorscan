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
      <LoadingOutlined />
    </LoadingDiv>
  );
};

export default Loader;
