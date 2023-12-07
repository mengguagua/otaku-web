---
title: linux工具安装步骤
resume: 怎么安装使用mysql / 怎么安装node
time: 2023-12-06T16:00:00.000Z
---

author：gaocc    /     time：2023-11-20

## 安装mysql

参考文章：
[https://blog.csdn.net/u013733643/article/details/128970496](https://blog.csdn.net/u013733643/article/details/128970496)
[http://blog.java1234.com/blog/articles/308.html](http://blog.java1234.com/blog/articles/308.html)

### 1、下载mysql

下载地址：[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)

当前服务器是：Linux version 3.10.0-1160.92.1.el7.x86\_64 ([mockbuild@kbuilder.bsys.centos.org](mailto:mockbuild@kbuilder.bsys.centos.org)) (gcc version 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC) ) #1 SMP Tue Jun 20 11:48:01 UTC 2023

对应选择mysql版本：

5.7.44
Red Hat Enterprise Linux / Oracle Linux
Red Hat Enterprise Linux 7  Oracle Linux 7 (x86, 64-bit)
RPM Bundle

![](/img2.png)

### 2、上传到服务器

ssh远程登录服务器后，使用rz，sz命令下载，上传文件。下载命令：

```shell
# 安装工具
yum -y install lrzsz
# 上传
rz // 会弹框让你选择本机要上传的文件，这里选mysql rpm.tar包
```

### 3、安装依赖包

```shell
# rpm 的安装依赖于该插件
yum install openssl-devel
# 解压后有以下安装包
-rw-r--r-- 1 7155 31415  32675564 10月 12 20:14 mysql-community-client-5.7.44-1.el7.x86_64.rpm
-rw-r--r-- 1 7155 31415    320884 10月 12 20:14 mysql-community-common-5.7.44-1.el7.x86_64.rpm
-rw-r--r-- 1 7155 31415   4969564 10月 12 20:15 mysql-community-devel-5.7.44-1.el7.x86_64.rpm
-rw-r--r-- 1 7155 31415  48598388 10月 12 20:15 mysql-community-embedded-5.7.44-1.el7.x86_64.rpm
-rw-r--r-- 1 7155 31415  23315956 10月 12 20:15 mysql-community-embedded-compat-5.7.44-1.el7.x86_64.rpm
-rw-r--r-- 1 7155 31415 134443120 10月 12 20:15 mysql-community-embedded-devel-5.7.44-1.el7.x86_64.rpm
-rw-r--r-- 1 7155 31415   3093304 10月 12 20:15 mysql-community-libs-5.7.44-1.el7.x86_64.rpm
-rw-r--r-- 1 7155 31415   1266600 10月 12 20:15 mysql-community-libs-compat-5.7.44-1.el7.x86_64.rpm
-rw-r--r-- 1 7155 31415 193071528 10月 12 20:15 mysql-community-server-5.7.44-1.el7.x86_64.rpm
-rw-r--r-- 1 7155 31415 128934768 10月 12 20:15 mysql-community-test-5.7.44-1.el7.x86_64.rpm
# 要按照以下顺序安装，若不是也有报错提示哪个需要先安装
rpm -ivh mysql-community-common-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-compat-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-devel-5.7.44-1.el7.x86_64.rpm
# 本示例这处报错缺少依赖libaio。所以额外再安装：yum install -y libaio
rpm -ivh mysql-community-server-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-embedded-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-embedded-compat-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-embedded-devel-5.7.44-1.el7.x86_64.rpm
```

### 4、启动mysql/设置密码/设置开机重启/远程登录

```shell
# 启动
systemctl start mysqld
# 重启
# systemctl restart mysqld
# 关闭
# systemctl stop mysqld
# 打印日志文件，第一次启动会有默认登录密码。搜索password，是一个复杂密码
cat /var/log/mysqld.log
# 登录mysql + 修改密码
mysql -u root -p
# Enter password: 密码不可见的
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '这是自定义密码';
# 修改开机自动启动mysql
systemctl enable mysqld
systemctl daemon-reload
# 设置可以远程登录
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'Gcc@163.com' WITH GRANT OPTION;
Query OK, 0 rows affected, 1 warning (0.00 sec)

```

> 以上设置后，还是显示远程连接失败的话，就要考虑端口是否开通。本示例服务是云服务，在对应控制台开启**3306端口安全组**。

### 5、其它问题

1、修改语句时候，插入中文，提示错误，且使用mysql可视化工具设置表为utf-8也不生效。

问题原因：创建数据库时候没有选utf8mb4，后续所有表就都不是utf8mb4

```sql
ALTER TABLE 表名 CONVERT TO CHARACTER SET utf8mb4;
```

## 安装node

### 1、是否有wget下载工具

```shell
rpm -qa|grep wget
```

### 2、创建文件夹/下载压缩包

```shell
mkdir node
cd node
wget https://npm.taobao.org/mirrors/node/v14.17.0/node-v14.17.0-linux-x64.tar.gz
```

### 3、解压文件/创建软链接

```shell
tar -zxvf node-v14.17.0-linux-x64.tar.gz
cd node-v14.17.0-linux-x64/bin/
# node/npm软链接，使可以全局用node/npm指令
ln -s /root/node/node-v14.17.0-linux-x64/bin/node /usr/local/bin/node
ln -s /root/node/node-v14.17.0-linux-x64/bin/npm /usr/local/bin/npm
# 查看版本
node -v
npm -v
```
