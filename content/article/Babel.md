---
title: Babel插件指南
resume: 描述什么事AST，怎么修改AST实现babel插件
time: 2022-11-16T16:00:00.000Z
---

## Babel插件指南

author：gaocc
time: 2022-11-17

### Babel简介

多功能的 JavaScript 编译器。此外它还拥有众多模块可用于不同形式的静态分析。

> 静态分析是在不需要执行代码的前提下对代码进行分析的处理过程。静态分析的目的是多种多样的， 它可用于语法检查，编译，代码高亮，**代码转换**，优化，压缩等等场景。

* 通过图进一步理解：

![](/Babel/img1.png)

> 浏览器编译你的js代码，需要把js转化成ast。2015年es6语法发布，但浏览器还普遍不支持es6语法。于是催生出babel模块，默认支持js到ast的转化，并通过修改ast，将es6的特性代码转化为同效用的es5代码，同时也提供了ast的操作函数。

Babel操作流程：js代码 -> 原AST -> babel处理 -> 修改后的AST -> 修改后的js代码 -> 交给浏览器编译

即： **解析（parse）**，**转换（transform）**，**生成（generate）**

> 实现上述功能的插件见小节：Babel API

Babel 更确切地说是源码到源码的编译器，通常也叫做“转换编译器（transpiler）”。 意思是说你为 Babel 提供一些 js代码，Babel 更改这些代码，然后返回给你新生成的js代码。

由于babel提供了操作AST的函数，所以开发者可以由此做各种各样的静态分析。

### AST(Abstract syntax tree)简介

常见编译型语言（例如：Java）编译程序一般步骤分为：词法分析->语法分析->语义检查->代码优化和字节码生成。具体的编译流程如下图：

![](/Babel/img2.png)

> js的AST生成和java略有不同，java是走上图所有流程，通过**本地jdk**将\*\*.java**文件编译成**.class**后缀的文件，然后交给jvm(虚拟机)处理。js默认是通过**浏览器\*\*编译，流程到上图的语义检查器为止，生成最终的AST

* AST解析示例

js代码

```js
let a = 1;
```

解析后AST

```json
{
  "type": "Program",
  "start": 0,
  "end": 10,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 10,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 9,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 5,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 8,
            "end": 9,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "let"
    }
  ],
  "sourceType": "module"
}
```

