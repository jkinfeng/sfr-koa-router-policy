'use strict';

const fs = require('fs');
const FileAutoscan = require('sfr-file-autoscan');
const __matchAll = /\/\/@annotation(.*?)\/\//g;
const __match = /\/\/@annotation(.*?)\/\//;

module.exports = function ($opts) {

    if (!$opts.app.authorization) {
        Object.defineProperties($opts.app, {
            authorization: {
                enumerable: true,
                value: getAnnotation($opts)
            },
        });
    }

    return async (ctx, next) => {
        const __authorization = $opts.app.authorization;
        const __method = ctx.request.method.toLowerCase();

        let __ctxRequestUrl = ctx.request.url;
        if (__ctxRequestUrl.indexOf('?') > -1) {
            __ctxRequestUrl = __ctxRequestUrl.split('?')[0];
        }

        let __routerPolicy;
        for (let __i = 0; __i < __authorization.length; __i++) {
            if (__authorization[__i].uri === __ctxRequestUrl
                && __authorization[__i].method === __method) {
                __routerPolicy = __authorization[__i];
                break;
            }
        }

        if (__authorization.length > 0 && __routerPolicy) {
            // please setup session module.
            if(typeof ctx.session === 'undefined'){
                ctx.session = ctx.session || {};
                console.error('lack of session module');
            }

            // method: get & post, Only support for now.
            if (!!ctx.session[$opts.keyword]) {
                await next();
            }else{
                if (__method === 'post') {
                    ctx.body = $opts.fn() || {success: 0, msg: 'session expired.'};
                } else {
                    ctx.redirect(__routerPolicy.redirect);
                }
            }

        } else {
            await next();
        }

    }

};

function getAnnotation($opts) {
    $opts = $opts || {};
    const __arr = [],
        __files = new FileAutoscan({
            path: $opts.path || process.cwd(),
            regular: $opts.regular || /\w+\.router\.js$/
        });

    __files.get().forEach(function ($routeFile) {
        const __routerFile = fs.readFileSync($routeFile).toString();
        const __matchAllArray = __routerFile.match(__matchAll);
        if (__matchAllArray !== null) {
            for (let __rules in __matchAllArray) {
                __arr.push(
                    new Function('return ' + __matchAllArray[__rules].match(__match)[1])()
                );
            }
        }
    });
    return __arr
}