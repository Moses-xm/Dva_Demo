import React from "react";
import { connect } from "dva";
import { Link } from "dva/router";
import styles from "./IndexPage.css";

function IndexPage(props) {
  const goTodo = () => {
    console.log("props", props);
    props.history.push("/todo");
  };
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to dva!</h1>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>
          To get started, edit <code>src/index.js</code> and save to reload.
        </li>
        <li>
          <a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">
            Getting Started
          </a>
        </li>
      </ul>
      <button onClick={goTodo}>去todoList</button>
      <Link to="/todo">Lik去todoList</Link>
    </div>
  );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
