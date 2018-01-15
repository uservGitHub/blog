---
title: Node.js源码学习(1) 使用cLion调试node.js源码
tags: 
 - node.js
category: node
summary: >
  本人近期在学习Node.js源码，并将会把学习过程、心得形成笔记。
---

## 环境准备

* 操作系统： macOS
* IDE: cLion
* 源码路径： [Node Master](https://github.com/nodejs/node)

## 本地编译

node.js是用C++写的，所以编译有以下步骤：
* ./configure  配置。软件装到哪里、什么参数、什么os、装什么东西，全都是configure来确定的
* make  编译。make会读取makefile的配置，进行编译，生成可执行文件
* make install  安装。make install 会根据设定好的路径，把软件安装到系统中

首先是配置

进入到node目录后，执行`./configure --debug`，注意后面的--debug，一开始我没有加的试后发现断点进不去；
执行完以后会生成以下文件：
```bash
|____cctest.target.mk
|____gyp-mac-tool
|____Makefile
|____mkssldef.target.mk
|____node.target.mk
|____node_dtrace_header.target.mk
|____node_dtrace_provider.target.mk
|____node_dtrace_ustack.target.mk
|____node_etw.target.mk
|____node_js2c.host.mk
|____node_perfctr.target.mk
|____specialize_node_d.target.mk
|____v8_inspector_compress_protocol_json.host.mk
```
这些文件应该是make编译时需要的一些参数配置

之后执行make编译，在这之前，我看到了Makefile中有这样一段注释(搜debug看到的)
```bash
# BUILDTYPE=Debug builds both release and debug builds. If you want to compile
# just the debug build, run `make -C out BUILDTYPE=Debug` instead.
```
从这段注释理解，如果我们运行`make -C out BUILDTYPE=Debug`则不会编译release代码，由于我们是本地学习使用，所以我使用
`make -C out BUILDTYPE=Debug -j 4`编译，其中-j时编译使用的进程数，用于加快编译。
编译过程时间比较久，编译完以后可以看到多了一个out目录，out/Debug目录下有个可执行的文件node，这就是我们本地编译出来的node啦。

第三步make install是安装时需要，此处可以忽略。

## 导入工程

打开IDE cLion，并导入本地的node项目，打开Run/Debug配置调试信息
<img src="/images/2018-1-15-learnnode1.jpg"/>
参照上图配置：
* 选择Executable为前面编译出来的out/Debug/node;
* Before launch中有一个build，我们要把它删掉，否则每次都会重新编译;
* Work directory选择要运行的js代码目录;
* Program arguments即为要运行的js代码。

ok，然后找到`node_main.cc`，在main方法中打断点，debug运行
<img src="/images/2018-1-15-learnnode2.jpg"/>

如图所示，我们成功进入了断点。
