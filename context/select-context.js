import React, { Component } from "react";

const SelectContext = React.createContext();
class SelectProvider extends Component {
  state = {
    selected: {}
  };

  //TODO: actions 전에 처리해야할 부분
  //const selectedList =
  // !selected || !setSelect ? this.state.selected : selected;

  constructor(props) {
    super(props);
    const {
      selectRow: { defaultSelected, selected, setSelect }
    } = props;

    if (defaultSelected) {
      if (!selected || !setSelect) {
        this.state = {
          selected: defaultSelected
        };
      } else {
        setSelect(defaultSelected);
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      selectRow: { defaultSelected, selected, setSelect }
    } = nextProps;

    if (defaultSelected) {
      if (defaultSelected !== prevState.selected) {
        if (!selected || !setSelect) {
          return {
            selected: defaultSelected
          };
        } else {
          setSelect(defaultSelected);
        }
      }
    }
    return null;
  }

  actions = {
    setSelect: selected => {
      if (this.props.selectRow.setSelect) {
        this.props.selectRow.setSelect(selected);
      } else {
        this.setState({ selected });
      }
    },
    handleClickRow: (e, { id, hasDetails, details }) => {
      const {
        mode,
        selected,
        setSelect,
        maxSelectCount
      } = this.props.selectRow;

      // FIXME: DEFAULT SELECTED 주입
      const selectedList =
        !selected || !setSelect ? this.state.selected : selected;

      const compareObj = mode === "checkbox" ? selectedList : {};
      const isSelected = selectedList.hasOwnProperty(id);

      let newSelected = {};
      if (!isSelected) {
        if (maxSelectCount <= this.actions.getSelectedCount()) {
          return;
        }
        // e.target.checked ||
        // newSelected = Object.assign(compareObj, {
        //   [id]: hasDetails && details.map(m => m.id)
        // });
        newSelected = {
          ...compareObj,
          [id]: hasDetails && details.map(m => m.id)
        };
      } else {
        delete selectedList[id];
        // newSelected = Object.assign(selectedList, newSelected);
        newSelected = {
          ...selectedList,
          ...newSelected
        };
      }
      this.actions.setSelect(newSelected);
    },
    handleClickDetailRow: (e, { parentId, id }) => {
      const {
        mode,
        selected,
        setSelect,
        maxSelectCount
      } = this.props.selectRow;
      const selectedList =
        !selected || !setSelect ? this.state.selected : selected;
      const compareObj = mode === "checkbox" ? selectedList : {};
      const isSelected = selectedList.hasOwnProperty(parentId);
      let newSelected = {};

      // 같은 부모니 아니니
      if (!isSelected) {
        if (maxSelectCount <= this.actions.getSelectedCount()) {
          return;
        }
        // 같은 부모가 없을 시
        // newSelected = Object.assign(compareObj, {
        //   [parentId]: [id]
        // });
        newSelected = {
          ...compareObj,
          [parentId]: [id]
        };
      } else {
        // 부모가 같을 시
        const detailList = selectedList[parentId];
        const selectedIndex = detailList.indexOf(id);
        let newDetailSelected = [];
        if (selectedIndex === -1) {
          newDetailSelected = newDetailSelected.concat(detailList, id);
        } else if (selectedIndex === 0) {
          newDetailSelected = newDetailSelected.concat(detailList.slice(1));
        } else if (selectedIndex === detailList.length - 1) {
          newDetailSelected = newDetailSelected.concat(detailList.slice(0, -1));
        } else if (selectedIndex > 0) {
          newDetailSelected = newDetailSelected.concat(
            detailList.slice(0, selectedIndex),
            detailList.slice(selectedIndex + 1)
          );
        }
        // newSelected = Object.assign(selectedList, {
        //   [parentId]: newDetailSelected
        // });
        newSelected = {
          ...selectedList,
          [parentId]: newDetailSelected
        };
      }
      this.actions.setSelect(newSelected);
    },
    onSelectAllClick: e => {
      const { data } = this.props;
      if (e.target.checked) {
        this.actions.setSelect(
          Object.assign(
            {},
            ...data.map(n => {
              return { [n.id]: null };
            })
          )
        );
        return;
      }
      this.actions.setSelect([]);
    },
    isSelected: ({ id, hasDetails }) => {
      const { selected, setSelect } = this.props.selectRow;
      const selectedList =
        !selected || !setSelect ? this.state.selected : selected;
      //hasDetails 일 경우 체크박스 처리
      if (
        hasDetails &&
        selectedList.hasOwnProperty(id) &&
        selectedList[id].length <= 0
      ) {
        delete selectedList[id];
      }
      return selectedList.hasOwnProperty(id);
    },
    isDetailsSelected: ({ parentId, id }) => {
      const { selected, setSelect } = this.props.selectRow;
      const selectedList =
        !selected || !setSelect ? this.state.selected : selected;
      return selectedList.hasOwnProperty(parentId)
        ? selectedList[parentId].indexOf(id) !== -1
        : false;
    },
    getSelectedCount: () => {
      const { selected, setSelect } = this.props.selectRow;
      const selectedList =
        !selected || !setSelect ? this.state.selected : selected;
      return Object.keys(selectedList).length;
    },
    handleClickCheckbox: (f, d) => {
      const {
        mode,
        selected,
        setSelect,
        maxSelectCount
      } = this.props.selectRow;

      const selectedList =
        !selected || !setSelect ? this.state.selected : selected;

      // FIXME: DETAIL일 경우 부모가 선택된 경우는 ok else no
      const hasOwnProperty =
        selectedList.hasOwnProperty(d.id) ||
        selectedList.hasOwnProperty(d.parentId);

      const selectedCount = this.actions.getSelectedCount();

      if (
        mode === "checkbox" &&
        !hasOwnProperty &&
        maxSelectCount <= selectedCount
      )
        return;

      return f({ data: d, count: selectedCount });
    }
  };

  render() {
    const { selected, setSelect } = this.props.selectRow;
    const { state: a, actions } = this;

    const state =
      !selected || !setSelect ? a : { selected: this.props.selectRow.selected };

    return (
      <SelectContext.Provider value={{ state, actions }}>
        {this.props.children}
      </SelectContext.Provider>
    );
  }
}

export default {
  Provider: SelectProvider,
  Consumer: SelectContext.Consumer,
  Context: SelectContext
};
