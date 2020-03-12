import React, { Component } from "react";

const SortContext = React.createContext();
class SortProvider extends Component {
  constructor(props) {
    super(props);

    const { defaultSort, columns } = props;

    const orderBy = defaultSort ? defaultSort.orderBy : columns[0].key;
    const isAsc = defaultSort ? defaultSort.order : "asc";

    this.state = {
      orderBy,
      isAsc: isAsc === "asc" ? true : false
    };
  }

  actions = {
    setSort: ({ isAsc, orderBy }) => {
      this.setState({ isAsc, orderBy });
    },
    onClickOrderButton: key => {
      this.actions.setSort({
        orderBy: key,
        isAsc: !this.state.isAsc
      });
    },
    getOrder: () => {
      return !this.state.isAsc ? "asc" : "desc";
    }
  };

  render() {
    const { state, actions } = this;
    return (
      <SortContext.Provider value={{ state, actions }}>
        {this.props.children}
      </SortContext.Provider>
    );
  }
}

export default {
  Provider: SortProvider,
  Consumer: SortContext.Consumer,
  Context: SortContext
};
