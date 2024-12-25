---
title: linux常用命令
resume: 一些linux常用命令，例如查看公网ip，查看内存可用，使用rz，sz命令下载，上传文件等等
time: 2023-12-06T16:00:00.000Z
---

author：gaocc / time：2022-7-20

1、查看公网ip

* curl cip.cc

2、查看内存可用

* free -h // buff/cache 是可用

3、查看内存正被使用的情况

* top -c -> shift + m -> e // 分别为查看内存，显示详情，占用内存大小转换单位

4、Finder 里跳转到指定路径

* Command + Shift + G

5、Mac 终端上传包到指定服务器，指定目录下

```
scp -p 22 /Users/gcc/gcc/java/tagcc/target/tagcc-0.0.1-SNAPSHOT.war root@122.51.129.47:/home
```

6、使用rz，sz命令下载，上传文件。下载此命令工具

```
yum -y install lrzsz
```

7、springboot 部署，打成jar包，启动jar和日志命令

```
// mvn打包，切换到工程目录下
mvn clean package
// 环境启动jar
nohup java -jar xxx.jar >temp.log &
```

8、任务管理器

* command+option+esc

9、解压rar压缩包

* unrar x 压缩文件名字

10、连接云服务，如阿里云

```
ssh -p 22 root@122.51.129.47
```

11、安装telnet

* brew install telnet

12、给sh文件读写权限

* chmod 777 \*.sh

13、安装wget

* yum -y install wget

14、redis安装

* brew install redis\@5.0 // @接版本号

15、redis重启

* brew services restart redis

16、jps是java提供的一个显示当前所有java进程pid的命令，Bootstrap前都数字为pid（可用于代替ps -ef ｜grep java）

* jps -v

17、redis开机启动

* ln -sfv /usr/local/opt/redis/\*.plist \~/Library/LaunchAgents

18、redis配置文件启动

* redis-server /usr/local/etc/redis.conf // 后台启动，修改配置文件*daemonize参数改为yes*。远程访问，注释bind，默认情况下 redis不允许远程访问，只允许本机访问。

  注：在redis3.2之后，redis增加了protected-mode，在这个模式下，即使注释掉了bind 127.0.0.1，再访问redisd时候还是报错，需要把protected-mode yes改为protected-mode no

19、卸载

* brewuninstallredis rm \~/Library/LaunchAgents/homebrew\.mxcl.redis.plist

20、清空日志方式一，用空替换日志文件内容，避免重启

* echo "" > catalina.out

21、查看当前目录下各个文件大小

* du -sh \*

22、命令来查看磁盘信息

* df -h

23、复制文件

* cp -r 原文件/ 重命名后复制文件/

24、环境变量修改后刷新

* source /etc/profile

25、Nginx 安装

```
https://blog.csdn.net/qq_42815754/article/details/82980326
```

```
// mac 查看nginx信息
brew info nginx
// 安装
brew install nginx
// 打开配置文件目录
open /usr/local/etc/nginx/
// 参考说明
https://www.cnblogs.com/meng1314-shuai/p/8335140.html
```

​	 /usr/local/nginx/conf  // 配置文件地址

​	 /usr/local/etc/nginx/conf // mac本地电脑路径

26、寻找nignx安装路径

```
which nginx
// 日志路径
/var/log/nginx
```

27、cd nginx重启/启动/关闭

nginx -s reload

nginx

nginx -s quit

nginx安装目录地址 -c nginx配置文件地址
28、压缩

zip -r 压缩后文件.zip 原压缩文件/

tar -zcvf 压缩后文件.tar.gz 原压缩文件/

29、解压

unzip 压缩后文件.zip

tar -zxvf 压缩后文件.tar.gz

30、查看隐藏文件

ll -al

//看当前目录文件大小

Ls -lht

31、查看是否端口被占用

lsof -i:8082

32、查看正在被监听的端口

ss -nl 8997

33、查看服务的端口和IP

netstat -lnvp

34、vim 后撤销操作

u

35、vim 恢复上一步被撤销的

ctrl + r

36、查看磁盘大小

df -h // 全部磁盘

cd /

du -sh \* // 查看每个文件大小

37、把/home目录下面的wwwroot.zip直接解压到/home目录里面

unzip wwwroot.zip

38、把/home目录下面的mydata目录压缩为mydata.zip

zip -r mydata.zip mydata

39、进入root权限

sudo su

40、退出root

exit

41、拿出api.bak文件到本地

sz api.bak

42、截取指定行数的日志 > 是重定向的意思，把输出内容覆盖放置到gglog.out（自定义的文件）。>>是在文件后追加。

