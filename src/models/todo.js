import { query } from "../services/example";

export default {
  namespace: "todo",
  state: {
    data: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      window.onresize = () => {
        console.log("onresize");
      };
    },
    setupHistory({ dispatch, history }) {
      // history.listen(({ pathname }) => {
      //   if (pathname === "/todo") {
      //     dispatch({ type: "fetch" });
      //   }
      // });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(query);
      if (res) {
        const newData = res.data.result.map((item) => ({
          id: item.sid,
          content: item.text,
        }));
        yield put({
          type: "update",
          payload: newData,
        });
      }
    },
  },

  reducers: {
    add(state, action) {
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    },
    delete(state, action) {
      const newData = state.data.filter((item) => item.id !== action.payload);
      return {
        ...state,
        data: newData,
      };
    },
    update(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
