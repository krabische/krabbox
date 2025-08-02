# Деплой на Vercel

## Быстрый деплой

1. **Установите Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Войдите в аккаунт Vercel:**
   ```bash
   vercel login
   ```

3. **Деплой проекта:**
   ```bash
   vercel
   ```

4. **Для продакшн деплоя:**
   ```bash
   vercel --prod
   ```

## Через GitHub

1. Загрузите проект на GitHub
2. Подключите репозиторий в Vercel Dashboard
3. Vercel автоматически определит настройки из `vercel.json`

## Переменные окружения

В Vercel Dashboard добавьте:
- `PING_MESSAGE` - сообщение для ping endpoint

## Структура деплоя

- **Frontend:** SPA из `dist/spa/`
- **API:** Serverless functions в папке `api/`
- **Routing:** Настроено в `vercel.json`

## Проверка деплоя

После деплоя проверьте:
- ✅ Главная страница загружается
- ✅ API endpoints работают (`/api/ping`, `/api/demo`)
- ✅ Все страницы доступны
- ✅ Стили загружаются корректно 