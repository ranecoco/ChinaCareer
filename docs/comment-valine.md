# 评论（Valine + LeanCloud）故障与恢复

## 现象

文章页评论区报红：

```
Code 504: The app is archived, please restore in console before use.
[400 GET https://leancloud.cn/1.1/classes/Comment]
```

## 原因

Valine 没有自己的服务端，评论数据直接存在 LeanCloud 的 `Comment` 表里。
本站的 LeanCloud 应用（`_config.butterfly.yml` 的 `valine.appId: swCC7vMypiXgwwtB8vtcyLnF-gzGzoHsz`，
国内版 `leancloud.cn`）被**归档**了：归档后所有数据接口一律返回 504。

常见触发原因：长期没有请求流量、账号未实名认证、配额/费用异常。
这是**账号侧状态**，改代码、改主题配置都没用，必须去控制台恢复。

## 恢复步骤

1. 打开 <https://console.leancloud.cn>，登录创建该应用时用的账号（LeanCloud 国内版，不是国际版 avoscloud 控制台）。
2. 进入对应的应用 → 按页面提示点「恢复」（若提示需实名认证，先完成实名认证）。
3. 等 1~2 分钟让状态生效，再刷新文章页验证评论区。
4. 若换过应用或节点，同步更新 `_config.butterfly.yml` 里 `valine.appId` / `valine.appKey`；
   自定义域名用户还需填 `valine.serverURLs`。

## 防再次归档

- 保持应用有访问流量：长期零请求最容易被归档。
- 有 GitHub Actions 的话，加一个每日 ping 任务打一次轻量接口即可保活：

```yaml
# .github/workflows/leancloud-keepalive.yml
on:
  schedule:
    - cron: '17 3 * * *'   # 每天 UTC 03:17，约北京时间 11:17
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -sS -o /dev/null -w '%{http_code}\n' \
            -H "X-LC-Id: ${{ secrets.LC_ID }}" \
            -H "X-LC-Key: ${{ secrets.LC_KEY }}" \
            'https://leancloud.cn/1.1/classes/Comment?limit=1'
```

（`LC_ID` / `LC_KEY` 配到仓库 Secrets，别写进代码。）

## 备选方案

不想再依赖 LeanCloud 时，butterfly 支持一键换评论系统，改 `_config.butterfly.yml` 的
`comments.use` 即可，例如：

- **Twikoo**：需部署一个云函数拿到 `envId`，配置 `twikoo.envId`。
- **Waline**：需自建服务端，配置 `waline.serverURL`，数据可迁出 LeanCloud。

迁移需要先把旧评论从 LeanCloud 导出（`Comment` 表 JSON），再按目标系统格式导入，
切换前建议先备份。
