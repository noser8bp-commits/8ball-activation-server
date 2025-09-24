# 🔑 نظام تفعيل التطبيق

نظام إدارة مفاتيح التفعيل لتطبيق 8 Ball Pool المعدل.

## 📋 المميزات

- ✅ إضافة وحذف المفاتيح
- ✅ تفعيل وتعطيل المفاتيح
- ✅ عرض إحصائيات الاستخدام
- ✅ واجهة ويب سهلة الاستخدام
- ✅ API للتحقق من المفاتيح

## 🚀 التثبيت والتشغيل

### 1. تثبيت المتطلبات
```bash
npm install
```

### 2. تشغيل السيرفر
```bash
npm start
```

السيرفر سيعمل على: http://localhost:3000

### 3. لوحة التحكم
افتح المتصفح واذهب إلى:
```
http://localhost:3000/admin.html
```

كلمة المرور الافتراضية: `admin123`

## 🔐 تغيير كلمة المرور

لتغيير كلمة مرور المدير، قم بتعديل السطر 92 و 117 في `server.js`:
```javascript
if (adminPassword !== 'admin123') {  // غير admin123 إلى كلمة المرور الجديدة
```

## 📱 ربط التطبيق بالسيرفر

### تعديل التطبيق للاتصال بالسيرفر:

1. ابحث عن دالة `Check` في الملفات
2. استبدل الكود بطلب HTTP إلى السيرفر

مثال الكود المطلوب إضافته في التطبيق (Java):
```java
public static String checkKey(String key) {
    try {
        URL url = new URL("http://YOUR_SERVER/api/check");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);
        
        String jsonInput = "{\"key\":\"" + key + "\"}";
        conn.getOutputStream().write(jsonInput.getBytes());
        
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String response = br.readLine();
        
        // Parse JSON response
        if (response.contains("\"result\":\"1\"")) {
            return "1";
        }
        return "0";
    } catch (Exception e) {
        return "0";
    }
}
```

## 🌐 نشر السيرفر أونلاين

### خيار 1: Render.com (مجاني)
1. اذهب إلى https://render.com
2. أنشئ حساب جديد
3. اختر "New Web Service"
4. اربط مع GitHub أو ارفع الكود
5. اختر "Node" كـ Environment
6. ضع `npm install` كـ Build Command
7. ضع `npm start` كـ Start Command
8. انقر "Create Web Service"

### خيار 2: Railway.app (سهل)
1. اذهب إلى https://railway.app
2. أنشئ حساب جديد
3. اختر "Deploy from GitHub"
4. اربط المشروع
5. Railway سيكتشف Node.js تلقائياً
6. انقر "Deploy"

### خيار 3: Heroku (مدفوع)
1. أنشئ ملف `Procfile`:
```
web: node server.js
```
2. نشر على Heroku

## 📝 استخدام API

### التحقق من مفتاح
```
POST /api/check
Content-Type: application/json

{
  "key": "XXXX-XXXX-XXXX-XXXX"
}
```

الاستجابة:
```json
{
  "success": true,
  "message": "Key is valid",
  "result": "1"
}
```

## ⚙️ الإعدادات

- المنفذ: 3000 (يمكن تغييره بـ PORT environment variable)
- قاعدة البيانات: `keys.json` (ملف محلي)
- كلمة مرور المدير: `admin123` (غيرها من الكود)

## 🛠️ حل المشاكل

### السيرفر لا يعمل
- تأكد من تثبيت Node.js
- تأكد من تشغيل `npm install`
- تحقق من أن المنفذ 3000 غير مستخدم

### التطبيق لا يتصل
- تأكد من أن السيرفر يعمل
- تحقق من عنوان السيرفر في التطبيق
- تأكد من أن الجهاز متصل بالإنترنت

## 📞 الدعم

إذا واجهت أي مشاكل، تحقق من:
1. console logs في السيرفر
2. Network tab في المتصفح
3. تأكد من صحة كلمة المرور
