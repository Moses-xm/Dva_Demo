import React from "react";

const TodoList = (props) => {
  const { data = [], deleteOne } = props;
  return (
    <ul>
      {data.map((item) => {
        return (
          <li key={item.id} style={{ marginBottom: 10 }}>
            {item.content}
            &nbsp;&nbsp;
            <button
              onClick={() => {
                deleteOne(item.id);
              }}
            >
              删除
            </button>
          </li>
        );
      })}
    </ul>
  );
};
export default TodoList;
