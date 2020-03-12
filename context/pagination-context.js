import React, { Component } from "react";

const PaginationContext = React.createContext();
class PaginationProvider extends Component {
  state = {
    page: this.props.defaultPagination.page || 0,
    rowsPerPage: this.props.defaultPagination.rowsPerPage || 10
  };

  mode = this.props.defaultPagination.mode || "page";

  actions = {
    onChangePage: (e, page) => {
      this.setState({ page });
    },
    onChangeRowsPerPage: e => {
      this.setState({ page: 0, rowsPerPage: Number(e.target.value) });
    }
  };

  render() {
    const { state, actions, mode } = this;

    return (
      <PaginationContext.Provider value={{ state, actions, mode }}>
        {this.props.children}
      </PaginationContext.Provider>
    );
  }
}

export default {
  Provider: PaginationProvider,
  Consumer: PaginationContext.Consumer,
  Context: PaginationContext
};
