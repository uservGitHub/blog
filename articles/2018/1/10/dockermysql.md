---
title: 使用docker搭建mysql服务器
tags:
  - docker
  - mysql
category: docker
summary: 本文主要记录基于docker环境搭建mysql服务器的过程，由于我的服务器上几个月前就已经安装过docker，本文不再讲解如何安装docker。
---
## 更新docker
由于之前安装的docker版本是1.12.6，现在是17+，简单做了个升级，可以参考[CentOS7升级最新版本Docker](http://blog.csdn.net/kongxx/article/details/78361048)

## 获取镜像
使用[Mysql5.7镜像](https://hub.docker.com/r/library/mysql/)
```bash
# docker pull mysql
Using default tag: latest
Trying to pull repository docker.io/library/mysql ...
latest: Pulling from docker.io/library/mysql
f49cf87b52c1: Pull complete
78032de49d65: Pull complete
837546b20bc4: Pull complete
9b8316af6cc6: Pull complete
1056cf29b9f1: Pull complete
86f3913b029a: Pull complete
4cbbfc9aebab: Pull complete
8ffd0352f6a8: Pull complete
45d90f823f97: Pull complete
ca2a791aeb35: Pull complete
Digest: sha256:1f95a2ba07ea2ee2800ec8ce3b5370ed4754b0a71d9d11c0c35c934e9708dcf1
#
```
执行`docker run --rm -i -t -v /data/mysql/master/conf:/home/test mysql /bin/bash`，
再执行`cp /etc/mysql/my.cnf /home/test`将mysql配置文件copy一份到本地后exit退出，
<br/>如果不复制此配置文件，后面启动容器时挂载此配置文件将会报错，提示my.cnf不是一个文件夹。

## 启动mysql

```bash
# cd /data/mysql/master
# docker run -p 127.0.0.1:3306:3306 --restart=always --name mysqlmaster -v $PWD/conf/my.cnf:/etc/mysql/my.cnf -v $PWD/logs:/logs -v $PWD/data:/mysql_data -e MYSQL_ROOT_PASSWORD=123456 -d mysql
60ce6e1508d69f53bdc4fcdf15cab851fac51f735533294383622acff1dc7b2b
# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
60ce6e1508d6        mysql               "docker-entrypoint..."   3 seconds ago       Up 2 seconds        0.0.0.0:3306->3306/tcp   mysqlmaster
# docker exec -it mysqlmaster /bin/bash
root@60ce6e1508d6:/# mysql -uroot -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 6
Server version: 5.7.20 MySQL Community Server (GPL)

Copyright (c) 2000, 2017, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```
最后尝试登陆mysql，启动并登陆成功。
