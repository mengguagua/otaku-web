## otaku

### 技术工具

> 粗略所述所用工具，需要下载运行源码，或者源码相关问题可以提问我

#### 前端

react：https://react.dev/learn

react-redux：https://react-redux.js.org/introduction/getting-started

react-router-dom：https://reactrouter.com/en/main/start/tutorial

ant-design：https://ant.design/components/table-cn#components-table-demo-basic

Iconify：https://iconify.design/

#### 服务端

后端框架nestjs：https://docs.nestjs.com/

> 建议先通读OVERVIEW全部章节：https://docs.nestjs.com/first-steps

操作数据库框架typeorm：https://typeorm.io/entities

数据库mysql

### React Tip

- useState() 属于异步函数, setState()后值不会立刻变化。
- key和path要一致且唯一。
  说明：navigate(key): 菜单跳转通过api实现，key对应的是src/routes/router.jsx的`path`和前缀路径无关。
- react没有scoped，样式会相互影响。可选方案是css module和css in js。但实际都不好用。为了避免样式冲突，我们约定：
  1、公共样式+组件覆盖样式都统一在src/routes/root.css
  2、jsx样式在同目录的index.css内写，以`业务文件夹名-css样式名`规则命名。(业务文件夹名不可重复)
- React.StrictMode会有意地双调用，所以会看见接口调用了两次。（严格模式检查只在开发模式下运行，不会与生产模式冲突）
- 可以在main.jsx的ConfigProvider里定制主题颜色
- jsx里引用的组件一定要首字母大写
- antDesign form表单特殊要求：https://ant.design/components/form-cn
  例如：注意 initialValues 不能被 setState 动态更新，需要用 setFieldsValue 来更新。另外提供useWatch 允许监听字段变化，同时仅当该字段变化时重新渲染
- 冷知识：空值合并操作符：`??`
  是一个逻辑操作符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。
- 冷知识：可选链接运算符：`?. `（ES2020语法）
  `data?.children?.[0]?.title; ` 等价于 ` if (data && data.children && data.children[0] && data.children[0].title){}`
  判断左侧对象不是null 或者 undefined就去取下一个属性
- antd的日期使用dayjs 所以日期反显要用dayjs转化一下。
- 假如页面加载慢，可以使用退路方案（fallback），类似图片的预加载框效果。参考：https://zh-hans.react.dev/reference/react/Suspense
- useState的值修改了，但dom没刷新，可以给需要刷新的dom添加key，key更新dom更新