在线js转换到AST工具：[https://astexplorer.net/#/](https://astexplorer.net/#/)

JS生态里，基于 AST 实现功能的工具有很多，babel只是其中一个工具。其他例如：

* ESlint: 代码错误或风格的检查，发现一些潜在的错误
* IDE 的错误提示、格式化、高亮、自动补全等
* UglifyJS 压缩代码
* 代码打包工具 webpack

### ESTree AST Node

babel完整的流程，最后一步是将修改后的AST生成为js代码，即深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。

### Visitors（访问者）

当谈及“进入”一个节点，实际上是说我们在**访问**它们， 之所以使用这样的术语是因为有一个\*\*访问者模式（visitor）\*\*的概念。

visitor是一个用于 AST 遍历的跨语言的模式。 简单的说visitor就是一个**对象**，定义了用于在一个树状结构中获取具体节点的方法。例如：

```js
visitor: {
  // 变量声明函数
  VariableDeclarator(path, state) {

  }
}
```

上面AST小节示例有 **"type": "VariableDeclarator"** ，诸如此类的树节点在访问时，就会进入visitor对象声明的对应类型的成员方法。此时你访问到的不是节点本身，而是一个Path，所以可以追踪树的父节点等其它信息。

常用写法是取path.node，如上即取到type = VariableDeclarator 的对象

举个栗子：

```js
// 设定一个访问者对象
const visitor = {
  Identifier(path) {
    console.log("Visiting: " + path.node.name);
  }
};
```

```js
// 声明js代码
a + b + c;
```

```json
// js编译成ast
{
  "type": "Program",
  "start": 0,
  "end": 10,
  "body": [
    {
      "type": "ExpressionStatement",
      "start": 0,
      "end": 10,
      "expression": {
        "type": "BinaryExpression",
        "start": 0,
        "end": 9,
        "left": {
          "type": "BinaryExpression",
          "start": 0,
          "end": 5,
          "left": {
            "type": "Identifier",
            "start": 0,
            "end": 1,
            "name": "a"
          },
          "operator": "+",
          "right": {
            "type": "Identifier",
            "start": 4,
            "end": 5,
            "name": "b"
          }
        },
        "operator": "+",
        "right": {
          "type": "Identifier",
          "start": 8,
          "end": 9,
          "name": "c"
        }
      }
    }
  ],
  "sourceType": "module"
}
```

```js
// 运行后打印结果：
Visiting: a
Visiting: b
Visiting: c
```

js声明后被编译成AST，AST被访问时，Identifier类型有3次，执行visitor对象的Identifier成员方法3次，打印对应日志

### Babel API

#### babylon

Babylon 是 Babel 的解析器，作用是把js字符串解析成AST

```
$ npm install --save babylon
```

```js
import * as babylon from "babylon";
const code = `function square(n) {
  return n * n;
}`;
babylon.parse(code);
// Node {
//   type: "File",
//   start: 0,
//   end: 38,
//   loc: SourceLocation {...},
//   program: Node {...},
//   comments: [],
//   tokens: [...]
// }
```

#### babel-traverse

Babel Traverse（遍历）模块维护了整棵树的状态，并且负责替换、移除和添加节点。就是触发访问者(Visitors)的步骤

```
$ npm install --save babel-traverse
```

遍历更新节点：

```js
// 把变量 n 改成 x
import * as babylon from "babylon";
import traverse from "babel-traverse";
const code = `function square(n) {
  return n * n;
}`;
const ast = babylon.parse(code);
traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
```

#### babel generator

Babel Generator模块是 Babel 的代码生成器，它读取AST并将其转换为代码和源码映射（sourcemaps）

```
$ npm install --save babel-generator
```

通过visitors处理后的AST再转成js

```js
import * as babylon from "babylon";
import generate from "babel-generator";
import traverse from "babel-traverse";
const code = `function square(n) {
  return n * n;
}`;
const ast = babylon.parse(code);
traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
generate(ast, {}, code);
// {
//   code: "...",
//   map: "..."
// }
```

### 项目中实践

#### 引用自定义的babel插件

babel-core版本是6.x的，vue项目有.babelrc文件，在plugins属性里直接配置路径即可，如下babelPluginConsole：

```json
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "stage-2"
  ],
  "plugins": ["transform-vue-jsx", "transform-runtime", "./src/plugins/babel/babelPluginConsole"]
}
```

其他版本的babel也一个思路，找到plugins配置位置，对应加入即可。

#### 新增插件js文件

如上配置，我们在 `/src/plugins/babel/`  路径下新建 `babelPluginConsole.js`

```js
module.exports = function(babel) {
  let t = babel.types;
  return {
    visitor: {
  		// todo      
    }
  };
};
```

#### 确定要实现的功能，编译成AST进行分析

这里我们对console.log()进行处理，默认打印变量名，如下：

```js
let test = 'hi babel'
console.log(test);
//打印： test hi babel
```

所以我们将`console.log(test)`和`console.log('test',test);` 解析成AST进行比较

```json
{
  "type": "Program",
  "start": 0,
  "end": 67,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 21,
      "declarations": [
       // 变量定义的AST，忽略
      ],
      "kind": "let"
    },
    // console.log(test) 的AST
    {
      "type": "ExpressionStatement",
      "start": 22,
      "end": 40,
      "expression": {
        "type": "CallExpression",
        "start": 22,
        "end": 39,
        "callee": {
          "type": "MemberExpression",
          "start": 22,
          "end": 33,
          "object": {
            "type": "Identifier",
            "start": 22,
            "end": 29,
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "start": 30,
            "end": 33,
            "name": "log"
          },
          "computed": false,
          "optional": false
        },
        "arguments": [
          {
            "type": "Identifier",
            "start": 34,
            "end": 38,
            "name": "test"
          }
        ],
        "optional": false
      }
    },
    // console.log('test', test) 的AST
    {
      "type": "ExpressionStatement",
      "start": 41,
      "end": 67,
      "expression": {
        "type": "CallExpression",
        "start": 41,
        "end": 66,
        "callee": {
          "type": "MemberExpression",
          "start": 41,
          "end": 52,
          "object": {
            "type": "Identifier",
            "start": 41,
            "end": 48,
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "start": 49,
            "end": 52,
            "name": "log"
          },
          "computed": false,
          "optional": false
        },
        "arguments": [
          {
            "type": "Literal",
            "start": 53,
            "end": 59,
            "value": "test",
            "raw": "'test'"
          },
          {
            "type": "Identifier",
            "start": 61,
            "end": 65,
            "name": "test"
          }
        ],
        "optional": false
      }
    }
  ],
  "sourceType": "module"
}
```

比较后发现，arguments属性多了一个字符串对象。所以我们要做的就是，获取`console.log(test)`的AST然后定位到arguments数组，给它添加一个对象。

#### 编写和调试插件

按上述分析，得到如下一种解决逻辑

```js
module.exports = function(babel) {
  let t = babel.types;
  return {
    visitor: {
      ExpressionStatement(path) {
        if (path.node && path.node.expression && path.node.expression.callee
            && path.node.expression.callee.object && path.node.expression.callee.property
            && path.node.expression.arguments 
            && path.node.expression.callee.object.name === 'console' 
            && path.node.expression.callee.property.name === 'log') {
          if (path.node.expression.arguments[0].type === 'Identifier') {
            path.node.expression.arguments = [t.stringLiteral(path.node.expression.arguments[0].name), ...path.node.expression.arguments]
            console.log('path.node.expression.arguments2', path.node.expression.arguments);
          }
        }
      },      
    }
  };
};

```

#### 注意

* 插件实现的逻辑非常灵活，可以使用自带的方法处理节点，也可以使用推荐的babel插件处理节点，如[babel-template](https://link.juejin.cn)
* visitor访问的是所有的节点，vue框架下，npm run后每次修改逻辑，热响应都会执行visitor的成员方法
* 插件本身的逻辑修改，需要重新npm run才能响应

### 额外说明polyfill

首先我们来理清楚这三个概念:

* 最新`ES`语法，比如：箭头函数，`let/const`
* 最新`ES Api`，比如`Promise`
* 最新`ES`实例/静态方法，比如`String.prototype.include`

`babel-prest-env`仅仅只会转化最新的`es`语法，并不会转化对应的`Api`和实例方法,比如说`ES 6`中的`Array.from`静态方法。

一些内置方法模块，仅仅通过`preset-env`的语法转化是无法进行识别转化的，所以就需要一系列类似”垫片“的工具进行补充实现这部分内容的低版本代码实现。这就是所谓的`polyfill`的作用。

### 其他插件案例

#### 箭头函数转换插件

```js
const babelTypes = require('@babel/types');

function ArrowFunctionExpression(path) {
  const node = path.node;
  hoistFunctionEnvironment(path);
  node.type = 'FunctionDeclaration';
}

/**
 * @param {*} nodePath 当前节点路径
 */
function hoistFunctionEnvironment(nodePath) {
  // 往上查找 直到找到最近顶部非箭头函数的this p.isFunction() && !p.isArrowFunctionExpression()
  // 或者找到跟节点 p.isProgram()
  const thisEnvFn = nodePath.findParent((p) => {
    return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram();
  });
  // 接下来查找当前作用域中那些地方用到了this的节点路径
  const thisPaths = getScopeInfoInformation(thisEnvFn);
  const thisBindingsName = generateBindName(thisEnvFn);
  // thisEnvFn中添加一个变量 变量名为 thisBindingsName 变量值为 this
  // 相当于 const _this = this
  thisEnvFn.scope.push({
    // 调用babelTypes中生成对应节点
    // 详细你可以在这里查阅到 https://babeljs.io/docs/en/babel-types
    id: babelTypes.Identifier(thisBindingsName),
    init: babelTypes.thisExpression(),
  });
  thisPaths.forEach((thisPath) => {
    // 将this替换称为_this
    const replaceNode = babelTypes.Identifier(thisBindingsName);
    thisPath.replaceWith(replaceNode);
  });
}

/**
 * 查找当前作用域内this使用的地方
 * @param {*} nodePath 节点路径
 */
function getScopeInfoInformation(nodePath) {
  const thisPaths = [];
  // 调用nodePath中的traverse方法进行便利
  // 你可以在这里查阅到  https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md
  nodePath.traverse({
    // 深度遍历节点路径 找到内部this语句
    ThisExpression(thisPath) {
      thisPaths.push(thisPath);
    },
  });
  return thisPaths;
}

/**
 * 判断之前是否存在 _this 这里简单处理下
 * 直接返回固定的值
 * @param {*} path 节点路径
 * @returns
 */
function generateBindName(path, name = '_this', n = '') {
  if (path.scope.hasBinding(name)) {
    generateBindName(path, '_this' + n, parseInt(n) + 1);
  }
  return name;
}

module.exports = {
  hoistFunctionEnvironment,
  arrowFunctionPlugin: {
    visitor: {
      ArrowFunctionExpression,
    },
  },
};

```

#### 基础版本webpack

1）从入口文件开始解析
2）查找入口文件引入了哪些js文件，找到依赖关系
3）递归遍历引入的其他js，生成最终的依赖关系图谱
4）同时将ES6语法转化成ES5
5）最终生成一个可以在浏览器加载执行的 js 文件

示例代码：[https://github.com/xy-sea/blog/blob/dev/mini-webpack/minipack.js](https://github.com/xy-sea/blog/blob/dev/mini-webpack/minipack.js)

fs工具地址：[https://www.npmjs.com/package/fs-extra](https://www.npmjs.com/package/fs-extra)

path工具api：[https://nodejs.org/docs/latest/api/path.html](https://nodejs.org/docs/latest/api/path.html)

```js
const fs = require('fs');
const path = require('path');
// babylon解析js语法，生产AST 语法树
// ast将js代码转化为一种JSON数据结构，ast 解析 https://astexplorer.net/ , ast教程 https://segmentfault.com/a/1190000017992387
const babylon = require('babylon');
// babel-traverse是一个对ast进行遍历的工具, 对ast进行替换
const traverse = require('babel-traverse').default;
// 将es6 es7 等高级的语法转化为es5的语法
const { transformFromAst } = require('babel-core');

// 每一个js文件，对应一个id
let ID = 0;

// filename参数为文件路径, 读取内容并提取它的依赖关系
function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');

  // 获取该文件对应的ast 抽象语法树
  const ast = babylon.parse(content, {
    sourceType: 'module'
  });

  // 这个数组将保存这个模块依赖的模块的相对路径
  const dependencies = [];

  // 通过查找import节点，找到该文件的依赖关系
  // 因为项目中我们都是通过 import 引入其他文件的，找到了import节点，就找到这个文件引用了哪些文件
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      // 查找import节点
      dependencies.push(node.source.value);
    }
  });

  // 通过递增简单计数器为此模块分配唯一标识符, 用于缓存已解析过的文件
  const id = ID++;
  // 该`presets`选项是一组规则,告诉`babel`如何传输我们的代码.
  // 用`babel-preset-env`将代码转换为浏览器可以运行的东西.
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  });

  // 返回有关此模块的信息
  return {
    id, // 文件id
    filename, // 文件路径
    dependencies, // 文件的依赖关系
    code // 文件的代码
  };
}

// 我们将提取它的每一个依赖关系的依赖关系. 循环下去,找到对应这个项目的`依赖图`.
function createGraph(entry) {
  // 得到入口文件的依赖关系
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.mapping = {};
    // 获取这个模块所在的目录
    const dirname = path.dirname(asset.filename);
    asset.dependencies.forEach((relativePath) => {
      // 通过将相对路径与父资源目录的路径连接,将相对路径转变为绝对路径
      // 每个文件的绝对路径是固定、唯一的
      const absolutePath = path.join(dirname, relativePath);
      // 递归解析，其中所引入的其他资源
      const child = createAsset(absolutePath);
      asset.mapping[relativePath] = child.id;
      // 将`child`推入队列, 通过递归实现了这样它的依赖关系解析
      queue.push(child);
    });
  }

  // queue这就是最终的依赖关系图谱
  return queue;
}

// 自定义实现了require 方法，找到导出变量的引用逻辑
function bundle(graph) {
  let modules = '';
  graph.forEach((mod) => {
    modules += `${mod.id}: [
      function (require, module, exports) { ${mod.code} },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });
  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];
        function localRequire(name) {
          return require(mapping[name]);
        }
        const module = { exports : {} };
        fn(localRequire, module, module.exports); 
        return module.exports;
      }
      require(0);
    })({${modules}})
  `;
  return result;
}

// 项目的入口文件
const graph = createGraph('./example/entry.js');
const result = bundle(graph);

// 创建dist目录，将打包的内容写入main.js中
fs.mkdir('dist', (err) => {
  if (!err)
    fs.writeFile('dist/main.js', result, (err1) => {
      if (!err1) console.log('打包成功');
    });
});
```

