import React from "react";

const withExcute = WrapperComponent =>
  class ExcuteContainer extends React.Component {
    render() {
      return this.props.withCellExcute(this.props)(WrapperComponent);
    }
  };

export default withExcute;
