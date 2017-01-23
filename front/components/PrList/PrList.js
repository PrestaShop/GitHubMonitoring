import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchData } from '../../actions/data';
import Pr from './Pr';

const PrListComponent = React.createClass({
  componentDidMount() {
    this.props.fetchData();
  },
  render() {
    const pullRequestsVisible = [];
    this.props.pullRequests.forEach((pullRequest) => {
      pullRequestsVisible.push(
        <Pr
          key={pullRequest.number}
          data={pullRequest}
        />
      );
    });
    return (
      <div>
        {pullRequestsVisible}
      </div>
    )
  }
});

PrListComponent.propTypes = {
  fetchData: PropTypes.func.isRequired,
  pullRequests: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    pullRequests: state.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: () => {
      dispatch(fetchData())
    }
  }
}

const PrList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PrListComponent);

export default PrList;
