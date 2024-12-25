---
title: 浏览器内核逻辑讲解
resume: 描述浏览器的主要功能，即浏览器是如何渲染的，html解释器，css解释器，布局(layout)，js引擎工作逻辑。其它还有绘图模块，网络等。
time: 2023-12-07T16:00:00.000Z
---

# 浏览器内核逻辑讲解

auth：gaocc    time：2023-08-02

## 浏览器的主要功能

![](/webBrowser/img3.png)

如上图，浏览器的主要功能就是加载资源，把页面转变成`可视化图像`

## 浏览器渲染引擎

![](/webBrowser/img4.png)

如上图，这是前端最需要关心的部分，即浏览器是如何渲染的。渲染引擎主要包括html解释器，css解释器，布局(layout)，js引擎。其它还有绘图模块，网络等。

### 浏览器渲染过程

![](/webBrowser/img5.png)

上图是一般情况下的渲染过程和依赖的模块，虚线箭头是指渲染过程中可能用到的其他模块。

渲染完成后，存在用户交互或者页面动画，所以这个过程是持续重复进行的。具体过程如下：

#### url到dom树

![](/webBrowser/img6.png)

上图是从url请求到形成dom树的过程，数字表示基本顺序，不是严格顺序，可能交叉和重复。

1、用户输入url，webkit调用资源加载器，加载url对应的资源

2、加载器依赖网络模块建立连接，发起请求并接收响应

3、webkit接收各种资源(js，css等)，这些资源可能是同步或者异步获取的

4、html解释器根据词语构建节点(node)，形成DOM树

5、js代码可能会修改DOM树

6、DOM树创建过程中，遇到js资源URL，并且没有标记是异步js标签，则暂停DOM树创建，并加载js资源，并在js引擎执行完逻辑后再继续创建DOM树。(DOM树创建暂停原因是上面第5步)

> 暂停创建DOM树不代表，不会加载html文件的js代码下方的内容，如谷歌浏览器就会通过机制异步加载资源

#### css和dom树到绘图上下文

![](/webBrowser/img7.png)

1、css被css解释器翻译成内部表示结构

2、在DOM树上附加解释后的样式信息，即称为RenderObject树

3、webkit根据网页的层次结构创建RenderLayer树，并同时创建虚拟的绘图上下文

> tip: RenderLayer树创建，不代表DOM树会销毁，事实上上面的四个结果会一直存在，直到页面被销毁

#### 绘图上下文到最终图像

![](/webBrowser/img8.png)

1、绘图上下文是一个平台无关的抽象类，各种绘图操作通过具体的实现类完成（这些实现类由移植平台实现，如谷歌，safari）

2、绘图实现类，以chromium为例，实现很复杂，需要chromium合成器来实现多进程，以及需要GPU（3D效果）来实现加速机制

3、绘图实现类将2d图形库和3d图形库绘制的结果保存下来，给浏览器界面进行展示

### webkit是什么

![](/webBrowser/img9.png)

广义上说是指代webkit这个开源项目，狭义上是指上图的webkit嵌入式接口(api)，它是在webcore和js引擎基础上的一层绑定和嵌入式编成接口，可以给各种浏览器调用。一般webkit都是指广义上的全部的功能。

> webcore就是指渲染引擎，如html解释器，css解释器

### chromium是什么

谷歌实现方案，内核是Blink，Blink是从webkit代码库分支出来的项目。(阅读这部分是因为下面更细致的渲染过程说明是基于chromium)

![](/webBrowser/img10.png)

上图是chromium架构图，Blink只占了小部分。这个架构的特殊是多了Content层和Content api层。拥有webkit，我们已经可以实现将资源渲染成可视化的页面。拥有Content层后，可以获得沙箱模式，跨进程的GPU硬件加速，html5新特性等内容。

#### chromium多进程架构

单进程问题：浏览器打开页面a，b，c，页面b卡顿崩溃，会连带着页面a，c也一起崩溃。

多进程好处：1、避免单个页面崩溃，影响浏览器的稳定性。2、避免第三方插件(拓展)崩溃影响浏览器稳定性，因为第三方插件也是单独进程。3、有利于实现安全模式，如下图：

![](/webBrowser/img11.png)

上图每个方块表示进程，连接线表示进程之间的交互。

> 既然是多进程，是不是代表一个页面就一定是一个进程？答：不是，chromium支持灵活的可选配置，如支持process-per-site即同一个域的网页共享一个进程。

多进程栗子：下图是mac系统打开两个谷歌浏览器和多个标签页的活动监视。

![](/webBrowser/img12.png)

可以看到chrome GPU只有一个进程，chrome Renderer有多个。

#### Browser进程和Renderer进程

