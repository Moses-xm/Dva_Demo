import React, { useState } from "react";
import { connect } from "dva";
import { Link } from "dva/router";
import { v4 as uuidv4 } from "uuid";
import TodoList from "../../components/TodoList";

const Todo = (props) => {
  const [inputValue, setInputValue] = useState("");

  const addData = () => {
    props.dispatch({
      type: "todo/add",
      payload: {
        id: uuidv4(),
        content: inputValue,
      },
    });
    setInputValue("");
  };

  const deleteOne = (id) => {
    props.dispatch({
      type: "todo/delete",
      payload: id,
    });
  };

  const fetchSync = () => {
    props.dispatch({
      type: "todo/fetch",
    });
  };

  return (
    <div>
      <Link to="/">去首页</Link>
      <br />
      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      &nbsp;&nbsp;
      <button onClick={addData}>添加</button>
      &nbsp;&nbsp;
      <button onClick={fetchSync}>调接口</button>
      <TodoList data={props.data} deleteOne={deleteOne} />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    data: state.todo.data,
  };
};
export default connect(mapStateToProps)(Todo);
