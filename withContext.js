import React from "react";
import createDataContext from "./context/data-context";
import SelectContext from "./context/select-context";
import SortContext from "./context/sort-context";
import PaginationContext from "./context/pagination-context";

const withContext = WrapperedComponent =>
  class ComstomTableContainer extends React.Component {
    constructor(props) {
      super(props);
      this.DataContext = createDataContext();

      if (props.selectRow) {
        this.SelectionContext = SelectContext;
      }

      if (
        props.defaultSort &&
        props.columns.filter(col => col.sort).length > 0
      ) {
        this.SortContext = SortContext;
      }

      if (props.defaultPagination) {
        this.PaginationContext = PaginationContext;
      }
    }

    renderBase() {
      return props => {
        return (
          <WrapperedComponent
            {...this.props}
            rowCount={props.actions.getRowCount()}
            data={props.actions.getData(props)}
          />
        );
      };
    }

    renderWithSelectionCtx(base, baseProps) {
      return props => {
        return (
          <this.SelectionContext.Provider
            ref={n => (this.selectionContext = n)}
            data={props.state.data}
            selectRow={this.props.selectRow}
          >
            {base(props)}
          </this.SelectionContext.Provider>
        );
      };
    }

    renderWithSortCtx(base, baseProps) {
      return props => {
        return (
          <this.SortContext.Provider
            ref={n => (this.sortContext = n)}
            defaultSort={this.props.defaultSort}
            columns={this.props.columns}
          >
            <this.SortContext.Consumer>
              {sortProps => base({ ...props, sortProps })}
            </this.SortContext.Consumer>
          </this.SortContext.Provider>
        );
      };
    }

    renderWithPaginationCtx(base, baseProps) {
      return props => {
        return (
          <this.PaginationContext.Provider
            ref={n => (this.paginationContext = n)}
            defaultPagination={this.props.defaultPagination}
          >
            <this.PaginationContext.Consumer>
              {paginationProps => base({ ...props, paginationProps })}
            </this.PaginationContext.Consumer>
          </this.PaginationContext.Provider>
        );
      };
    }

    render() {
      const { id, columns } = this.props;
      const baseProps = { id, columns };

      let base = this.renderBase();

      if (this.SelectionContext) {
        base = this.renderWithSelectionCtx(base, baseProps);
      }

      if (this.SortContext) {
        base = this.renderWithSortCtx(base, baseProps);
      }

      if (this.PaginationContext) {
        base = this.renderWithPaginationCtx(base, baseProps);
      }

      return (
        <this.DataContext.Provider {...baseProps} data={this.props.data}>
          <this.DataContext.Consumer>{base}</this.DataContext.Consumer>
        </this.DataContext.Provider>
      );
    }
  };

export default withContext;
