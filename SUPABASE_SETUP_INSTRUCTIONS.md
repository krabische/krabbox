# 🔧 Настройка Supabase для проекта

## 📋 Шаги для настройки

### 1. Выполните SQL скрипт

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **SQL Editor**
4. Скопируйте содержимое файла `supabase-schema.sql` и выполните его

### 2. Проверьте созданные таблицы

После выполнения SQL скрипта должны быть созданы следующие таблицы:

- ✅ `profiles` - профили пользователей
- ✅ `listings` - объявления о сдаче багажа
- ✅ `bookings` - бронирования
- ✅ `listing_images` - изображения объявлений

### 3. Проверьте RLS политики

В **Authentication > Policies** должны быть созданы политики для всех таблиц:

#### Profiles таблица:
- `Users can view their own profile`
- `Users can update their own profile`
- `Users can insert their own profile`

#### Listings таблица:
- `Anyone can view available listings`
- `Hosts can view their own listings`
- `Hosts can create listings`
- `Hosts can update their own listings`
- `Hosts can delete their own listings`

### 4. Проверьте триггер

В **Database > Functions** должен быть создан триггер:
- `handle_new_user` - автоматически создает профиль при регистрации

### 5. Настройте Authentication

1. Перейдите в **Authentication > Settings**
2. Убедитесь, что **Enable email confirmations** включено
3. В **Site URL** укажите ваш домен Vercel
4. В **Redirect URLs** добавьте:
   - `https://your-domain.vercel.app/`
   - `https://your-domain.vercel.app/account`

### 6. Проверьте Environment Variables

Убедитесь, что в Vercel настроены переменные окружения:

```
VITE_SUPABASE_URL=https://majhlkvnwnsycbtpguzb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hamhsa3Zud25zeWNidHBndXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzAyMzEsImV4cCI6MjA2OTc0NjIzMX0.7_R6TdDY8qxyrIUXMLRoXD1p4FfTxeiZWwNAlV1lo9M
```

## 🧪 Тестирование

### 1. Проверьте подключение

1. Откройте сайт на Vercel
2. Прокрутите вниз до секции "Supabase Connection Test"
3. Нажмите "Test Connection"
4. Проверьте результаты

### 2. Создайте тестовые данные

1. Нажмите "Create Test Profile" - должен создать профиль в таблице `profiles`
2. Нажмите "Create Test Listing" - должен создать объявление в таблице `listings`

### 3. Проверьте в Supabase Dashboard

1. Перейдите в **Table Editor**
2. Выберите таблицу `profiles` - должны появиться тестовые данные
3. Выберите таблицу `listings` - должны появиться тестовые объявления

## 🚨 Возможные проблемы

### Проблема: "Table does not exist"
**Решение:** Выполните SQL скрипт заново

### Проблема: "RLS policy violation"
**Решение:** Проверьте, что RLS политики созданы правильно

### Проблема: "Authentication failed"
**Решение:** Проверьте API ключи в переменных окружения

### Проблема: "Trigger not working"
**Решение:** Проверьте, что триггер `handle_new_user` создан и активен

## 📞 Поддержка

Если проблемы остаются:
1. Проверьте консоль браузера на ошибки
2. Проверьте логи в Supabase Dashboard
3. Убедитесь, что все SQL команды выполнились успешно 