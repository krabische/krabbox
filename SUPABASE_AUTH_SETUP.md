# Настройка аутентификации в Supabase

## 1. Настройка Authentication в Supabase Dashboard

### Authentication > Settings

1. **Enable Email Auth:**
   - ✅ Enable Email Signup
   - ✅ Enable Email Confirmations
   - ✅ Enable Secure Email Change

2. **Email Template Settings:**
   - Customize confirmation email template
   - Add your logo and branding

### Authentication > URL Configuration

**Site URL:**
```
https://your-domain.vercel.app
```

**Redirect URLs (добавьте все):**
```
https://your-domain.vercel.app/auth/callback
https://your-domain.vercel.app
http://localhost:3000/auth/callback
http://localhost:3000
http://localhost:8080/auth/callback
http://localhost:8080
```

## 2. Проверка RLS политик

Выполните в SQL Editor:

```sql
-- Проверьте политики для profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Проверьте политики для listings
SELECT * FROM pg_policies WHERE tablename = 'listings';

-- Если политик нет, создайте их:
-- Для profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Для listings
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listings" ON listings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own listings" ON listings
  FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own listings" ON listings
  FOR DELETE USING (auth.uid() = host_id);
```

## 3. Проверка триггера

```sql
-- Проверьте триггер
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Если триггера нет, создайте его:
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, '', '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 4. Проверка таблиц

```sql
-- Проверьте структуру таблицы profiles
\d profiles

-- Проверьте структуру таблицы listings
\d listings

-- Проверьте существующих пользователей
SELECT * FROM auth.users LIMIT 5;

-- Проверьте профили
SELECT * FROM profiles LIMIT 5;
```

## 5. Отладка проблем

### Проблема: Пользователи не создаются в profiles

1. Проверьте триггер:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

2. Проверьте логи:
```sql
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;
```

### Проблема: Ошибка "access_denied"

1. Проверьте redirect URLs в Supabase Dashboard
2. Убедитесь, что домен правильный
3. Добавьте все необходимые redirect URLs

### Проблема: Email не подтверждается

1. Проверьте настройки SMTP в Supabase
2. Проверьте spam папку
3. Убедитесь, что email template настроен правильно

## 6. Тестирование

### Тест регистрации:
1. Зарегистрируйтесь с новым email
2. Проверьте, что пользователь создался в `auth.users`
3. Проверьте, что профиль создался в `profiles`
4. Подтвердите email
5. Попробуйте войти

### Тест входа:
1. Войдите с подтвержденным email
2. Проверьте, что пользователь загружается
3. Проверьте, что профиль загружается

## 7. Переменные окружения

Убедитесь, что в Vercel установлены:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
``` 