@echo off
echo ========================================
echo   تشغيل السيرفر المحلي
echo ========================================
echo.

cd /d "c:\Users\NOSER\Desktop\NX3\activation_server"

echo تثبيت المكتبات...
call npm install

echo.
echo ========================================
echo السيرفر يعمل على:
echo http://localhost:3000
echo.
echo لوحة التحكم:
echo http://localhost:3000/admin.html
echo ========================================
echo.

npm start
