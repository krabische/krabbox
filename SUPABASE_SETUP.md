# Настройка Supabase для Spark Den

## 1. Создание проекта в Supabase

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Запишите URL и anon key

## 2. Настройка переменных окружения

В Vercel Dashboard добавьте следующие переменные:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Создание таблиц

Выполните SQL скрипт из файла `supabase-schema.sql` в SQL Editor Supabase:

1. Откройте SQL Editor в Supabase Dashboard
2. Скопируйте содержимое `supabase-schema.sql`
3. Выполните скрипт

## 4. Настройка аутентификации

В Supabase Dashboard:

1. **Authentication > Settings**
   - Включите Email auth
   - Настройте redirect URLs для вашего домена

2. **Authentication > URL Configuration**
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs: 
     - `https://your-domain.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (для разработки)

## 5. Проверка работы

После настройки:

1. Регистрация должна создавать пользователя в `auth.users`
2. Автоматически создается профиль в таблице `profiles`
3. Создание объявлений сохраняется в таблице `listings`

## 6. Структура базы данных

### Таблица `profiles`
- `id` - UUID (ссылка на auth.users)
- `first_name` - Имя пользователя
- `last_name` - Фамилия пользователя
- `email` - Email (уникальный)
- `phone_number` - Номер телефона
- `avatar_url` - URL аватара
- `is_host` - Является ли хостом
- `created_at` - Дата создания
- `updated_at` - Дата обновления

### Таблица `listings`
- `id` - UUID (автогенерируемый)
- `host_id` - ID хоста (ссылка на profiles)
- `host_name` - Имя хоста
- `title` - Заголовок объявления
- `description` - Описание
- `images` - Массив URL изображений
- `category` - Категория
- `type` - Тип
- `size` - Размеры (JSONB)
- `features` - Особенности (массив)
- `condition` - Состояние
- `location` - Местоположение (JSONB)
- `availability` - Доступность (JSONB)
- `pricing` - Цены (JSONB)
- `rating` - Рейтинг
- `review_count` - Количество отзывов
- `created_at` - Дата создания
- `updated_at` - Дата обновления

## 7. RLS (Row Level Security)

Настроены политики безопасности:
- Пользователи могут видеть только свои профили
- Пользователи могут создавать объявления только от своего имени
- Хосты могут редактировать только свои объявления
- Все пользователи могут просматривать объявления 