在`chromium多进程架构`时候看到，浏览器和渲染是两个进程，且这两个进程都是在webkit(blink)之外的，所以这里描述下chromium多进程架构是怎么和webkit(blink)交互的。如下图：

![](/webBrowser/img13.png)

下面3层是Renderer进程，上面3层是Browser进程。最下面一层是用来对接webkit接口的，一般不是多进程架构的浏览器(早起的safari)，直接就在这一层上实现业务。所以从下往上依次作用是：

1、对接webkit接口。

2、桥接chromium和webkit部分不同的实现逻辑。

3、处理进程通信，即接收Browser进程请求和调用webkit接口并处理返回，最后再返回给Browser进程。

4、处理Renderer进程之间通信，即向Renderer进程发送请求和接受请求

5、网页内容，包含子窗口如弹框

6、用户界面

#### chromium多线程

![](/webBrowser/img14.png)

如上图，一个进程通过多线程实现高效渲染或者用户事件响应。

多线程可以保证UI线程(Browser进程的主线程)，不会被其它费时的操作阻碍，如本地文件读写。同理在Renderer进程中，渲染线程也不会被其它操作阻止。

甚至chromium会把渲染过程分解为很多独立的阶段，每个阶段创建一个新线程，从而利用cpu多核能力，加速渲染，提高并发性。

多线程栗子：下图是mac系统的其中一个chrom进程的线程示例

![](/webBrowser/img15.png)

### ------分割线 下面是渲染的具体描述 分割线------

### 资源加载机制

![](/webBrowser/img16.png)

渲染过程的第一步是下载html和html中的资源。

webkit使用上图的不同的类来表示静态资源(html，js，css，图片，视频音频字幕，字体文件等)，其中公共的基类是CachedResource。

基类以Cached开头是因为：webkit为了提高资源使用效率有一套缓存机制，如下图。

![](/webBrowser/img17.png)

大致过程是发起资源请求后，webkit从资源缓存池判断是否存在，存在则取出资源，不存在则webkit创建一个CachedResource的子类对象，并发送请求给服务器，webkit收到请求后把资源放置到该子类里，以方便下次从缓存中获取。(这里的缓存指内存，而不是磁盘缓存)

具体到代码，webkit有三类加载器，1每种特定资源的特定加载器；2资源缓存机制的资源加载器；3通用的资源加载器。调用过程如下图：

![](/webBrowser/img18.png)

比如image标签的src属性，url是一个有效值，则先通过图片特定加载器ImageLoader加载，然后通过CacheResourcLoader缓存资源加载器判断是否有缓存，最后使用通用加载器ResourceLoader加载器触发远程请求获取资源。

> 如果资源加载主线程，遇到js资源，导致堵塞，webkit会怎么处理？答：主线程被阻塞时，webkit会再新开一个线程，去遍历html后面的内容，收集需要资源请求的url，并发出请求，避免阻塞。网络请求模块的主要实现是在webkit吗？答：不是，见上图，ResourceHandleInterna是chromium架构里额外实现的，主要是处理http协议，DNS(域名)解析。

上面提到资源池，资源缓存不能无限大，也不一定是最新资源，需要判断何时更新，如何更新。

webkit的处理方式是：首先判断资源是否在缓存中，如果是则发起一个请求，通过http协议告诉后端服务器资源信息，如修改时间，服务器自行判断是否需要更新资源，若不需要就返回304状态码，告诉客户端可以使用缓存数据。

### 资源字节流转换成DOM树

#### DOM定义

Document Object Model，翻译为`文档对象模型`，这是一个工具，用来修改`文档`的内容和结构。在web前端，文档指HTML，开发者通过js语言来访问，创建，删除和修改DOM，以实现动态修改HTML的目的。

DOM这个工具是一个树形结构的对象，提供一系列api，供js来动态访问和修改html结构。

#### 基本转换过程

![](/webBrowser/img19.png)

上图是html解释器将资源从字节流解释成DOM树的主要过程。

![](/webBrowser/img20.png)

上图是字节流解释成DOM树的时序图，这个比较复杂，下面做解释。

1、 先是在`资源加载机制`时提到过的ResourceLoader 类和 CachedRawResource 类在收到网络栈的数据后调用 DocumentLoader 类的“commitData”方法

2、然后 DocumentWriter 类会创建一个根节点 HTMLDocument 对象

3、然后DocumentWriter将数据“append”输送到 HTMLDocumentParser对象（在步骤4之前会有解码器将字节流转成字符流）

4、HTMLDocumentParser是一个管理对象，使用HTMLTokenizer词法分析器将字符流翻译成`词语`

5、这些`词语`XSSAuditor完成安全检查

