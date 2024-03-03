@echo off
cd /d %~dp0
call venv\Scripts\activate
set FLASK_ENV=development
python app.py