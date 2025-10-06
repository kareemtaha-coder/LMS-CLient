# 🌍 Environment Configuration Guide

## 📋 ملخص سريع

تم إعداد نظام Environment للتبديل التلقائي بين بيئة التطوير والإنتاج.

---

## 🚀 الاستخدام

### للتطوير المحلي (Development):
```bash
npm start
```
- ✅ يستخدم تلقائياً: `http://localhost:5290`
- ✅ Source maps مفعلة
- ✅ بدون تحسينات (أسرع للتطوير)

### للإنتاج (Production):
```bash
npm run build
```
- ✅ يستخدم تلقائياً: `https://almehrab.runasp.net`
- ✅ ملفات محسنة ومضغوطة
- ✅ جاهزة للنشر

---

## ⚙️ التخصيص

### تغيير URL للتطوير المحلي:

افتح: `src/environments/environment.development.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:YOUR_PORT'  // غير هنا
};
```

### تغيير URL للإنتاج:

افتح: `src/environments/environment.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_DOMAIN.com'  // غير هنا
};
```

---

## 📁 الملفات المعنية

```
src/
├── environments/
│   ├── environment.ts                    # Production URL
│   ├── environment.development.ts        # Development URL
│   └── README.md                         # تفاصيل إضافية
├── app/
│   └── app.config.ts                     # يستورد environment تلقائياً
```

---

## 🎯 المزايا

- ✅ **لا حاجة للتبديل اليدوي** - يتم تلقائياً حسب الأمر المستخدم
- ✅ **منظم وواضح** - كل بيئة في ملف منفصل
- ✅ **سهل الصيانة** - مكان واحد لكل URL
- ✅ **آمن** - لا خطر من رفع URL الإنتاج عن طريق الخطأ

---

## 🔧 للمطورين الجدد

إذا كنت مطور جديد في الفريق:

1. استنسخ المشروع
2. ثبت الحزم: `npm install`
3. شغل التطوير: `npm start`
4. **لا تحتاج لأي إعداد إضافي!** 🎉

---

## 📝 ملاحظات

- الملفات محفوظة في Git للمشاركة مع الفريق
- Angular يستبدل الملفات تلقائياً عند البناء
- يمكنك إضافة متغيرات أخرى للـ environment حسب الحاجة

---

## ❓ الأسئلة الشائعة

**Q: كيف أعرف أي URL يستخدمه التطبيق حالياً؟**  
A: افتح Developer Console في المتصفح، ستجد طلبات API تشير للـ URL المستخدم.

**Q: هل يمكنني استخدام URL مختلف للتطوير؟**  
A: نعم! فقط عدل `environment.development.ts`

**Q: ماذا لو أردت بيئة ثالثة (مثل Staging)؟**  
A: يمكنك إنشاء `environment.staging.ts` وإضافة configuration في `angular.json`

---

Made with ❤️ for LMS Project

