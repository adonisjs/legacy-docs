---
title: IDE Configuration
permalink: ide-parameters
description: Configuration for using an IDE With AdonisJs
weight: 1
categories:
- general-topics
---

{{TOC}}

To use AdonisJs with Webstorm or Visual Studio Code you can use the following configuration  
## Webstorm

![alt](http://res.cloudinary.com/adonisjs/image/upload/v1472841273/webstorm_p2otce.png)

## Visual Studio Code

For Visual Studio Code you must lauch from the debug window, and select **Node.Js**, and then replace the **launch.json** with the following json.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/server.js",
      "stopOnEntry": false,
      "args": [],
      "cwd": "${workspaceRoot}",
      "preLaunchTask": null,
      "runtimeExecutable": null,
      "runtimeArgs": [
        "--nolazy",
        "--harmony_proxies"
      ],
      "env": {
        "NODE_ENV": "development"
      },
      "externalConsole": false,
      "sourceMaps": false,
      "outDir": null
    },
    {
      "name": "Attach",
      "type": "node",
      "request": "attach",
      "port": 5858,
      "address": "localhost",
      "restart": false,
      "sourceMaps": false,
      "outDir": null,
      "localRoot": "${workspaceRoot}",
      "remoteRoot": null
    },
    {
      "name": "Attach to Process",
      "type": "node",
      "request": "attach",
      "processId": "${command.PickProcess}",
      "port": 5858,
      "sourceMaps": false,
      "outDir": null
    }
  ]
}
```
