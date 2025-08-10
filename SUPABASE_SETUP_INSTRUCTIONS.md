# Supabase Database Setup Instructions

## Шаг 1: Выполните SQL скрипт в Supabase

1. Откройте ваш проект в Supabase: https://supabase.com
2. Перейдите в **SQL Editor** (в левом меню)
3. Скопируйте и вставьте содержимое файла `complete-listing-table.sql`
4. Нажмите **Run** для выполнения скрипта

## Шаг 2: Проверьте, что все поля добавлены

После выполнения скрипта в таблице `listing` должны появиться следующие поля:

### Основные поля:
- `title` - название объявления
- `description` - описание
- `category` - категория (carry-on, medium, large, etc.)
- `type` - тип (hardside, softside, hybrid)
- `condition` - состояние (new, excellent, good, fair)

### Цены и тарифы:
- `price` - дневная ставка
- `weekly_rate` - недельная ставка
- `monthly_rate` - месячная ставка
- `security_deposit` - депозит
- `sell_price` - цена продажи

### Локация:
- `address` - полный адрес
- `state` - штат/область
- `zip_code` - почтовый индекс

### Детали аренды:
- `min_rental_days` - минимальные дни аренды
- `max_rental_days` - максимальные дни аренды
- `listing_type` - тип объявления (rent/sale)

### Дополнительные поля:
- `features` - особенности (JSON массив)
- `contact_number` - контактный номер
- `host_name` - имя владельца
- `available` - доступность
- `is_deleted` - удалено ли объявление

## Шаг 3: Проверьте работу создания объявлений

1. Зайдите на сайт
2. Нажмите **Host** → **Create Listing**
3. Заполните все поля
4. Нажмите **Create Listing**
5. Проверьте в Supabase, что данные сохранились

## Возможные проблемы:

### Если поля не добавляются:
- Убедитесь, что у вас есть права администратора в проекте
- Проверьте, что таблица `listing` существует
- Попробуйте выполнить команды по одной

### Если данные не сохраняются:
- Проверьте консоль браузера на ошибки
- Убедитесь, что все обязательные поля заполнены
- Проверьте RLS (Row Level Security) политики

## RLS политики (если нужно):

```sql
-- Разрешить чтение всем
CREATE POLICY "Allow public read access" ON listing
FOR SELECT USING (true);

-- Разрешить создание авторизованным пользователям
CREATE POLICY "Allow authenticated insert" ON listing
FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Разрешить обновление владельцу
CREATE POLICY "Allow owner update" ON listing
FOR UPDATE USING (auth.uid() = owner_id);

-- Разрешить удаление владельцу
CREATE POLICY "Allow owner delete" ON listing
FOR DELETE USING (auth.uid() = owner_id);
``` 