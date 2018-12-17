### Simple, Fast, Reliable(SFR)

# sfr-koa-router-policy
router policy for koa web framework

# Usage

server.js
```
const Koa = require('sfr-koa');
const routerPolicy = require('sfr-koa-route-policy');
const routerScan = require('sfr-koa-routerscan');
const app = new Koa();

app.use(routerPolicy({
    app: app,
    keyword: 'id',
    fn: function(){
        return {
            success: 0,
            msg: 'You haven\'t logged in yet.'
        }
    }
}));

app.use(routerScan());

app.listen(3000);
```

root.router.js
```
const Router = require('sfr-koa-router');
const router = new Router();
module.exports = router;

//@annotation {uri: '/', method: 'get', redirect: '/login'} //
router.get('/', (ctx, next) => {
    ctx.body = 'hello body!'
});

router.get('/login', (ctx, next) => {
    ctx.body = 'hello login body!'
});

//@annotation {uri: '/index', method: 'post'} //
router.post('/index', (ctx, next) => {
    ctx.body = {success: 1, msg: 'hello index body!'};
});
```

### API
# Server
```
routerPolicy({options})
- app: app  // const app = new Koa(); must use: koa instance
- keyword: 'id', // session validated fields
- fn: function(){}  // Custom return method of post
- [path]: default process.cwd()
- [regular]: default /\w+\.router\.js$/  => like *.router.js
```


```
# Router
Annotations in router file
Adding annotations to pages that require login access
No login access, no annotations
Please do not use webpack or samething program
Because the Annotations will be deleted.
method: get & post, Only support for now.
Syntax
//@annotation {Object} //

method => get
{Object} = {uri: 'router uri', method: 'get', redirect: 'uri'}

method => post
{Object} = {uri: 'router uri', method: 'post'}

# Copyright
Copyright (C) 2018 Jkin.feng. Licensed MIT. For more details, please see LICENSE.