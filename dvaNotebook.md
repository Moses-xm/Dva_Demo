# Dva
## Dva 介绍
dva 首先是一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案，然后为了简化开发体验，dva 还额外内置了 [react-router](https://github.com/ReactTraining/react-router) 和 [fetch](https://github.com/github/fetch)，所以也可以理解为一个轻量级的应用框架。

## 特性

-   **易学易用**，仅有 6 个 api，对 redux 用户尤其友好，[配合 umi 使用](https://umijs.org/guide/with-dva.html)后更是降低为 0 API
-   **elm 概念**，通过 reducers, effects 和 subscriptions 组织 model
-   **插件机制**，比如 [dva-loading](https://github.com/dvajs/dva/tree/master/packages/dva-loading) 可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading
-   **支持 HMR**，基于 [babel-plugin-dva-hmr](https://github.com/dvajs/babel-plugin-dva-hmr) 实现 components、routes 和 models 的 HMR

## 为什么要学习Dva

### React 没有解决的问题

React 本身只是一个 DOM 的抽象层，使用组件构建虚拟 DOM。

如果开发大应用，还需要解决一个问题。

-   通信：组件之间如何通信？
-   数据流：数据如何和视图串联起来？路由和数据如何绑定？如何编写异步逻辑？等等

### 通信问题

组件会发生三种通信。

-   向子组件发消息
-   向父组件发消息
-   向其他组件发消息

React 只提供了一种通信手段：传参。对于大应用，很不方便。

### 数据流问题

目前流行的数据流方案有：

- Flux，单向数据流方案，以 [Redux](https://github.com/reactjs/redux) 为代表
- Reactive，响应式数据流方案，以 [Mobx](https://github.com/mobxjs/mobx) 为代表
- 其他，比如 rxjs 等

到底哪一种架构最合适 React ？

### 目前最流行的数据流方案

截止 2017.1，最流行的社区 React 应用架构方案如下。

- 路由： [React-Router](https://github.com/ReactTraining/react-router/tree/v2.8.1)
- 架构： [Redux](https://github.com/reactjs/redux)
- 异步操作： [Redux-saga](https://github.com/yelouafi/redux-saga)

缺点：要引入多个库，项目结构复杂。

### dva 是什么

dva 是体验技术部开发的 React 应用框架，将上面三个 React 工具库包装在一起，简化了 API，让开发 React 应用更加方便和快捷。

dva = React-Router + Redux + Redux-saga

## Dva 概念

### 数据流向

数据的改变发生通常是通过用户交互行为或者浏览器行为（如路由跳转等）触发的，当此类行为会改变数据的时候可以通过 `dispatch` 发起一个 action，如果是同步行为会直接通过 `Reducers` 改变 `State` ，如果是异步行为（副作用）会先触发 `Effects` 然后流向 `Reducers` 最终改变 `State`，所以在 dva 中，数据流向非常清晰简明，并且思路基本跟开源社区保持一致（也是来自于开源社区）。

![img](https://zos.alipayobjects.com/rmsportal/PPrerEAKbIoDZYr.png)

总结：视图通过connect连接到状态，视图通过dispatch发起一个action去改变状态，状态发生变化视图重新渲染。

数据的改变发生通常是通过:

- 用户交互行为（用户点击按钮等）
- 浏览器行为（如路由跳转等）触发的

当此类行为会改变数据的时候，可以通过 dispatch 发起一个 action

- 如果是同步行为，会将action发送给 Reducer，直接通过 Reducer 改变 State，然后通过 connect 重新渲染组件。
- 如果是异步行为，会将action发送给 Effect，一般是从服务器请求数据，服务器返回数据之后，Effect 会发送相应的 action 给 reducer，由唯一能改变state 的 reducer 改变 State ，然后通过connect重新渲染组件。

### 6个API

- app = dva(Opts)
- app.use(Hooks)
- app.models(ModelObject)
- app.unmodel(Namespace)
- app.router(Function)
- app.start([HTMLElement])

```js
import dva from 'dva';
import './index.css';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
```

一般我们启动一个dva项目只需要上面的几个API

### Action

Action是一个普通的javascript对象，它是改变state的唯一途径，为什么说它是唯一的途径呢？因为无论是从 UI 事件、网络回调，还是 WebSocket 等数据源所获得的数据，最终都会通过 dispatch 函数调用一个 action，从而改变对应的数据。

action 必须带有 `type` 属性指明具体的行为，其它字段可以自定义，一般我们会再定义一个payload，用于携带参数。如果要发起一个 action 需要使用 `dispatch` 函数；需要注意的是 `dispatch` 是在组件 connect Models以后，通过 props 传入的。

```js
{
  type: 'add',
  payload: {},
}
```

### dispatch 函数

dispatching function 是一个用于触发 action 的函数，action 是改变 State 的唯一途径，但是它只描述了一个行为，而 dipatch 可以看作是触发这个行为的方式，而 Reducer 则是描述如何改变数据的。

在 dva 中，connect Model 的组件通过 props 可以访问到 dispatch，通过dispatch就可以调用 Model 中的 Reducer 或者 Effects，常见的形式如：

```js
dispatch({
  type: 'user/add', // 如果在 model 外调用，需要添加 namespace
  payload: {}, // 需要传递的信息
});
```

### connect 方法

dva 提供了 connect 方法。如果你熟悉 redux，这个 connect 就是 react-redux 的 connect 。

connect 是一个高阶函数，绑定 State 到 View。

```js
import { connect } from 'dva';

function mapStateToProps(state) {
  return { todos: state.todos };
}
connect(mapStateToProps)(App);
```

connect 方法传入的第一个参数是 mapStateToProps 函数，mapStateToProps 函数会返回一个对象，用于建立 State 到 Props 的映射关系。

connect 方法返回的也是一个 React 组件，通常称为容器组件。因为它是原始 UI 组件的容器，即在外面包了一层 State。

### Model

```js
import { fetchUsers } from '../services/user';

export default {
  namespace: 'user',
  state: {
    list: [],
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.data,
      };
    },
  },
  effects: {
    *fetch(action, { put, call }) {
      const users = yield put(fetchUsers, action.data);
      yield put({ type: 'save', data: users });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/user') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
}
```

Model 是 dva 最重要的部分，可以理解为 redux、redux-saga 的封装。 每个独立的route都对应一个model, 每个model包含如下属性:

#### namespace

`namespace`：模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的。整个应用的 State，由多个小的 Model 的 State 以 namespace 为 key 合成。

```js
namespace: 'user'
```

####  State

State 表示 Model 的状态数据，通常表现为一个 javascript 对象（当然它可以是任何值）

与具体route相关的所有状态数据结构存放在该属性中。

```js
 state: {
    list: [],
 }
```

#### Reducers

Reducer（也称为 reducing function）函数接受两个参数：之前已经累积运算的结果和当前要被累积的值，返回的是一个新的累积结果。该函数把一个集合归并成一个单值。

在 dva 中，reducers 聚合积累的结果是当前 model 的 state 对象。通过 actions 中传入的值，与当前 reducers 中的值进行运算获得新的值（也就是新的 state）。需要注意的是 Reducer 必须是[纯函数](https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch3.md)，所以同样的输入必然得到同样的输出，它们不应该产生任何副作用，每次操作都是返回一个全新的数据（独立，纯净）。

```js
reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.data,
      };
    },
}
```

#### Effects

Effect 被称为副作用，在我们的应用中，最常见的就是异步操作。它来自于函数编程的概念，之所以叫副作用是因为它使得我们的函数变得不纯，同样的输入不一定获得同样的输出。

dva 为了控制副作用的操作，底层引入了[redux-saga](http://superraytin.github.io/redux-saga-in-chinese)做异步流程控制，基于 generator语法。Generator 返回的是迭代器，通过 yield 关键字实现暂停功能。所以将异步转成同步写法，从而将effects转为纯函数。

effects：用于处理异步操作和业务逻辑，不直接修改 state。简单的来说，就是从服务端获取数据，并且发起一个 action 交给 reducer 。

dva 提供多个 effect 函数内部的处理函数，比较常用的是 `call` 和 `put`。

- put：发出一个 Action，类似于 dispatch

```js
yield put({ type: 'todos/add', payload: 'Learn Dva' });
```

- call：用于调用异步逻辑，支持 promise 。

```js
const result = yield call(fetch, '/todos');
```

- select：用于从 state 里获取数据。

```js
const todos = yield select(state => state.todos);
```

```js
effects: {
    *fetch(action, { put, call }) {
      const users = yield call(fetchUsers, action.data);
      yield put({ type: 'save', data: users });
    },
}
```

#### Subscriptions

Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。

比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。

```js
subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/user') {
          dispatch({ type: 'fetch' });
        }
      });
    },
}
```

### Router

这里的路由通常指的是前端路由，由于我们的应用现在通常是单页应用，所以需要前端代码来控制路由逻辑，通过浏览器提供的 [History API](http://mdn.beonex.com/en/DOM/window.history.html) 可以监听浏览器url的变化，从而控制路由相关操作。

dva 实例提供了 router 方法来控制路由，使用的是[react-router](https://github.com/reactjs/react-router)。

```js
import React from "react";
import { Router, Route, Switch } from "dva/router";
import IndexPage from "./routes/IndexPage";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
      </Switch>
    </Router>
  );
}
export default RouterConfig;
```

###  Route Components

在[组件设计方法](https://github.com/dvajs/dva-docs/blob/master/v1/zh-cn/tutorial/04-组件设计方法.md)中，我们提到过 Container Components，在 dva 中我们通常将其约束为 Route Components，因为在 dva 中我们通常以页面维度来设计 Container Components。

随着应用的发展，你会需要在多个页面分享 UI 元素 (或在一个页面使用多次)，在 dva 里你可以把这部分抽成 component 。

所以在 dva 中，通常需要 connect Model的组件都是 Route Components，组织在`/routes/`目录下，而`/components/`目录下则是纯组件（Presentational Components）。

## 项目结构

```js
├── mock               // mock数据文件夹
├── node_modules       // 第三方的依赖
├── public             // 一般用于存放静态文件，打包时会被直接复制到输出目录(./dist)
├── src                // 用于存放项目源代码
│   ├── assets         // 用于存放静态资源，打包时会经过 webpack 处理
│   ├── components     // 用于存放 React 组件，一般是该项目公用的无状态组件
│   ├── models         // dva最重要的文件夹，所有的数据交互及逻辑都写在这里
│   ├── routes         //  用于存放需要 connect model 的路由组件
│   ├── services       // 用于存放服务文件，一般是网络请求等；
│   ├── utils          // 工具类库
│   ├── index.css      // 入口文件样式
│   ├── index.js       // 入口文件
│   └── router.js      // 项目的路由文件
├── .eslintrc          // bower安装目录的配置
├── .editorconfig      // 保证代码在不同编辑器可视化的工具
├── .gitignore         // git上传时忽略的文件
├── .roadhogrc.mock.js // 项目的配置文件
└── package.json       // 当前整一个项目的依赖
```
