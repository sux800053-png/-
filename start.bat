@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 启动呆猫桌宠中...
python --version >nul 2>&1
if %errorlevel% neq 0 (
  py --version >nul 2>&1
  if %errorlevel% neq 0 (
    echo 未检测到 Python，请先安装 Python 3。
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
  ) else (
    py launch_local.py
    exit /b 0
  )
)

python launch_local.py
