大家好，我是沐言，接下来呢我们来共同看一下dva.

在我们的项目中，特别是一些比较新的项目中，使用的状态管理工具应该都是dva

首先我们进入它的官方文档，看一下 dva的介绍

这里说，dva 首先是一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案，然后为了简化开发体验，dva 还额外内置了 [react-router](https://github.com/ReactTraining/react-router) 和 [fetch](https://github.com/github/fetch)，所以也可以理解为一个轻量级的应用框架。

这个Redux是什么呢？相信大家应该肯定都用过react-redux哈，Redux就是一个单向数据流的状态管理工具，它里面有一系列的概念，比如说Reducer，action，store什么的，而Redux-Saga又是什么呢？

Redux-Saga主要是为了解决Redux的异步问题，在Redux里面，还有一个叫做Redux-sunk的库，也是Redux的一个异步问题的解决方案，是Redux的一个中间件，用过Redux的同学都应该知道，在Redux中，我们只能解决同步问题，如果要解决异步问题的时候，需要引入中间件Redux-sunk

而Redux-saga就是和redux-sunk类似的一个中间件，用来管理我们的副作用，它的底层应用的是ES6的generator语法。

我们在使用redux和redux-saga的时候呢，发现使用起来并不是那么优雅，而dva就是在redux和redux-saga的基础上进行封装，让我们使用起来更加的简洁方便，另外，dva还内置了react-router和fecth，一个是路由，一个是发请求的request，它既然集成了数据流解决方案，又有路由和请求，那么它就已经具备了一个框架应该有的特征，所以我们可以说它是一个轻量级的框架。

它的特性有：

- **易学易用**，仅有 6 个 api，对 redux 用户尤其友好，[配合 umi 使用](https://umijs.org/guide/with-dva.html)后更是降低为 0 API
- **elm 概念**，通过 reducers, effects 和 subscriptions 组织 model
- **插件机制**，比如 [dva-loading](https://github.com/dvajs/dva/tree/master/packages/dva-loading) 可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading
- **支持 HMR**，基于 [babel-plugin-dva-hmr](https://github.com/dvajs/babel-plugin-dva-hmr) 实现 components、routes 和 models 的 HMR

好，接下来我们来看一个dva是怎么用的，（文档快速上手）

npm start之后就可以看到脚手架搭建起来的项目的样子（在电脑上执行npm start，让大家看效果）

我们在它这个脚手架搭建好的项目的基础上呢，就可以进行自己项目的开发

我们看到呢，它也可以直接下载antd组件库，然后添加一下配置引入进行使用

它文档这里呢是讲了一个小的例子，我们看到它开始定义路由，编写UI组建，然后定义Model等，完了之后会有一个这样的效果。根据它这个例子呢我自己也写了一个小demo，一会儿我们会根据这个小demo来一起学习一下dva的使用。

我们现在来看一下，为什么要学习dva？

### 为什么要学习Dva

####  React 没有解决的问题

React 本身只是一个 DOM 的抽象层，使用组件构建虚拟 DOM。

如果开发大应用，还需要解决一个问题。

- 通信：组件之间如何通信？
- 数据流：数据如何和视图串联起来？路由和数据如何绑定？如何编写异步逻辑？等等

我们可以看到，react有一些没有解决的问题...

#### 通信问题

组件会发生三种通信。

- 向子组件发消息
- 向父组件发消息
- 向其他组件发消息

React 只提供了一种通信手段：传参。对于大应用，很不方便。

#### 数据流问题

目前流行的数据流方案有：

- Flux，单向数据流方案，以 [Redux](https://github.com/reactjs/redux) 为代表
- Reactive，响应式数据流方案，以 [Mobx](https://github.com/mobxjs/mobx) 为代表
- 其他，比如 rxjs 等

到底哪一种架构最合适 React ？

#### 目前最流行的数据流方案

截止 2017.1，最流行的社区 React 应用架构方案如下。

- 路由： [React-Router](https://github.com/ReactTraining/react-router/tree/v2.8.1)
- 架构： [Redux](https://github.com/reactjs/redux)
- 异步操作： [Redux-saga](https://github.com/yelouafi/redux-saga)

缺点：要引入多个库，项目结构复杂。

####  dva 是什么

dva 是体验技术部开发的 React 应用框架，将上面三个 React 工具库包装在一起，简化了 API，让开发 React 应用更加方便和快捷。

dva = React-Router + Redux + Redux-saga

而dva是什么呢？dva刚刚好就是上面三个工具库的组合体，将三个最流行的应用架构方案集合在了一起，集中了他们共同的优点，而且简化了API，使得我们的开发更加的方便和快捷，所以我们是非常有必要学一下这个三合一的框架的。

###  Dva 概念

接下来我们一起来看看dva的概念

首先我们来看一下dva的一个数据流向，这张图想必大家都已经见过很多次了，dva的一个数据流向图，总结一下就是：视图通过connect连接到状态，视图通过dispatch发起一个action去改变状态，状态发生变化视图重新渲染。

大概到过程就是这样，最重要的就是改变状态这个动作，数据的改变通常是通过用户交互行为（如用户点击某个按钮）和浏览器行为（如路由跳转）改变的，当此类行为触发的时候，可以通过dispatch发起一个action，如果是同步行为就可以直接通过reducers改变state状态，如果是异步行为，会先触发Effects，然后Effects再触发reducers去改变状态。这就是改变状态的过程。至于reducers和Effects是什么呢，我们可以看到他们都在Model中，其实state状态也在Model中，Model就是dva中最核心的部分

dva总共有6个API，分别为

- app = dva(Opts)
- app.use(Hooks)
- app.models(ModelObject)
- app.unmodel(Namespace)
- app.router(Function)
- app.start([HTMLElement])

第一个是用来初始化Dva应用的，第二个是用于挂载一些插件，第三个用户挂在我们的Models对象，第五个用于挂载我们的路由组建，第六个用于启动dva应用，一般我们只会使用五个就可以使用dva应用。

- State
- Action
- Model
- Reducer
- Effect
- Subscription
- Router
- RouteComponent

我们来看一下dva的几个概念：

#### Action

Action：表示操作事件，可以是同步，也可以是异步。它需要有一个 type ，表示这个 `action` 要触发什么操作；`payload` 则表示这个 action 将要传递的数据。

#### dispatch 函数

dispatching function 是一个用于触发 action 的函数，action 是改变 State 的唯一途径，但是它只描述了一个行为，而 dipatch 可以看作是触发这个行为的方式，而 Reducer 则是描述如何改变数据的。

在 dva 中，connect Model 的组件通过 props 可以访问到 dispatch，可以调用 Model 中的 Reducer 或者 Effects，常见的形式如：

```js
dispatch({
  type: 'user/add', // 如果在 model 外调用，需要添加 namespace
  payload: {}, // 需要传递的信息
});
```

接下来我们来看一下Model的组成

#### Model

Model 是 dva 最重要的部分，可以理解为 redux、react-redux、redux-saga 的封装。 每个独立的route都对应一个model, 每个model包含如下属性:

##### namespace

首先是`namespace`：模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的。整个应用的 State，由多个小的 Model 的 State 以 namespace 为 key 合成。

##### state

`state`：与具体route相关的所有状态数据结构存放在该属性中。

##### Reduces

Reduces是唯一可以更新 state 的地方

##### Effects



Subscriptions 是一种从 **源** 获取数据的方法，它来自于 elm。

Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。