6、安全检查后的内容输出给HTMLTreeBuilder，它将`词语`转换成一个个节点对象（通过`词语`带有的`词语类型`(如DOCTYPE、StartTag等)来实现）

7、最后HTMLConstructionSite将节点组合成一个DOM树

![](/webBrowser/img21.png)

上图是chromium的多进程和多线程模式下，html解释器的变化。

由于DOM树只能在渲染主线程上访问和创建，所以步骤6，7不能分割。但步骤3，4，5可以交给多个线程去处理，将处理完的`词语`放在队列里由渲染线程分批次的处理，提高解析速度。

### DOM树->RenderObject树->RenderLayers树->绘图上下文->页面展示

#### DOM树转化到RenderObject树

![](/webBrowser/img22.png)

如上图是css内部结构的主要类，这个过程起源是从 DOM 中的 Document 类开始。

1、先看 Document 类之外的左上部分:包括一个 DocumentStyleSheetCollection 类，该类包含了所有 CSS 样式表;还包括 WebKit 的内部表示类 CSSStyleSheet，它包含 CSS 的 href、类型、内容等信息。

2、CSS 的内容就是样式信息 StyleSheetContents，包含了一个`样式规则(StyleRuleBase)列表`。

> 样式规则被用在 CSS 的解释器的工作过程中。

3、StyleSheetResolver 类，它属于 Document 类，并包含了一个 DocumentRuleSets 类，用来表示多个规则集合(RuleSet)。每个规则集合都是将之前解释之后的结果合并起来,并进行分类，例如 id 类规则、标签类规则等。

> 第3部分目的是， WebKit 将解释之后的`样式规则`组织起来，用于为 DOM 中的元素匹配相应的规则，从而应用到规则中的属性值

![](/webBrowser/img23.png)

这里额外解释`StyleSheetContents`是怎么被css解释器处理的。

如上图是css解释器过程，是将css字符串转化成渲染引擎内部规则（`样式规则`）的过程。

这一过程并不复杂，基本的思想是由 CSSParser 类负责。

CSSParser 类其实也是桥接类，实际的解释工作是由 CSSGrammer.y.in 来完成。CSSGrammer.y.in 是 Bison的输入文件，Bison 是一个生成解释器的工具。Bison 根据 CSSGrammer.y.in 生成 `CSS解释器`--CSSGrammer 类。

当然 CSSGrammer 类需要调用 CSSParser 类来处理解释结果，例如需要使用 CSSParser 类创建选择器对象、属性、规则等。

总结来说：当 WebKit 需要解释 CSS 内容的时候，它调用CSSParser 对象来设置 CSSGrammer 对象等, 解释过程中需要的回调函数由 CSSParser来负责处理，最后 WebKit 将创建好的结果直接设置到 StvleSheetContents 对象中，这过程显得直接而且简单。

![](/webBrowser/img24.png)

这里额外解释`StyleResolver`是怎么把转化后到样式规则和具体dom节点联系起来。

如上图是样式规则匹配相关类。

基本的思路是使用StyleResolver 类来为 DOM 的元素节点匹配样式。StyleResolver 类根据元素的信息，例如标签名、类别等，从样式规则中查找`最匹配的规则`，然后将样式信息保存到新建的RenderStyle 对象中。最后，这些 RenderStyle 对象被 `RenderObiect` 类所管理和使用。

> 具体最匹配的规则由ElementRuleCollector处理，一般就是指html的id，类，标签等选择器优先级处理

众多`RenderObiect`对象一起形成一个树结构就是`RenderObiect树`。

![](/webBrowser/img25.png)

如上图是Dom树节点和RenderObject树的对应关系。

可见，非可视化节点不会生成对应的渲染树节点，如上图head节点。

#### RenderObject树转化到RenderLayer树

![](/webBrowser/img26.png)

![](/webBrowser/img27.png)

上图是一个布局计算的过程，RenderObject有个`layout`的函数，判断每一个节点，是否要计算布局，完成布局，最终形成RenderLayer树。

并且RenderLayer节点和RenderObject节点不是一对一关系，是一对多关系。

#### RenderLayer树到绘图上下文

Webkit绘图上下文分两类，一个是2D，一个是3D。并且这两个都是`抽象父类`，没有具体实现，因为他需要被适配，如safari和chromium，所以具体实现是在更上层的移植平台。

绘图上下文2D，作用是规定绘制图的接口如点，线，图片，多边形，文章；绘制图的样式如颜色，线宽，字号，渐变。

RenderLayer可以想象是图像的一个层，多个层组成一个页面图像，绘图上下文通过RenderLayer表示的信息去渲染。

具体过程如下图：

![](/webBrowser/img28.png)

1、对于当前的 RenderLayer 对象而言,WebKit 首先绘制反射层(Reflectionlayer),这是由 CSS 定义的。

