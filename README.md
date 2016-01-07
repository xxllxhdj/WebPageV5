# WebPageV5

https://github.com/meanjs/mean.git

mongod -dbpath "E:\mongodb\data"

NODE_ENV=production forever start -l forever.log -o out.log -e err.log app.js

编写自己的sh文件
forever -p web文件路径 -l 路径/access.log -e 路径/error.log -o 路径/out.log -a --pidFile 路径/app.pid start web文件路径/app.js
启动服务: sh 我的配置.sh