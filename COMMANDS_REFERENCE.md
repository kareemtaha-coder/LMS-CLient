# 📋 Commands Reference - مرجع الأوامر

## 🎯 الأوامر الأساسية

### Development (التطوير)
| الأمر | الوصف | API URL |
|-------|--------|---------|
| `npm start` | تشغيل التطبيق للتطوير | `http://localhost:5290` |
| `npm run dev` | تشغيل التطوير (واضح) | `http://localhost:5290` |
| `npm run build:dev` | بناء نسخة التطوير | `http://localhost:5290` |

### Production (الإنتاج)
| الأمر | الوصف | API URL |
|-------|--------|---------|
| `npm run build` | بناء نسخة الإنتاج | `https://almehrab.runasp.net` |

---

## 🔧 الأوامر الإضافية

| الأمر | الوصف |
|-------|--------|
| `npm run watch` | بناء مستمر عند التعديل (للتطوير) |
| `npm test` | تشغيل الاختبارات |

---

## 📂 ملفات Environment

```
src/environments/
├── environment.ts                    → Production URL
├── environment.development.ts        → Development URL
└── README.md                         → تفاصيل كاملة
```

---

## ⚡ أمثلة سريعة

### البدء في التطوير
```bash
# 1. تثبيت الحزم (أول مرة فقط)
npm install

# 2. تشغيل التطبيق
npm start

# 3. افتح المتصفح على
# http://localhost:4200
```

### البناء للنشر
```bash
# بناء نسخة الإنتاج
npm run build

# الملفات الجاهزة للنشر في
# dist/tabyiin/
```

---

## 🌐 URLs المستخدمة

### Development (التطوير)
- **Frontend**: `http://localhost:4200`
- **Backend API**: `http://localhost:5290`

### Production (الإنتاج)
- **Frontend**: حسب السيرفر
- **Backend API**: `https://almehrab.runasp.net`

---

## 💡 نصائح

✅ **للتطوير اليومي**: استخدم `npm start`  
✅ **قبل النشر**: استخدم `npm run build`  
✅ **لتغيير URL**: عدل الملفات في `src/environments/`  
✅ **لا تنسى**: التبديل تلقائي، لا حاجة لتغيير الكود!  

---

## 📞 المساعدة

لمزيد من التفاصيل، راجع:
- [`QUICK_START.md`](./QUICK_START.md) - دليل البدء السريع
- [`ENVIRONMENT_SETUP.md`](./ENVIRONMENT_SETUP.md) - شرح كامل للـ Environment
- [`src/environments/README.md`](./src/environments/README.md) - تفاصيل تقنية

---

**آخر تحديث**: ${new Date().toISOString().split('T')[0]}

