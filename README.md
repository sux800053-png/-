# 《Monster Hunter Rise》Kit T. 呆猫桌宠（本地可直接运行）

这是一个基于《Monster Hunter Rise》艾露猫外观装备 **Kit T.（玩家常称“呆猫”）** 的同人桌宠网页版本，支持 9 个状态动画，并提供 Windows 一键启动脚本。

> 说明：该角色形象来源于游戏原作 IP；本项目是非官方同人复刻演示，并非原创角色设定。

## 文件说明
- `pet.html`：桌宠页面入口
- `pet.css`：透明背景与显示样式
- `pet.js`：角色绘制、状态机与交互动画
- `start.bat`：Windows 一键启动（自动开浏览器）
- `launch_local.py`：本地 HTTP 服务启动器（供 `start.bat` 调用）

## 直接使用（Windows）
1. 把整个文件夹下载到本地。
2. 双击 `start.bat`。
3. 浏览器会自动打开：`http://127.0.0.1:8765/pet.html`

## 交互
- 鼠标点击：`clicked`
- 鼠标按住拖动：`drag`
- 松开鼠标：`surprised`
- 键盘 `1~9`：预览九种状态（idle/happy/shy/cry/surprised/clicked/drag/sleep/study）

## 纯静态打开
也可以直接双击 `pet.html` 打开；但推荐用 `start.bat`，兼容性更好。
