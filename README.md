# whistle gh-pages

主要介绍如何自动化部署 gitbook 的资源到项目的 gh-pages，以 whistle 为例，其他项目思路一样。

## 基本思路

利用 github 的 webhook 机制，可以设置某个事件触发后调用一个远程 API。照这个思路，如果在某一台服务器部署一个服务，调用 API 即执行相关的脚本，将 gitbook 生成的静态资源 push 到远程 gh-pages 分支，就可以实现自动部署文档到 github。

脚本参考：https://github.com/echopi/whistle/blob/master/docs/script/build-book.sh

## 前提

1. 设置项目的 gh-pages 通过 `gh-pages` 分支编译。

  ![gh-pages](./assets/gh-pages-setting.png)
2. 提供 API 的应用需要有能力 push 代码到远程分支
3. 在项目下设置 webhook，调用远程 API

## 部署 API

远程主机安装 docker 程序，拉镜像

```sh
docker pull jiewei/whistle-gh-pages:1.0.0.alpha
docker images
```

从镜像启动容器

```sh
# start container from an image
docker run \
  --rm \
  -d --init \
  -m "300M" --memory-swap "1G" \
  -v ~/logs/whistle-gh-pages:/home/node/app/logs \
  -v ~/work/code/w2/whistle:/home/node/whistle \
  -p 6001:6001 \
  --name whistle-gh-pages \
  jiewei/whistle-gh-pages:1.0.0
```

进入到容器

```sh
# Run a command in a running container
docker exec -it  whistle-gh-pages bash
```

## whistle 代码

1. 在远程主机，pull 项目的代码到 ~/$PROJECT_NAME

  ```sh
  git clone https://github.com/avwo/whistle.git ~/whistle
  ```
2. 设置 ssh 到 github，参考：https://help.github.com/articles/connecting-to-github-with-ssh/


## API 说明

| API | method | 说明 |
|----------|----------|----------|
| `/api/whistle/build`   |  GET   | 201: 创建异步任务 <br/>404: `docs/script/build-book.sh` 脚本不存在 <br/> 500: spawn error |
| `/app.log`      | GET      |  app log |
| `/`      | GET      |  'Hello Koa' |

## 其他命令参考

```sh
# build an image
docker build . -t jiewei/whistle-gh-pages:1.0.0

# push an image
docker push jiewei/whistle-gh-pages:1.0.0

cat /etc/issue
```
