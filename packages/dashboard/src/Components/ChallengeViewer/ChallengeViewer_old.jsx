import React from 'react';
import {
  Row,
  Col,
  NavLink
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Progress from './ChallengeProgress';
import Body from './ChallengeBody';
import Value from './ChallengeValue';
import {
  formatTimeLong
} from 'Utils/time';

class Controls extends React.Component {
  render() {
    const {
      expanded
    } = this.props;
    let fontClass = cn("font-weight-bold", "text-sz-md");
    let clickableClass = cn("clickable-icon");
    let upDownColor = "text-tellor-green";
    let upDownIcon = expanded?"fa fa-caret-up":"fa fa-caret-down";
    let upDownClass = cn(fontClass, clickableClass, upDownIcon, upDownColor);

    return (
      <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
        <Col md="3" className={cn("ml-2", align.allCenter, align.noMarginPad)}>
          <i className={cn(upDownClass)}
             onClick={this.props.toggleExpansion} />
        </Col>

      </Row>
    )
  }
}

class ChallengeHeader extends React.Component {
  render() {
    const {
      hideSymbol,
      hideId
    } = this.props;

    return (
      <Row className={cn(align.topCenter, align.full, "pt-2", "pb-4", align.noMarginPad)}>
        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>

          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
            <Col md="1" className={cn(align.leftCenter, "ml-1", align.noMarginPad)}>
              &nbsp;
            </Col>
            {
              !hideId &&
              <Col md="1" className={cn(align.leftCenter, "ml-1", align.noMarginPad)}>
                <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
                  ID
                </span>
              </Col>
            }

            {
              !hideSymbol &&
              <Col md="2" className={cn(align.leftCenter, "ml-1", align.noMarginPad)}>
                <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
                  Symbol
                </span>
              </Col>
            }


            <Col md="2" className={cn(align.allCenter, "ml-1", align.noMarginPad)}>
              <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
                Value
              </span>
            </Col>



            <Col  className={cn(align.allCenter, "ml-auto", "mr-auto", align.noMarginPad)}>
              <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
                Progress
              </span>
            </Col>

            <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
              <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
                Tip
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
class ChallengeHiglights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };

    [
      'toggleExpansion'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  toggleExpansion() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const {
      challenge,
      hideSymbol,
      hideId
    } = this.props;

    return (
      <Row className={cn("item-row", "border-bottom", "border-muted", align.topCenter, align.full, "mb-3", align.noMarginPad)}>
        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>

            <Col md="1" className={cn(align.leftCenter, align.noMarginPad)}>
              <Controls challenge={challenge} expanded={this.state.expanded}
                        toggleExpansion={this.toggleExpansion}
                        startDispute={()=>this.props.startDispute(challenge)} />
            </Col>

            {
              !hideId &&
              <Col md="1" className={cn(align.leftCenter, "ml-1", align.noMarginPad)}>
                <NavLink href="#" onClick={()=>{
                                  if(this.props.idClicked) {
                                    this.props.idClicked(challenge.id)
                                  }
                                }}
                          className={cn("font-weight-bold", "text-1", "text-left", align.noMarginPad)}>
                  {challenge.id}
                </NavLink>
              </Col>
            }

            {
              !hideSymbol &&
              <Col md="2" className={cn(align.leftCenter, "ml-1", align.noMarginPad)}>
                <span className={cn("font-weight-bold", "text-1")}>
                  {challenge.symbol}
                </span>
              </Col>
            }


            <Col md="2" className={cn(align.leftCenter, "ml-1", align.noMarginPad)}>
                <Value challenge={challenge} />
            </Col>



            <Col className={cn(align.allCenter, "ml-auto", align.noMarginPad)}>
              <Progress challenge={challenge} />
            </Col>

            <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
              {challenge.tip}
            </Col>
          </Row>
        </Col>

        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
            <Col md="1" className={cn(align.leftCenter, align.noMarginPad)}>
              &nbsp;
            </Col>
            <Col md="1" className={cn(align.leftCenter, align.noMarginPad)}>
              <span className={cn("text-muted", "font-weight-light", "text-1")}>
                Time
              </span>
            </Col>
            <Col md="6" className={cn(align.leftCenter, align.noMarginPad)}>
              <span className={cn(align.noMarginPad,"text-muted", "text-left", "font-weight-light", "text-1")}>
                {formatTimeLong(challenge.timestamp)}
              </span>
            </Col>
          </Row>
        </Col>

        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
            <Col md="1" className={cn(align.leftCenter, align.noMarginPad)}>
               {/*empty for expand icon*/}
            </Col>
            <Col md="11" className={cn( align.leftCenter, align.noMarginPad)}>
              <Body challenge={challenge} expanded={this.state.expanded} />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default class ChallengeViewer extends React.Component {
  render() {
    const {
      challenges,
      noSymbol,
      noId
    } = this.props;
    if(challenges.length === 0) {
      return (
        <Row className={cn('challenges-container', align.allCenter, align.full, align.noMarginPad)}>

          <Col md="12" className={cn(align.allCenter, align.noMarginPad)}>
            <span className={cn("text-center", "font-weight-light")}>
              No Mining Events Yet
            </span>
          </Col>
        </Row>
      )
    }

    return (
      <Row className={cn('challenges-container', align.topCenter, align.full, align.noMarginPad)}>

        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <ChallengeHeader hideSymbol={noSymbol} hideId={noId}/>
          {
            challenges.map((c,i)=>{
              return (
                <ChallengeHiglights idClicked={this.props.idClicked} challenge={c} key={i} hideSymbol={noSymbol} hideId={noId}/>
              )
            })
          }
        </Col>
      </Row>
    )
  }
}