tail -10000 catalina.out > gglog.out

tail -5000f catalina.out > gcclog.out

43、查询包含关键字的日志，如关键字aoyi

tail -20000f logs/catalina.out | grep aoyi

44、| 管道命令 前面命令的输出 是 后面命令的输入。下面是过滤日志，查询带有19-10-21 16的行，取前后100行；以上结果下再查询带有Thread.run的行，打印这些行的前100行。

grep "19-10-21 16" -C100 logs/catalina.out | grep "Thread.run" -B100

同理或者如下去过滤

tail -1000f logs/catalina.out | grep Exception -C10

45、查询端口是否开启

netstat -an -p tcp | find "443" >nul 2>nul && echo 443端口已开启 || echo 443未开启

46、开启防火墙限制的端口

iptables -I INPUT -ptcp --dport 9088 -j ACCEPT

47、brew下载

/bin/bash -c "$(curl -fsSL [https://raw.githubusercontent.com/Homebrew/install/master/install.sh](https://raw.githubusercontent.com/Homebrew/install/master/install.sh))"

使用有问题优先诊断会有处理推荐：brew doctor

48、测试和连接ws

安装：npm install -g wscat

连接：wscat -c ws\://ws.quote.gsoms.top/ws //有异常会报错，类似telnet

49、DNS配置，查看nameserver

```
cat /etc/resolv.conf
```

50、GitLab

```sh
# 启动所有 gitlab 组件；
gitlab-ctl start 
# 停止所有 gitlab 组件；
gitlab-ctl stop 
# 重启所有 gitlab 组件；
gitlab-ctl restart 
# 查看日志；
sudo gitlab-ctl tail 
# 修改默认的配置文件；
vim /etc/gitlab/gitlab.rb 
# 检查gitlab；
gitlab-rake gitlab:check SANITIZE=true --trace 
# 查看服务状态；
gitlab-ctl status 
 # 启动服务；（重新加载配置文件，在GitLab初次安装后可以使用，但是在业务环境中不可随意使用，reconfigure会把一些过去的config还原，导致修改的端口以及域名等都没有了。）
gitlab-ctl reconfigure
```

// 删除 [https://www.cnblogs.com/peteremperor/p/10837551.html](https://www.cnblogs.com/peteremperor/p/10837551.html)

51、Jenkins

```js
// 工作空间
cd /var/lib/jenkins/workspace/
// 安装
sudo wget -O /etc/yum.repos.d/jenkins.repo \
    https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
sudo yum upgrade // 可选
sudo yum install epel-release java-11-openjdk-devel // 可选
sudo yum install jenkins
sudo systemctl daemon-reload
// 启动
systemctl start jenkins
// 重启
service jenkins restart
// 查看日志
tail -n 300 -f /var/log/jenkins/jenkins.log
// 配置文件，用于修改监听的端口和用户名
vi /etc/sysconfig/jenkins
// 注：安装完访问发现失败，telnet下端口，可能是服务器实例的端口安全组没开放
// rpm卸载
rpm -e jenkins
// 检查是否卸载成功
rpm -ql jenkins 
// 彻底删除残留文件：
find / -iname jenkins | xargs -n 1000 rm -rf
// --------
// 插件：
// 插件目录 /var/lib/jenkins/plugins
// 将插件上传到插件目录，然后重启Jenkins即可
// jenkins 目录：
// /var/lib/jenkins/
```

52、docker