### 附录

| 类型原名称                     | 中文名称      | 描述                                         |
| ------------------------- | --------- | ------------------------------------------ |
| Program                   | 程序主体      | 整段代码的主体                                    |
| VariableDeclaration       | 变量声明      | 声明一个变量，例如 var let const                    |
| `FunctionDeclaration`     | 函数声明      | 声明一个函数，例如 function                         |
| ExpressionStatement       | 表达式语句     | 通常是调用一个函数，例如 console.log()                 |
| BlockStatement            | 块语句       | 包裹在 {} 块内的代码，例如 if (condition){var a = 1;} |
| BreakStatement            | 中断语句      | 通常指 break                                  |
| ContinueStatement         | 持续语句      | 通常指 continue                               |
| ReturnStatement           | 返回语句      | 通常指 return                                 |
| SwitchStatement           | Switch 语句 | 通常指 Switch Case 语句中的 Switch                |
| IfStatement               | If 控制流语句  | 控制流语句，通常指 if(condition){}else{}            |
| Identifier                | 标识符       | 标识，例如声明变量时 var identi = 5 中的 identi        |
| CallExpression            | 调用表达式     | 通常指调用一个函数，例如 console.log()                 |
| BinaryExpression          | 二进制表达式    | 通常指运算，例如 1+2                               |
| MemberExpression          | 成员表达式     | 通常指调用对象的成员，例如 console 对象的 log 成员           |
| ArrayExpression           | 数组表达式     | 通常指一个数组，例如 \[1, 3, 5]                      |
| `FunctionExpression`      | 函数表达式     | 例如const func = function () {}              |
| `ArrowFunctionExpression` | 箭头函数表达式   | 例如const func = ()=> {}                     |
| `AwaitExpression`         | await表达式  | 例如let val = await f()                      |
| `ObjectMethod`            | 对象中定义的方法  | 例如 let obj = { fn () {} }                  |
| NewExpression             | New 表达式   | 通常指使用 New 关键词                              |
| AssignmentExpression      | 赋值表达式     | 通常指将函数的返回值赋值给变量                            |
| UpdateExpression          | 更新表达式     | 通常指更新成员值，例如 i++                            |
| Literal                   | 字面量       | 字面量                                        |
| BooleanLiteral            | 布尔型字面量    | 布尔值，例如 true false                          |
| NumericLiteral            | 数字型字面量    | 数字，例如 100                                  |
| StringLiteral             | 字符型字面量    | 字符串，例如 vansenb                             |
| SwitchCase                | Case 语句   | 通常指 Switch 语句中的 Case                       |

### 参考资料地址

babel-type api：[https://www.npmjs.com/package/babel-types](https://www.npmjs.com/package/babel-types)

在线js转换到AST工具：[https://astexplorer.net/#/](https://astexplorer.net/#/)

babel官网：[https://www.babeljs.cn/docs/](https://www.babeljs.cn/docs/)

AST说明：[https://zhaomenghuan.js.org/blog/js-ast-principle-reveals.html](https://zhaomenghuan.js.org/blog/js-ast-principle-reveals.html)

babel指南手册：[https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-introduction](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-introduction)

babel插件开发相关文章：[https://juejin.cn/post/7155434131831128094#heading-7](https://juejin.cn/post/7155434131831128094#heading-7)
