import React, { Component } from "react";

export default () => {
  const DataContext = React.createContext();

  class DataProvider extends Component {
    state = {
      data: this.props.data.content,
      rowCount: this.props.data.totalElements,
      rows: []
    };

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps !== prevState)
        return {
          data: nextProps.data.content || [],
          rowCount: nextProps.data.totalElements || 0
          // loading: true
        };
      return null;
    }

    actions = {
      getData: props => {
        const { paginationProps } = props;
        const { data, rows } = this.state;

        if (paginationProps) {
          const {
            state: { page, rowsPerPage }
          } = paginationProps;
          // console.log("get data props", props);
          if (paginationProps.mode === "scroll") {
            // this.setState({
            //   rows: rows.concat(data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))
            // });
            return data.slice(0, page * rowsPerPage + rowsPerPage);
          } else return data;
        }

        // TODO: 페이징 + 스크롤 + 모어
        // 1. 페이징 -> 데이터의 조작이 필요없음
        // 2. 스크롤 -> 데이터의 조작, 페이지 조작
        // 3. 모어리스트 -> 아직 미구현

        return this.state.data;
      },
      getRowCount: () => {
        return this.state.rowCount;
      }
    };

    render() {
      const { state, actions } = this;
      return (
        <DataContext.Provider value={{ state, actions }}>
          {this.props.children}
        </DataContext.Provider>
      );
    }
  }
  return {
    Provider: DataProvider,
    Consumer: DataContext.Consumer,
    Context: DataContext
  };
};
