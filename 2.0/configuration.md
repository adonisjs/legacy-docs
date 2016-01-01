# Configuration

All of your application configuration is stored inside the config directory. You are free to add more files to this directory which are autoloaded and you can access them using the `Config` provider.

- [App Key](#app-key)
- [Trust Proxy](#trust-proxy)
- [Static Resources](#static-resources)

## App Key

Application key is required to be setup to keep your application data encrypted. Sessions, cookies and Encryption provider makes use of this key and will send out plain data if key is not set.

Inside `config/app.js` file you can define the `appKey`, which is automatically set if you create a new project using `adonis-cli`.

## Trust Proxy

It is a very common use case to deploy node applications behind a proxy server or load balancer like nginx. Now when a request passes through a proxy server lot of request information is sent over `X-Forwarded-*` headers. For example `Host` is passed as `X-Forwarded-Host`. If your application is behind a proxy server then do set this accordingly.

There are multiple ways to tell adonis on whether to trust `X-Forwarded-*` headers or not.

#### array of ip address
You can whitelist an array of ip addresses to trust.

```javascript,line-numbers
trustProxy: ['127.0.0.0', '10.0.0.1']
```

#### array of subnets
Also you can define array of subnets to trust.

```javascript,line-numbers
trustProxy: ['fe80::1:1:1:1', 'fc00:ac:1ab5:fff::1']
// or
trustProxy: ['loopback', 'uniquelocal']
```

#### booleans
If you want to trust `X-Forwarded-*` from everywhere set it to `true` or `false` if you are not behind a proxy server.

#### callback
Also you can attach a callback to make a decision whether or not to allow `X-Forwarded-*`.

```javascript,line-numbers
trustProxy: function (remoteAddress) {
  return remoteAddress === '127.0.0.1'
}
```

## Static Resources

Static resources are server from `public` directory of every adonis application and configuration for static resources is defined under `config/static.js` file. You can set custom headers, define `Cache-Control` header or enable/disable gzip support.
