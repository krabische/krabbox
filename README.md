# Spark Den - React Application

Это React приложение с Express сервером, настроенное для деплоя на Vercel.

## Технологии

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Express (для API)

## Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка клиента
npm run build:client

# Сборка сервера
npm run build:server
```

## Деплой на Vercel

### 1. Установите Vercel CLI

```bash
npm i -g vercel
```

### 2. Войдите в аккаунт Vercel

```bash
vercel login
```

### 3. Деплой проекта

```bash
vercel
```

Или для продакшн деплоя:

```bash
vercel --prod
```

### 4. Настройка переменных окружения

В панели управления Vercel добавьте переменные окружения:

- `PING_MESSAGE` - сообщение для ping endpoint

## Структура проекта

```
├── client/          # React приложение
├── server/          # Express сервер
├── api/             # Vercel API functions
├── shared/          # Общий код
├── dist/spa/        # Собранное SPA
└── vercel.json      # Конфигурация Vercel
```

## API Endpoints

- `GET /api/ping` - Ping endpoint
- `GET /api/demo` - Demo endpoint

## Особенности

- SPA с React Router
- API routes через Vercel Functions
- CORS настроен для всех origins
- TypeScript поддержка
- Tailwind CSS для стилизации 