```
// 查看启动的容器 ps；查看容器 ps -a
docker ps -a
// 拉取载入镜像 pull
docker pull ubuntu
// 运行并进入容器  -t: 在新容器内指定一个伪终端或终端。 -i: 允许你对容器内的标准输入 (STDIN) 进行交互。
// /bin/bash：放在镜像名后的是命令，要有个交互式 Shell，因此用的是 /bin/bash。
docker run -i -t ubuntu:15.10 /bin/bash
// 退出容器，会停止容器；所以一般是后台运行，不进入-d，
exit
docker run -itd --name ubuntu-test ubuntu /bin/bash
// 进入容器，退出不中断容器;c33f70a903c7具体容器id
docker exec -it c33f70a903c7 /bin/bash
// 停止容器;c33f70a903c7具体容器id
docker stop c33f70a903c7
// 查看docker命令
docker
//查看命令说明 --help
docker ps --help
// 导出快照 
docker export 1e560fca3906 > ubuntu.tar
// 导入快照
cat docker/ubuntu.tar | docker import - test/ubuntu:v1
docker import http://example.com/exampleimage.tgz example/imagerepo
// 删除容器
docker rm -f c33f70a903c7
// docker启动一个web应用容器。-d:让容器在后台运行；-P:将容器内部使用的网络端口随机映射到我们使用的主机上
docker pull training/webapp  # 载入镜像
docker run -d -P training/webapp python app.py
// -p 修改映射端口，这里为5001，原先有的端口依旧在
docker run -d -p 5001:5000 training/webapp python app.py
// 查看容器内运行的进程，wizardly_chandrasekhar是 NAMES 或者 容器id
docker top wizardly_chandrasekhar
// 查看本地已下载的镜像
docker images
// 删除镜像
docker rmi ubuntu:15.10
// 通过 Dockerfile 创建镜像。-t ：指定要创建的目标镜像名。. ：Dockerfile 文件所在目录
docker build -t runoob/centos:6.7 . # Dockerfile见注1
// 创建新的docker网络。-d：参数指定 Docker 网络类型，有 bridge、overlay。
docker network create -d bridge test-net
// 查看docker network
docker network ls
// 修改，更新，查看容器dns。修改文件见 注2
docker run -it --rm  ubuntu  cat etc/resolv.conf

/**
1、指定容器设置dns。--rm：容器退出时自动清理容器内部的文件系统。
2、-h HOSTNAME 设定容器的主机名，它会被写到容器内的 /etc/hostname 和 /etc/hosts。
3、-dns=IP_ADDRESS： 添加 DNS 服务器到容器的 /etc/resolv.conf 中，让容器用这个服务器来解析所有不在 /etc/hosts 中的主机名。
4、--dns-search=DOMAIN： 设定容器的搜索域。当设定搜索域为 .example.com 时，在搜索一个名为 host 的主机时，DNS 不仅搜索 host，还会搜索 host.example.com。
**/ 
docker run -it --rm -h host_ubuntu  --dns=114.114.114.114 --dns-search=test.com ubuntu

// docker仓库登录、退出、查看，拉取
docker login
docker logout
docker search ubuntu
docker pull ubuntu 

// docker 定制镜像，Dockerfile描述 注3
// FROM：定制的镜像都是基于 FROM 的镜像，这里的 nginx 就是定制需要的基础镜像。后续的操作都是基于 nginx。
// RUN：用于执行后面跟着的命令行命令。有以下俩种格式
/**
	1、
	RUN <命令行命令>
	# <命令行命令> 等同于，在终端操作的 shell 命令。
	2、
	RUN ["可执行文件", "参数1", "参数2"]
	# 例如：
	# RUN ["./test.php", "dev", "offline"] 等价于 RUN ./test.php dev offline
**/
FROM nginx
RUN echo '这是一个本地构建的nginx镜像' > /usr/share/nginx/html/index.html
```

```
// 注1
// 其它命令见：https://www.runoob.com/docker/docker-dockerfile.html
// 第一条FROM，指定使用哪个镜像源。RUN 指令告诉docker 在镜像内执行命令，安装了什么。EXPOSE暴露的端口
/**
由于 docker 的运行模式是 C/S。本机是 C，docker 引擎是 S。实际的构建过程是在 docker 引擎下完成的，
所以这个时候无法用到我们本机的文件。这就需要把我们本机的指定目录下的文件一起打包提供给 docker 引擎使用。
如果未说明最后一个参数，那么默认上下文路径就是 Dockerfile 所在的位置。
注意：上下文路径下不要放无用的文件，因为会一起打包发送给 docker 引擎，如果文件过多会造成过程缓慢。
**/
FROM    centos:6.7
MAINTAINER      Fisher "fisher@sudops.com"

RUN     /bin/echo 'root:123456' |chpasswd
RUN     useradd runoob
RUN     /bin/echo 'runoob:123456' |chpasswd
RUN     /bin/echo -e "LANG=\"en_US.UTF-8\"" >/etc/default/local
EXPOSE  22
EXPOSE  80
CMD     /usr/sbin/sshd -D

// 注2
// 容器文件位置 /etc/docker/daemon.json
{
  "dns" : [
    "114.114.114.114",
    "8.8.8.8"
  ]
}
新增上方内容后重启docker，使生效
/etc/init.d/docker restart

// 注3
// Dockerfile 的指令每执行一次都会在 docker 上新建一层。所以过多无意义的层，会造成镜像膨胀过大。例如：
FROM centos
RUN yum install wget
RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
RUN tar -xvf redis.tar.gz
// 以上执行会创建 3 层镜像。可简化为以下格式：
FROM centos
RUN yum install wget \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
    && tar -xvf redis.tar.gz
// 如上，以 && 符号连接命令，这样执行后，只会创建 1 层镜像。
```
