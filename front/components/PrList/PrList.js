import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPulls } from '../../actions/pulls';
import Pr from './Pr';

const PrListComponent = React.createClass({
  componentDidMount() {
    this.props.fetchPulls();
  },
  render() {
    console.log(this.props.pulls);
    const pulls = [];
    this.props.pulls.forEach((pull) => {
      pulls.push(
        <Pr
          key={pull.number}
          data={pull}
        />
      );
    });
    return (
      <div>
        {pulls}
      </div>
    )
  }
});

PrListComponent.propTypes = {
  fetchPulls: PropTypes.func.isRequired,
  pulls: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    pulls: state.pulls,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPulls: () => {
      dispatch(fetchPulls())
    }
  }
}

const PrList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PrListComponent);

export default PrList;
