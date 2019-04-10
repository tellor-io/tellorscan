import {connect} from 'react-redux';
import Activity from './Activity';
import {withRouter} from 'react-router-dom';
import {default as searchOps} from 'Redux/search/operations';

const s2p = (state,own) => {
  let id = own.match.params['apiID'];
  let search = state.search;
  let res = search.results;

  if(res.data.metadata.id-0 !== id-0) {
    console.log("No good on metadata");
    //needs to be initialized
    return {
      needsSearch: true,
      total: 0,
      metadata: {},
      events: []
    }
  };

  let sorting = search.sort || [
    {
      id: 'blockNumber',
      desc: true
    }
  ];

  return {
    needsSearch: false,
    sorting,
    page: res.data.page,
    pageSize: search.pageSize,
    loading: search.loading,
    total: res.total,
    metadata: res.data.metadata,
    events: res.data.events
  }
}

const d2p = (dispatch,own) => {
  return {
    doSearch: () => {
      let id = own.match.params['apiID'];
      if(!id) {
        return;
      }
      dispatch(searchOps.search({id}))
    },

    nextPage: () => {

    },

    setPageSize: size => {

    },

    setSort: sort => {

    }
  }
}

export default withRouter(connect(s2p, d2p)(Activity));
