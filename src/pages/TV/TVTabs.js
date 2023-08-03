import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TVTab from './TVTab';



class TVTabs extends Component {
    static propTypes = {
      children: PropTypes.instanceOf(Array).isRequired,
    }

    constructor(props) {
      super(props);
      this.startTimer = this.startTimer.bind(this);
      this.state = {
        count:0,
        activeTab: this.props.children[this.state.count].props.label,
      };
    }
   
    startTimer = () => {
    setInterval(() => {this.setState((state) => {return {count:state.count + 1}})},5000);
    if(this.state.count > 2) {
      this.setState({count:0});
    }
}

    onClickTabItem = (tab) => {
      this.setState({ activeTab: tab });
    }
    componentDidMount() {
       this.startTimer();
    }

    render() {
        const {
          onClickTabItem,
          props: {
            children,
          },
          state: {
            activeTab,
          }
        } = this;
    
        return (
          <div className="tabs">
            <ol className="tab-list">
              {children.map((child) => {
                const { label } = child.props;
    
                return (
                  <TVTab
                    activeTab={activeTab}
                    key={label}
                    label={label}
                    onClick={onClickTabItem}
                  />
                );
              })}
            </ol>
            <div className="tab-content">
              {children.map((child) => {
                if (child.props.label !== activeTab) return undefined;
                return child.props.children;
              })}
            </div>
          </div>
        );
      }
    }
    
    export default TVTabs;