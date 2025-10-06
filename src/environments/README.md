# Environment Configuration

## الإعداد

يحتوي هذا المجلد على ملفات تكوين البيئة للتطبيق.

### الملفات:

- **`environment.ts`** - بيئة الإنتاج (Production)
  - يستخدم عند البناء للإنتاج: `npm run build`
  - API URL: `https://almehrab.runasp.net`

- **`environment.development.ts`** - بيئة التطوير (Development)
  - يستخدم عند التشغيل المحلي: `npm start`
  - API URL: `http://localhost:5290`

## كيفية الاستخدام:

### للتطوير المحلي:
```bash
npm start
# أو
ng serve
```
سيستخدم تلقائياً `environment.development.ts` ويتصل بـ `http://localhost:5290`

### للبناء للإنتاج:
```bash
npm run build
# أو
ng build --configuration production
```
سيستخدم تلقائياً `environment.ts` ويتصل بـ `https://almehrab.runasp.net`

## تخصيص URL الخاص بك:

لتغيير URL الخاص بك، قم بتعديل الملف المناسب:

**للتطوير المحلي:**
```typescript
// src/environments/environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:YOUR_PORT'  // غير المنفذ هنا
};
```

**للإنتاج:**
```typescript
// src/environments/environment.ts
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_DOMAIN.com'  // غير الدومين هنا
};
```

## ملاحظات:

- التبديل بين البيئات يتم **تلقائياً** حسب الأمر المستخدم
- لا حاجة لتعديل أي ملفات أخرى
- الملفات محفوظة في Git ويمكن مشاركتها مع الفريق

