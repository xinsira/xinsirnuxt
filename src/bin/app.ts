import 'reflect-metadata';
import Koa from "koa";
import KoaBodyParser from "koa-bodyparser";
import { useKoaServer,useContainer } from "routing-controllers";
import { Container } from "typedi";
import { Nuxt, Builder } from 'nuxt';
import path from "path";

import config from '../nuxt.config';
import { errorHandler } from '../middlewares/errorHandle';

const PORT = 3000

class App {
  protected app = new Koa();
  constructor () {
    this.init();
  }
  
  init () {
    // typedi 注入到 routing-controllers
    useContainer(Container);
    // 中间件处理
    this.combinationPlugins();
    // 项目启动
    this.start();
  }

  // 组装中间件
  combinationPlugins() {
    const pluginsList = [
      errorHandler, // 处理异常，保证接口返回值正确；必须放在最上面（洋葱模型）
      KoaBodyParser({
        limit: '20mb',
        formLimit: '20mb',
        jsonLimit: '20mb',
        textLimit: '20mb'
      })
    ];
    // 执行中间件
    pluginsList.forEach((v) => this.app.use(v));
  }

  // 启动
  async start () {
    try {
      useKoaServer(this.app, {
        defaultErrorHandler: false, // 将默认处理错误设置为false，不让会比我们写的错误处理中间件提前捕获到错误
        controllers: [`${path.join(__dirname, '../controller/**.controller{.ts,.js}')}`]
      });

      // 先匹配接口路由，再匹配页面路由
      const nuxt = new Nuxt(config);
      await nuxt.ready();
      // Build in development
      if (config.dev) {
        const builder = new Builder(nuxt);
        await builder.build();
      }
      this.app.use((ctx:any) => {
        if (ctx.status !== 404) { // 非404，说明是接口路由，如果不return，会被下面的覆盖
          return;
        }
        ctx.status = 200;
        ctx.respond = false; // Bypass Koa's built-in response handling
        ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
        nuxt.render(ctx.req, ctx.res);
      });
      console.log(`server run on localhost:${PORT}`);
      this.app.listen(PORT);
    } catch (e) {
      console.error(`❌ 启动出错：${e.message}`);
    }
    this.errorCatch();
  }

// 错误捕捉Unsupported type
private errorCatch (): any {
  this.app.on('error', (err, ctx, next) => {
    console.error(`❌ 主程序捕捉到错误：${err.message}`);
  });
}
}

export default App;