2、然后 WebKit 开始绘制 RenderLayer 对象对应的 RenderObject 节点的背景层(PaintBackground- ForFragments)，也就是调用“PaintPhaseBlockBackground函数，这里仅是绘制该对象的背景层，而不包括 RenderObject 的子女。

> 其中名字带“Fragments”的含义是可能绘制的几个区域，因为网页需要更新的区域可能不是连续的，而是多个小块，所以 WebKit 绘制的时候需要更新这些非连续的区域即可，下面方法带‘Fragments’也是一样的道理。

3、图中的“paintList”(z 标为负数的子女层)阶段负责绘制很多Z标为负数的子女层。这是一个递归过程。

> Z 坐标为负数的层在当前 RenderLayer 对象层的后面，所以 WebKit 先绘制后面的层，当前 RenderLayer 对象层可能覆盖它们。

4、图中“PaintForegroundForFragments”这个步骤比较复杂，包括以下四个子阶段:

* 先进入“PaintPhaseChildBlockBackground”阶段，WebKit 绘制RenderLayer 节点对应的 RenderObiect 节点的`所有后代节点的背景`，如果某个被选中的话，WebKit 改为绘制选中区域背景(网页内容选中的时候可能是另外的颜色);
* 其次，进入“PaintPhaseFloat”绘制阶段，WebKit 绘制浮动的元素;
* 再次，进入“PaintPhaseForeground”阶段，WebKit 绘制 RenderObject 节点的内容和后代节点的内容(如文字等);
* 最后,进入“PaintPhaseChildOutlines绘制阶段，WebKit 的目的是绘制所有后代节点的轮廓（一种css的样式）。

5、进入“PaintOutlineForFragments”步骤。WebKit 在该步骤中绘制 RenderLayer对象对应的 RenderObiect 节点的轮廓 (PaintPhaseOutline)。

6、进入绘制 RenderLayer 对象的子女步骤。WebKit 首先绘制溢出(Overflow)的 RenderLayer 节点，之后依次绘制 Z坐标为正数的 RenderLayer 节点。

7、进入该 RenderObject 节点的滤镜步骤。这是 CSS 标准定义在元素之上的最后一步。（所以滤镜的样式会覆盖其它样式）

这样就处理了一个层的图像，但其实一个页面会有多个层，所以还有一个`合成`的步骤(这个步骤很快，不耗时)。

#### 绘图上下文到页面展现

最后，webkit的渲染结果一般是存在cpu内存，形成一个[**位图**（**Bitmap**）](https://baike.baidu.com/item/Bitmap/6493270?fr=ge_ala)，至于位图如何显示出来，看具体的移植平台，如chromium，作为一个多进程软件，渲染过程大致是这样的:

![](/webBrowser/img29.png)

1、渲染进程的RenderWidget类接收到更新请求时，Chromium 创建一个`共享内存区域`。

> RenderWidget负责页面渲染和页面更新

2、然后 Chromium 创建 Skia的 SkCanvas 对象，绘制出实际结果的位图，放到`共享内存区域`。

> Skia是一个2D渲染库，完成实际绘制操作和绘制结果

3、浏览器进程的RenderWidgetHost 类通过`共享内存区域`把位图信息复制到 BackingStore 对象的相应区域中，并调用“Paint”函数来把结果绘制到窗口中

> RenderWidgetHost类负责和渲染进程通信，发送用户的页面请求，并获取渲染返回。BackingStore作用一：保存当前的可视结果，所以渲染进程的工作不会影响当前页面；作用二：webkit只需要变动绘制部分，其余部分在BackingStore存储空间，将变动部分更新上去就行。

## JS引擎(V8)

### js引擎介绍

![](/webBrowser/img30.png)

如上图是js代码在JavaScriptCore引擎(webkit默认)的基本执行过程，主要是4个模块

* 编译器。主要工作是将源代码编译成抽象语法树(AST)，在某些引擎中还包含将抽象语法树转换成字节码。
* 解释器。在某些引擎中，解释器主要是接收字节码，解释执行这个`字节码`(平台无关的代码)。
* JIT 工具。一个能够 JIT (just in time)的工具，将字节码或者抽象语法树转换成`本地代码`
* 垃圾回收器和分析工具。它们负责垃圾回收和收集引警中的信息，帮助改善引擎的性能和功效。

### V8引擎

v8是一个开源项目，是js引擎的实现，用c++编写，被google收购。

![](/webBrowser/img31.png)

如上图是V8引擎的基本执行过程，相比JavaScriptCore，直接通过JIT生成了本地代码，跳过了字节码的中间过程。

> 由于V8引擎是c++编写，具体JIT实现逻辑和时序图就不探究了。
