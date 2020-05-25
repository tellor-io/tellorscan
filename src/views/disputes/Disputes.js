import React, { useState } from 'react';
import styled from 'styled-components';

import { GET_ALL_DISPUTES } from 'utils/queries';
import GraphFetch from 'components/shared/GraphFetch';
import AllDisputes from 'components/disputes/AllDIsputes';
import OpenDisputes from 'components/disputes/OpenDisputes';

const StyledContainer = styled.div`
  display: flex;
  align-items: left;
  flex-direction: column;
  padding: 50px;
`;

const Disputes = () => {
  const [disputes, setDisputes] = useState();
  //TODO: Really get open disputes

  return (
    <StyledContainer>
      <GraphFetch query={GET_ALL_DISPUTES} setRecords={setDisputes} />
      {disputes ? (
        <>
          <OpenDisputes disputes={[disputes.disputes[0]]} />
          <AllDisputes disputes={disputes.disputes} />
        </>
      ) : null}
    </StyledContainer>
  );
};

export default Disputes;
