import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.label`
  font-size: 36px;
  color: white;
`;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Home = () => {
  return (
    <StyledContainer>
      <StyledHeader>HOME</StyledHeader>
    </StyledContainer>
  );
};

export default Home;
