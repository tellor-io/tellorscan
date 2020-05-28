import React, { useState } from 'react';
import styled from 'styled-components';

import { GET_ALL_DISPUTES } from 'utils/queries';
import GraphFetch from 'components/shared/GraphFetch';
import AllDisputes from 'components/disputes/AllDIsputes';
import OpenDisputes from 'components/disputes/OpenDisputes';

const StyledContainer = styled.div`
  // display: flex;
  // align-items: center;
  // flex-direction: column;
  width: calc(100%);
  max-width: 1200px;
  position: relative;
  margin: 0 auto;
  padding-bottom: 75px;
`;

const Disputes = () => {
  const [disputes, setDisputes] = useState();

  return (
    <StyledContainer>
      <GraphFetch query={GET_ALL_DISPUTES} setRecords={setDisputes} />
      {disputes ? (
        <>
          <OpenDisputes disputes={disputes.disputes} />
          <AllDisputes disputes={disputes.disputes} />
        </>
      ) : null}
    </StyledContainer>
  );
};

export default Disputes;
