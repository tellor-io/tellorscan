(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{1036:function(e,t,a){"use strict";a.r(t);var n=a(98),r=a(6),c=a(7),s=a(14),l=a(9),i=a(15),o=a(2),m=a.n(o),u=a(40),d=a.n(u),p=a(752),g=a(770),f=a(785),b=a(1),h=a(80),E=a(748),N=a(749),v=a(754),j=a(16),x=a(1028),O=a(1034),k=a(764),w=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props,t=e.canVote,a=e.voteReason;return t?m.a.createElement(m.a.Fragment,null,m.a.createElement("i",{className:d()("fa fa-thumbs-up","clickable-icon","text-tellor-green","mr-3"),onClick:this.props.voteUp}),m.a.createElement("i",{className:d()("fa fa-thumbs-down","clickable-icon","text-tellor-green"),onClick:this.props.voteDn})):m.a.createElement("span",{className:d()("text-muted")},a)}}]),t}(m.a.Component),A=a(195),y=Object(n.connect)(function(e,t){var a=t.dispute,n=e.chain.chain.ethereumAccount||"";n=n.toLowerCase();var r=!1,c="no dispute";return a&&(a.userVoted?(r=!1,c="already voted"):a.sender===n?(r=!1,c="dispute owner"):r=!0),{canVote:r,voteReason:c}},function(e,t){return{voteUp:function(){e(A.a.voteUp(t.dispute))},voteDn:function(){e(A.a.voteDown(t.dispute))}}})(w),C=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.dispute,n=t.expanded,r=a.timeRemaining(a);r=Object(k.d)(1e3*r);var c=a.voteCount,s="text-dark",l="",i="",o=n?"fa-caret-up":"fa-caret-down";c>0?(s="text-success",i="fa fa-thumbs-up",l="for disputer"):c<0?(s="text-danger",i="fa fa-thumbs-down",l="against disputer"):(s="text-dark",i="fa fa-ellipsis-h",l="neutral"),c=Math.abs(c);var u=m.a.createElement("div",{className:d()(p.b,s,"font-weight-bold","text-1")},m.a.createElement("i",{className:d()(i,"text-secondary","text-sz-sm","mr-1")}),c," \xa0",m.a.createElement("span",{className:d()(p.e,"text-muted","font-weight-light","text-sz-sm")},l));return m.a.createElement(E.a,{className:d()(p.b,p.c,p.g)},m.a.createElement(N.a,{md:"1",className:d()(p.b,p.g)},m.a.createElement(x.a,{href:"#",onClick:function(){e.props.idClicked&&e.props.idClicked(a.requestId)},className:d()("font-weight-bold","text-1","text-left",p.g)},a.requestId)),m.a.createElement(N.a,{md:"1",className:d()(p.b,p.g)},m.a.createElement("i",{className:d()("fa",o,"text-tellor-green","text-sz-md"),onClick:function(){return e.props.toggleExpansion()}})),m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("p-1","text-center","text-1")},a.targetNonce.winningOrder)),m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("p-1","text-center","text-1")},a.targetNonce.value)),m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("p-1","text-center","text-1")},"about ",r)),m.a.createElement(N.a,{md:"3",className:d()(p.h,p.g)},m.a.createElement(E.a,{className:d()(p.h,p.c,p.g)},m.a.createElement(N.a,{md:"10",className:d()(p.e,p.g)},u))))}}]),t}(m.a.Component),R=[{label:"Query String",value:function(e,t){return e.queryString}},{label:"Mined at",value:function(e,t){return Object(k.c)(t.timestamp)}},{label:"Disputer",value:function(e,t){return t.sender}},{label:"Time Remaining",value:function(e,t){var a=t.timeRemaining(t);return Object(k.a)(1e3*a)}},{label:"Miner",value:function(e,t){return t.miner}}],B=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props,t=e.request,a=e.dispute,n=e.canVote,r=e.voteReason,c=null;return c=n?m.a.createElement(m.a.Fragment,null,m.a.createElement(N.a,{md:"12",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("text-sz-sm","text-center","font-weight-bold","text-dark")},"Agree w/ Disputer?")),m.a.createElement(N.a,{md:"12",className:d()(p.b,p.g)},m.a.createElement(y,{dispute:a}))):m.a.createElement(m.a.Fragment,null,m.a.createElement(N.a,{md:"12",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("text-sz-sm","text-center","font-weight-bold","text-dark")},"Cannot vote")),m.a.createElement(N.a,{md:"12",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("text-muted","text-sz-sm","text-center")},r))),m.a.createElement(E.a,{className:d()(p.e,p.c,p.g)},m.a.createElement(N.a,{md:"10",className:d()(p.i,p.g)},R.map(function(e,n){var r=e.value(t,a);return m.a.createElement(E.a,{key:n,className:d()(p.e,p.c,"p-1",p.g)},m.a.createElement(N.a,{md:"3",className:d()(p.e,p.g)},m.a.createElement("span",{className:d()(p.e,"font-weight-light","text-sz-sm")},e.label)),m.a.createElement(N.a,{md:"9",className:d()(p.e,p.g)},m.a.createElement("span",{className:d()(p.e,"font-weight-bold","text-sz-sm")},r)))})),m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement(E.a,{className:d()(p.i,p.c,p.g)},c)))}}]),t}(m.a.Component),D=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props.expanded;return m.a.createElement(E.a,{className:d()(p.b,p.c,p.g)},m.a.createElement(N.a,{md:"11",className:d()(p.b,p.g)},m.a.createElement(O.a,{isOpen:e,className:d()(p.c,"mt-1","mb-1",p.g)},m.a.createElement(E.a,{className:d()("border","bg-tellor-subtle",p.i,p.c,p.g)},m.a.createElement(N.a,{md:"12",className:d()(p.e,p.g)},m.a.createElement(B,this.props))))))}}]),t}(m.a.Component),I=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(s.a)(this,Object(l.a)(t).call(this,e))).state={expanded:!1},["toggle"].forEach(function(e){return a[e]=a[e].bind(Object(j.a)(Object(j.a)(a)))}),a}return Object(i.a)(t,e),Object(c.a)(t,[{key:"toggle",value:function(){this.setState({expanded:!this.state.expanded})}},{key:"render",value:function(){return m.a.createElement(E.a,{className:d()("open-dispute-row","border-bottom","border-muted","mb-2",p.i,p.c,p.g)},m.a.createElement(N.a,{md:"12",className:d()(p.b,p.g)},m.a.createElement(C,Object.assign({},this.props,{toggleExpansion:this.toggle}))),m.a.createElement(N.a,{md:"12",className:d()(p.b,p.g)},m.a.createElement(D,Object.assign({},this.props,{expanded:this.state.expanded}))))}}]),t}(m.a.Component),S=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return m.a.createElement(E.a,{className:d()(p.b,p.c,"pb-3",p.g)},m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("font-weight-bold","text-1","text-center")},"ID")),m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("font-weight-bold","text-1","text-center")},"Index")),m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("font-weight-bold","text-1","text-center")},"Value")),m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("font-weight-bold","text-1","text-center")},"Time left")),m.a.createElement(N.a,{md:"3",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("font-weight-bold","text-1","text-center")},"Tally")))}}]),t}(m.a.Component),V=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.disputes,n=t.loading;if(!a||0===a.length)return m.a.createElement(E.a,{className:d()("dispute-container",p.i,p.c,p.g)},m.a.createElement(N.a,{md:"12",className:d()("open-disputes-container",p.i,p.g)},m.a.createElement(E.a,{className:d()(p.b,p.c,p.g)},m.a.createElement(N.a,{md:"12",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("pl-4","font-weight-light","text-sz-md","text-dark")},"No open disputes")))));var r=a.map(function(t){return Object(b.a)({},t,{actions:{vote:function(t,a){return e.props.vote(t,a)}}})});return m.a.createElement(E.a,{className:d()("dispute-container",p.i,p.c,p.g)},m.a.createElement(v.a,{loading:n}),m.a.createElement(N.a,{md:"12",className:d()("open-disputes-container",p.i,p.g)},m.a.createElement(E.a,{className:d()(p.e,p.c,"mt-2",p.g)},m.a.createElement(N.a,{md:"12",className:d()(p.i)},m.a.createElement(S,null),r.map(function(t,a){return m.a.createElement(I,{key:a,idClicked:e.props.viewRequestDetails,dispute:t,canVote:t.canVote,voteReason:t.voteReason,request:t.request})})))))}}]),t}(m.a.Component),Q=a(755),F=a(10),T=a.n(F),q=Object(h.f)(Object(n.connect)(function(e,t){var a=e.requests.byId,n=(e.chain.chain||{}).ethereumAccount||"";n=n.toLowerCase();var r=[];return T.a.values(a).forEach(function(t){var a=t.disputes.byId||{};T.a.values(a).forEach(function(a){var c=!0,s=null;e.token.balance<=0&&(c=!1,s="need tokens"),a.userVoted&&(c=!1,s="already voted"),a.sender===n&&(c=!1,s="dispute owner"),r.push(Object(b.a)({},a,{request:t,timeRemaining:A.a.voteTimeRemaining,canVote:c,voteReason:s}))})}),r.sort(function(e,t){return A.a.voteTimeRemaining(e)-A.a.voteTimeRemaining(t)}),{disputes:r,loading:!1}},function(e,t){return{viewRequestDetails:function(e){var a=Q.a+"/"+e;t.history.push(a)}}})(V)),Y=a(30),z=a(782),L=a.n(z),M=a(747),U=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props,t=e.canDispute;return e.hasTokens?t?m.a.createElement(M.a,{size:"sm",className:d()("dispute-button","text-dark","bg-tellor-green"),onClick:this.props.onClick},"Dispute"):m.a.createElement("div",{className:d()(p.b,p.c,p.g)},m.a.createElement("span",{className:d()(p.b,p.g,"bg-secondary","text-light","text-center","text-sz-sm")},"in dispute already")):m.a.createElement(M.a,{size:"sm",className:d()("text-light","text-sz-sm","bg-secondary"),onClick:this.props.getTokens},"Need Tokens")}}]),t}(m.a.Component),H=a(25),G=Object(n.connect)(function(e,t){var a=t.challenge,n=t.nonce,r=null;return a&&n&&a.id&&n.miner&&(r=Object(H.c)({miner:n.miner,requestId:a.id,timestamp:a.finalValue.mineTime})),{canDispute:!(((e.requests.byId[a.id]||{}).disputes||{}).byHash||{})[r]&&"object"===typeof a.finalValue,hasTokens:e.token.balance>0}},function(e,t){return{getTokens:function(){}}})(U),K=[{value:function(e,t){return e&&e.finalValue?Object(k.c)(e.finalValue.mineTime):"unknown"},label:"Finished At"},{value:function(e,t){return t.miner},label:"Miner"},{value:function(e,t){return e.multiplier},label:"Multiplier"},{value:function(e){var t=0;if(!e.finalValue)return"unknown";t=A.a.timeRemaining(e);var a=L.a.duration(1e3*t);return"".concat(a.hours(),"h ").concat(a.minutes(),"m")},label:"Time Remaining"},{value:function(e){return e.queryString},label:"Query String"}],J=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.challenge,n=t.nonce;return m.a.createElement(E.a,{className:d()(p.e,p.c,p.g)},m.a.createElement(N.a,{md:"10",className:d()(p.i,p.g)},K.map(function(e,t){var r=null;return e.field?r=a[e.field]:e.value&&(r=e.value(a,n)),m.a.createElement(E.a,{key:t,className:d()(p.e,p.c,"p-1",p.g)},m.a.createElement(N.a,{md:"3",className:d()(p.e,p.g)},m.a.createElement("span",{className:d()(p.e,"font-weight-light","text-sz-sm")},e.label)),m.a.createElement(N.a,{md:"9",className:d()(p.e,p.g)},m.a.createElement("span",{className:d()(p.e,"font-weight-bold","text-sz-sm")},r)))})),m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement(G,{challenge:a,nonce:n,onClick:function(){e.props.dispute(a,n)}},"Dispute")))}}]),t}(m.a.Component),X=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props,t=e.challenge,a=e.nonce,n=e.expanded;return m.a.createElement(E.a,{className:d()(p.b,p.c,p.g)},m.a.createElement(N.a,{md:"11",className:d()(p.b,p.g)},m.a.createElement(O.a,{isOpen:n,className:d()(p.c,"mt-1","mb-1",p.g)},m.a.createElement(E.a,{className:d()("border","bg-tellor-subtle",p.i,p.c,p.g)},m.a.createElement(N.a,{md:"12",className:d()(p.e,p.g)},m.a.createElement(J,{dispute:this.props.dispute,nonce:a,challenge:t}))))))}}]),t}(m.a.Component),Z=function(e){function t(e){var a;return Object(r.a)(this,t),a=Object(s.a)(this,Object(l.a)(t).call(this,e)),["buildLoadingCols","buildNormalCols"].forEach(function(e){return a[e]=a[e].bind(Object(j.a)(Object(j.a)(a)))}),a}return Object(i.a)(t,e),Object(c.a)(t,[{key:"buildLoadingCols",value:function(e){var t=this;return m.a.createElement(m.a.Fragment,null,m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement(x.a,{href:"#",onClick:function(){t.props.idClicked&&t.props.idClicked(e.id)},className:d()("font-weight-bold","text-1","text-left",p.g)},e.id)),m.a.createElement(N.a,{md:"10",className:d()(p.b,p.c,p.g)},m.a.createElement("i",{className:d()("fa fa-spin fa-spinner","text-sz-md")})))}},{key:"buildNormalCols",value:function(e){var t=this,a=T.a.values(e.nonces)||[];a.sort(function(e,t){return e.winningOrder-t.winningOrder});var n=this.props.expanded?"fa-caret-up":"fa-caret-down";return m.a.createElement(m.a.Fragment,null,m.a.createElement(N.a,{md:"1",className:d()(p.b,p.g)},m.a.createElement(x.a,{href:"#",onClick:function(){t.props.idClicked&&t.props.idClicked(e.id)},className:d()("font-weight-bold","text-1","text-left",p.g)},e.id)),m.a.createElement(N.a,{md:"1",className:d()(p.b,p.g)},m.a.createElement("i",{className:d()("fa",n,"text-tellor-green","text-sz-md"),onClick:function(){return t.props.toggleExpansion(e)}})),a.map(function(a,n){var r=t.props.selectedNonce===a&&t.props.expanded,c=r?"border border-dark":void 0,s=r?"bg-tellor-muted":"";return m.a.createElement(N.a,{key:n,md:"2",className:d()(p.e,p.g)},m.a.createElement("span",{onClick:function(){t.props.selectForDispute(e,a)},className:d()("value-tab","p-1","rounded","text-center","text-1",s,c)},a.value))}))}},{key:"render",value:function(){var e=this.props,t=e.challenge,a=e.expanded,n=!t.finalValue,r=this.props.selectedNonce||{},c=m.a.createElement(X,{dispute:this.props.dispute,challenge:t,nonce:r,expanded:a});return m.a.createElement(E.a,{className:d()("dispute-row","border-bottom","border-muted","mb-2",p.i,p.c,p.g)},m.a.createElement(N.a,{md:"12",className:d()(p.b,p.g)},m.a.createElement(E.a,{className:d()(p.b,p.c,p.g)},(n||!t.nonces||!t.finalValue)&&this.buildLoadingCols(t),!n&&this.buildNormalCols(t))),t.finalValue&&m.a.createElement(N.a,{md:"12",className:d()(p.e,p.g)},c))}}]),t}(m.a.Component),P=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return m.a.createElement(E.a,{className:d()(p.b,p.c,"mb-3",p.g)},m.a.createElement(N.a,{md:"2",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("font-weight-bold","text-1")},"ID")),m.a.createElement(N.a,{md:"10",className:d()(p.b,p.g)},m.a.createElement("span",{className:d()("font-weight-bold","text-1","mr-1")},"Values"),m.a.createElement("span",{className:d()("font-weight-light","text-sz-sm","text-muted")},"click for details")))}}]),t}(m.a.Component),W=function(e){function t(e){var a;return Object(r.a)(this,t),a=Object(s.a)(this,Object(l.a)(t).call(this,e)),["toggleExpansion"].forEach(function(e){return a[e]=a[e].bind(Object(j.a)(Object(j.a)(a)))}),a}return Object(i.a)(t,e),Object(c.a)(t,[{key:"toggleExpansion",value:function(e){this.props.toggleDisputeSelection(e)}},{key:"render",value:function(){var e=this,t=this.props,a=t.expandedHash,n=t.selectedNonce,r=t.challenges,c=t.loading;return m.a.createElement(E.a,{className:d()(p.i,p.c,p.g)},m.a.createElement(v.a,{loading:c}),m.a.createElement(N.a,{md:"12",className:d()("open-disputes-container",p.i,p.g)},m.a.createElement(E.a,{className:d()(p.b,p.c,"mt-2",p.g)},m.a.createElement(N.a,{md:"12",className:d()(p.i)},(!r||0===r.length)&&m.a.createElement("span",{className:d()("pl-4","font-weight-light","text-sz-md","text-dark")},"No disputable values available"),r&&r.length>0&&m.a.createElement(m.a.Fragment,null,m.a.createElement(P,null),r.map(function(t,r){return m.a.createElement(Z,{key:r,challenge:t,dispute:e.props.initiateDispute,expanded:a===t.challengeHash,selectedNonce:n,selectForDispute:e.props.selectForDispute,toggleExpansion:e.toggleExpansion,idClicked:e.props.showDetails})}))))))}}]),t}(m.a.Component),_=Object(h.f)(Object(n.connect)(function(e,t){var a=e.requests.byId,n=t.match.params.apiID,r=T.a.values(a);n&&(r=a[n]?[a[n]]:[]);var c=[];r.forEach(function(e){T.a.keys(e.challenges).forEach(function(t){var a=e.challenges[t];A.a.isDisputable(a)&&c.push(a)})});var s=e.requests.current||{};c.sort(function(e,t){return t.blockNumber-e.blockNumber});var l=T.a.find(c,function(e){return e.challengeHash===s.challengeHash}),i=l>=0?c[l]:null;i&&(c.splice(l,1),c=[i].concat(Object(Y.a)(c)));var o=e.disputes.selectedChallenge||{},m=e.disputes.selectedNonce||{};return{expandedHash:o.challengeHash,selectedNonce:m,challenges:c,loading:e.requests.loading||e.init.loading}},function(e,t){return{showDetails:function(e){var a=Q.a+"/"+e;t.history.push(a)},selectForDispute:function(t,a){e(A.a.selectForDispute(t,a))},toggleDisputeSelection:function(t){e(A.a.toggleDisputeSelection(t))},initiateDispute:function(t,a){console.log("Incoming nonce",a);var n={miner:{index:a.winningOrder,address:a.miner},requestId:t.id,timestamp:t.finalValue.mineTime};e(A.a.initDispute(n))}}})(W)),$=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return m.a.createElement("div",{className:d()("details-container",p.i,p.c,p.g)},m.a.createElement(g.a,{withLogo:!0,title:"Disputes"}),m.a.createElement(f.a,{title:"Filter Disputes",resultHandler:function(t){return e.props.filterDisputes(t?t.id:"")}}),m.a.createElement(E.a,{className:d()(p.b,p.c,"mb-3",p.g)},m.a.createElement(N.a,{md:"5",className:d()("pr-3",p.i,p.g)},m.a.createElement(E.a,{className:d()(p.i,p.c,p.g)},m.a.createElement(N.a,{md:"12",className:d()(p.i,"bg-white",p.g)},m.a.createElement("div",{className:d()("open-header","p-2","bg-tellor-charcoal","text-white",p.e,p.c)},m.a.createElement("span",{className:d()("pl-4","font-weight-bold","text-sz-md","text-light")},"Disputable Values"))),m.a.createElement(N.a,{md:"12",className:d()(p.i,p.g)},m.a.createElement(_,null)))),m.a.createElement(N.a,{md:"5",className:d()(p.i,p.g)},m.a.createElement(E.a,{className:d()(p.i,p.c,p.g)},m.a.createElement(N.a,{md:"12",className:d()(p.i,"bg-white",p.g)},m.a.createElement("div",{className:d()("open-header","p-2","bg-tellor-charcoal","text-white",p.e,p.c)},m.a.createElement("span",{className:d()("pl-4","font-weight-bold","text-sz-md","text-light")},"Open Disputes"))),m.a.createElement(N.a,{md:"12",className:d()(p.i,p.g)},m.a.createElement(q,null))))))}}]),t}(m.a.Component);t.default=Object(h.f)(Object(n.connect)(function(e){return{}},function(e,t){return{filterDisputes:function(e){var a=Q.b+"/"+e;t.history.push(a)}}})($))},752:function(e,t,a){"use strict";a.d(t,"d",function(){return c}),a.d(t,"a",function(){return o}),a.d(t,"f",function(){return p}),a.d(t,"e",function(){return g}),a.d(t,"h",function(){return b}),a.d(t,"b",function(){return h}),a.d(t,"i",function(){return N}),a.d(t,"j",function(){return v}),a.d(t,"g",function(){return O}),a.d(t,"c",function(){return k});var n=a(40),r=a.n(n),c=r()("justify-content-start"),s=r()("justify-content-center"),l=r()("justify-content-end"),i=r()("align-items-start"),o=r()("align-items-center"),m=r()("align-items-end"),u="d-flex",d="flex-row",p=r()(u,d,c,i),g=r()(u,d,c,o),f=r()(u,d,l,m),b=r()(u,d,l,o),h=r()(u,d,s,o),E="flex-column",N=(r()(u,E,p),r()(u,E,f),r()(u,E,c,o)),v=(r()(u,E,c,i),r()(u,E,l,m),r()(u,E,l,o),r()(u,E,s,o)),j=r()("m-0"),x=r()("p-0"),O=r()(j,x),k="w-100"},754:function(e,t,a){"use strict";a.d(t,"a",function(){return d});var n=a(6),r=a(7),c=a(14),s=a(9),l=a(15),i=a(2),o=a.n(i),m=a(40),u=a.n(m),d=function(e){function t(){return Object(n.a)(this,t),Object(c.a)(this,Object(s.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this.props,t=e.loading,a=e.size,n=e.small;if(!t)return null;n&&(a="small");return o.a.createElement("div",{className:u()("loading-overlay",a)},o.a.createElement("i",{className:u()("spinner","fa","fa-spin","fa-spinner",a)}))}}]),t}(o.a.Component)},755:function(e,t,a){"use strict";a.d(t,"c",function(){return n}),a.d(t,"a",function(){return r}),a.d(t,"b",function(){return c}),a.d(t,"e",function(){return s}),a.d(t,"d",function(){return l});var n="/dashboard/main",r="/details/main",c="/disputes/main",s="/settings/main",l="/miner/main"},761:function(e,t,a){"use strict";var n=a(98),r=a(6),c=a(7),s=a(14),l=a(9),i=a(15),o=a(16),m=a(2),u=a.n(m),d=a(748),p=a(749),g=a(40),f=a.n(g),b=a(752),h=a(35),E=a(754),N=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(s.a)(this,Object(l.a)(t).call(this,e))).state={text:""},["keyDown","updateText","doSearch"].forEach(function(e){return a[e]=a[e].bind(Object(o.a)(Object(o.a)(a)))}),a}return Object(i.a)(t,e),Object(c.a)(t,[{key:"keyDown",value:function(e){var t=this;if("Enter"===e.key){var a=this.state.text-0;this.setState({text:""},function(){return t.props.runSearch(a)})}}},{key:"doSearch",value:function(){var e=this,t=this.state.text-0;t?this.setState({text:""},function(){return e.props.runSearch(t)}):h.toastr.error("Error","Invalid api request ID")}},{key:"updateText",value:function(e){this.setState({text:e.target.value})}},{key:"render",value:function(){var e=this.props,t=e.className,a=e.loading;return u.a.createElement(d.a,{className:f()("search-box",t,b.b,b.c,"p-1")},u.a.createElement(E.a,{loading:a,size:"small"}),u.a.createElement(p.a,{md:"12",className:f()(b.e,"p-0","m-0","font-weight-light","text-muted","text-sz-md")},u.a.createElement("div",{className:f()("rounded",b.c,b.e)},u.a.createElement("i",{className:f()("search-icon fa fa-search","m-0","bg-tellor-green"),onClick:this.doSearch}),u.a.createElement("div",{className:f()("input-wrapper",b.c,b.e,b.g)},u.a.createElement("input",{type:"number",placeholder:"request-ID",className:f()(b.c,"ml-1","m-0"),onChange:this.updateText,onKeyPress:this.keyDown})))))}}]),t}(u.a.Component),v=a(80),j=a(755),x=a(196);t.a=Object(v.f)(Object(n.connect)(function(e){return{loading:e.requests.loading||e.init.loading}},function(e,t){return{runSearch:function(a){e(x.a.findRequestById(a)).then(function(e){t.resultHandler?t.resultHandler(e):t.history.push(j.a+"/"+a)})}}})(N))},764:function(e,t,a){"use strict";a.d(t,"c",function(){return s}),a.d(t,"b",function(){return l}),a.d(t,"d",function(){return i}),a.d(t,"a",function(){return o});var n=a(782),r=a.n(n),c=function(e,t){var a=new Date(e);return Math.abs((new Date).getYear()-a.getYear())>2&&(e*=1e3),r.a.utc(e).format(t)},s=function(e){return"undefined"===typeof e?"no-time":c(e,"MM-DD-YYYY HH:mm:ss ZZ")},l=function(e,t){return"undefined"===typeof e?"no-time":c(e,t||"YYYY.MM.DD-HH:mm")},i=function(e){return r.a.duration(e).humanize()},o=function(e){for(var t=r.a.duration(e),a=["d","h","m","s"],n=[t.days(),t.hours(),t.minutes(),t.seconds()],c="",s=n.length-1;s>=0;--s){var l=a[s];c="".concat(n[s]).concat(l," ").concat(c)}return c.trim()}},767:function(e,t){e.exports="data:image/png;base64,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"},770:function(e,t,a){"use strict";var n=a(98),r=a(6),c=a(7),s=a(14),l=a(9),i=a(15),o=a(2),m=a.n(o),u=a(1027),d=a(1028),p=a(1040),g=a(1029),f=a(1030),b=a(1031),h=a(748),E=a(749),N=a(1032),v=a(1033),j=a(40),x=a.n(j),O=a(752),k=a(1026),w=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=null;return this.props.logo_only||(e=m.a.createElement("div",{className:x()(O.d,O.a,"flex-column",O.g)},m.a.createElement("div",{className:x()(O.f,O.c,O.g)},m.a.createElement("span",{className:x()(O.h,O.g,"font-weight-bold","text-black"),style:{fontSize:"48px"}},"tellor"),m.a.createElement("span",{className:x()("font-weight-bold","text-tellor-green",O.g),style:{fontSize:"48px"}},"scan")))),m.a.createElement(k.a,{href:"#",onClick:this.props.goHome,className:x()(O.e,O.c,O.g)},e)}}]),t}(m.a.Component),A=a(761),y=a(754),C=a(767),R=a.n(C),B=function(e){function t(){return Object(r.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(i.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props,t=e.balance,a=e.withSearch,n=e.title,r=e.tokenLoading,c=x()("top-nav",O.c);a&&(c=x()(c,O.i));var s=m.a.createElement(m.a.Fragment,null,m.a.createElement(u.a,{className:x()(O.b,"mr-2")},m.a.createElement(d.a,{className:x()("text-dark"),href:"#",onClick:this.props.toSettings},m.a.createElement("i",{className:x()("fa fa-gear","text-dark","mr-1")}),"Settings")),m.a.createElement(u.a,{className:x()(O.b)},m.a.createElement(d.a,{className:x()("text-dark"),href:"#",onClick:this.props.toDisputes},m.a.createElement("i",{className:x()("fa fa-commenting-o","text-dark","mr-1")}),"Disputes")),m.a.createElement(u.a,{className:x()(O.b)},m.a.createElement(d.a,{className:x()("text-dark"),href:"#",onClick:this.props.toMining},m.a.createElement("img",{className:x()("mr-1"),src:R.a,width:"15",height:"15",alt:"miner"}),"Mining")),m.a.createElement(p.a,{nav:!0,inNavbar:!0},m.a.createElement(g.a,{nav:!0,caret:!0},m.a.createElement("i",{className:x()("icon-wallet","mr-1")}),"Wallet"),m.a.createElement(f.a,null,m.a.createElement(b.a,{header:!0},m.a.createElement(y.a,{loading:r}),"Token Balance: ",t),m.a.createElement(b.a,{onClick:this.props.getTokens},"Get Tokens"),m.a.createElement(b.a,{onClick:this.props.getBalance},"Refresh Balance")))),l=null;a&&(l=m.a.createElement(h.a,{className:x()(O.h,O.c,"pr-4",O.g)},m.a.createElement(E.a,{md:"6",className:x()(O.h,O.g)},m.a.createElement(A.a,{className:"tellor-bg-light"}))));var i=m.a.createElement(h.a,{className:x()(O.b,O.c,O.g)},m.a.createElement(E.a,{md:"10",className:x()(O.e,O.g)},m.a.createElement(h.a,{className:x()(O.b,O.g,O.c)},m.a.createElement(E.a,{md:"4",className:x()(O.e,O.g)},m.a.createElement(w,{goHome:this.props.goHome})),m.a.createElement(E.a,{md:"4",className:x()(O.b,O.g)},n&&m.a.createElement("h2",{className:x()(O.b,"text-muted","font-weight-bold")},n)),m.a.createElement(E.a,{md:"4",className:x()(O.h,O.g)},m.a.createElement(N.a,{navbar:!0,className:x()("ml-auto","text-md","font-weight-light","p-0")},s)))));return m.a.createElement(v.a,{light:!0,expand:"sm",className:x()(c)},l,i)}}]),t}(m.a.Component),D=a(80),I=a(755),S=a(197);t.a=Object(D.f)(Object(n.connect)(function(e){return{loading:e.requests.loading||e.init.loading,balance:e.token.balance,tokenLoading:e.token.loading}},function(e,t){return{goHome:function(){return t.history.push(I.c)},toDisputes:function(){return t.history.push(I.b)},toSettings:function(){return t.history.push(I.e)},toMining:function(){return t.history.push(I.d)},getTokens:function(){return e(S.a.getTokens())},getBalance:function(){return e(S.a.getBalance())}}})(B))},785:function(e,t,a){"use strict";a.d(t,"a",function(){return b});var n=a(6),r=a(7),c=a(14),s=a(9),l=a(15),i=a(2),o=a.n(i),m=a(761),u=a(748),d=a(749),p=a(40),g=a.n(p),f=a(752),b=function(e){function t(){return Object(n.a)(this,t),Object(c.a)(this,Object(s.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this.props,t=e.loading,a=e.title;return a||(a="Tellorscan Oracle Explorer"),o.a.createElement(u.a,{className:g()(f.b,f.c,"mt-5","mb-5")},o.a.createElement(d.a,{md:"10",className:g()(f.b,"search-wrapper","p-3")},o.a.createElement(u.a,{className:g()(f.i,f.c,"p-3")},o.a.createElement("div",{className:g()(f.e,f.c,"p-0","m-0","text-sz-md","text-light","font-weight-bold")},a),o.a.createElement(m.a,Object.assign({loading:t},this.props,{className:g()("bg-light","rounded")})))))}}]),t}(o.a.Component)}}]);
//# sourceMappingURL=10.ab9db507.chunk.js.map