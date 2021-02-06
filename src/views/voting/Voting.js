import React, { useState } from 'react';

import { GET_VOTING } from 'utils/queries';
import GraphFetch from 'components/shared/GraphFetch';
import AllVoting from 'components/voting/AllVoting';

const Voting = () => {
    const [votes, setVotes] = useState();
    return (
        <>
            <GraphFetch
                query={GET_VOTING}
                setRecords={setVotes}
                suppressLoading={true}
            />
            {votes ? (
                <>
                    <div className="View">
                        <AllVoting votes={votes.disputes} />
                    </div>
                </>
            ) : null}
        </>
    );
};

export default Voting;
