# 禅宁 SPA · Zen Ning Wellness — 静态网站

28 个独立页面：首页、服务项目、26 个地点页。每一页都是真实网址，Google 可以逐页收录。

```
/                首页（含「按地点查询技师」区块）
/services        服务项目与价格
/ampang          安邦分店
/cheras          蕉赖分店
...              共 26 个地点
/assets/         共用的 CSS、JS、图片
/_generator/     生成这个网站的脚本（见最后一节）
sitemap.xml      给 Google 的网址清单
robots.txt
vercel.json      Vercel 设定（干净网址、静态资源缓存）
set-domain.sh    换域名用的脚本
```

---

## 上线三步

### 1. 先换上你的域名

网站里现在用的是占位域名 `https://zenningspa.com`。定好正式域名后，在这个文件夹里跑：

```bash
./set-domain.sh https://你的域名.com
```

会自动替换所有页面的 canonical、og:url、结构化数据和 sitemap。**这一步要在推上 GitHub 之前做。**

### 2. 推上 GitHub

```bash
git init
git add .
git commit -m "Zen Ning SPA static site"
git branch -M main
git remote add origin https://github.com/你的账号/zenning-spa.git
git push -u origin main
```

### 3. 接上 Vercel

到 vercel.com 用 GitHub 账号登录 → Add New Project → 选这个仓库 → **Framework Preset 选 "Other"**，其他保持默认 → Deploy。

`vercel.json` 已经配好了，网址会是干净的 `/ampang` 而不是 `/ampang.html`。

之后在 Vercel 的 Settings → Domains 绑定你的域名。

---

## 上线后必做：提交给 Google

1. 到 [Google Search Console](https://search.google.com/search-console) 添加你的域名并验证（Vercel 绑定域名后，用 DNS 验证最方便）
2. 左侧 Sitemaps → 提交 `sitemap.xml`
3. 用「网址检查」工具手动提交首页和几个主要地点页，可以加快收录

通常 3 到 14 天会开始出现在搜索结果里。

---

## 比这个网站更重要的一件事

对本地按摩店来说，**Google 商家档案（Google Business Profile）带来的客人通常比网站 SEO 多**。有人搜「附近按摩」或在 Google 地图找店，出来的是商家档案。

26 家分店就开 26 个档案，免费。每个填好地址、电话、营业时间、照片，并在「网站」栏填上对应的地点页网址（例如槟城店填 `你的域名.com/penang`）。两边关联起来，排名效果比单做网站好得多。

然后持续请顾客留评价——这是本地搜索排名最大的影响因素。

---

## 每页已经做好的 SEO

- 独立的 `<title>` 和 `description`，中英文关键词都覆盖
- `<h1>` 写明地点，例如「槟城按摩 SPA / Massage & Spa in Penang」
- `canonical` 标签，避免重复收录
- Open Graph 标签 —— 分享到 WhatsApp、Facebook 时有缩略图和标题
- 26 个地点页各有 **DaySpa 结构化数据**（JSON-LD），含所在城市、州属、服务项目
- 技师人数按地点大小区分（6 到 8 位），且 26 个地点的技师组合各不相同，避免被判定为重复内容

性能方面：Tailwind 已预编译成 31KB 的 CSS 文件（原本是 400KB+ 的 CDN 脚本），首页大图抽成独立文件，每个地点页只有 50KB 左右。

---

## 技师人数怎么分配的

| 人数 | 地点 |
|---|---|
| 8 位 | 吉隆坡、槟城、柔佛、八打灵再也、梳邦、蕉赖、满家乐 |
| 7 位 | 安邦、甲洞、大城堡、蒲种、哥打白沙罗、巴生、怡保、马六甲、沙巴、浮罗交怡、云顶 |
| 6 位 | 赛城、沙登、实达阿南、太平、波德申、芙蓉、彭亨、砂拉越 |

技师池里共 10 位，每个地点抽 6–8 位。组合由店名决定，重新生成也不会变，但 26 页没有两页相同。

---

## 要改东西的时候

### 小改动，直接编辑 HTML

- **某一页的文案、技师介绍**：编辑对应的 `地点名/index.html`
- **全站共用的样式**：`assets/style.css`
- **全站共用的脚本**：`assets/site.js`
- 改完 `git add . && git commit -m "更新" && git push`，Vercel 会自动重新部署

注意：header、footer 这类每页都有的部分，28 个文件都要改。

### 大改动，用生成器

`_generator/` 里是生成整个网站的脚本：

- `therapists.py` —— 10 位技师的资料，以及每个地点配几位（`COUNTS`）
- `build_site.py` —— 生成全部 28 个页面

真实技师资料拿到后，改 `therapists.py` 里的 `POOL`（名字、照片、年资、专长、认证、国籍、标签）和 `COUNTS`，重新跑一次就能更新全站。

脚本会**清空并重建整个文件夹**，所以直接编辑过的 HTML 会被覆盖。要重新生成的话，告诉我一声，我可以帮你把改动合并进生成器。

---

## 还没做的事

- **技师资料**现在是 10 位占位技师（照片来自 `i.pravatar.cc`），26 个地点从这个池子里各抽 6–8 位。真实资料拿到后改 `_generator/therapists.py` 重新生成，或直接编辑各页 HTML
- **各分店地址电话**暂时没放（按你的意思由 Telegram 告知顾客）。以后如果想放，加进去对本地 SEO 帮助很大
- **中英文分开的网址**（`/zh/penang`、`/en/penang`）：现在两种语言在同一页用 CSS 切换，Google 看到的是混在一起的文本。要彻底解决需要拆成两套网址，工作量较大，可以等收录稳定后再做
- **Font Awesome 图标**仍从 CDN 加载。想进一步提速可以换成内嵌 SVG
