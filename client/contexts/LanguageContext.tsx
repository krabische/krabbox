import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'de' | 'it' | 'es' | 'ru';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Header
  'header.browseLuggage': {
    en: 'Browse Luggage',
    de: 'Gepäck durchsuchen',
    it: 'Sfoglia Bagagli',
    es: 'Explorar Equipaje',
    ru: 'Просмотр багажа'
  },
  'header.becomeHost': {
    en: 'Become a Host',
    de: 'Gastgeber werden',
    it: 'Diventa Host',
    es: 'Conviértete en Anfitrión',
    ru: 'Стать хостом'
  },
  'header.howItWorks': {
    en: 'How it Works',
    de: 'Wie es funktioniert',
    it: 'Come Funziona',
    es: 'Cómo Funciona',
    ru: 'Как это работает'
  },
  'header.support': {
    en: 'Support',
    de: 'Support',
    it: 'Supporto',
    es: 'Soporte',
    ru: 'Поддержка'
  },
  'header.login': {
    en: 'Log in',
    de: 'Anmelden',
    it: 'Accedi',
    es: 'Iniciar Sesión',
    ru: 'Войти'
  },
  'header.signup': {
    en: 'Sign up',
    de: 'Registrieren',
    it: 'Iscriviti',
    es: 'Registrarse',
    ru: 'Регистрация'
  },
  'header.host': {
    en: 'Host',
    de: 'Gastgeber',
    it: 'Host',
    es: 'Anfitrión',
    ru: 'Хост'
  },
  
  // Homepage
  'home.hero.title': {
    en: 'Travel Light.\nPack Smart.',
    de: 'Reise leicht.\nPacke klug.',
    it: 'Viaggia Leggero.\nPacked Smart.',
    es: 'Viaja Ligero.\nEmpaca Inteligente.',
    ru: 'Путешествуй налегке.\nУпаковывайся умно.'
  },
  'home.hero.subtitle': {
    en: 'Rent premium luggage storage at your destination. Skip the airline fees, avoid dragging heavy bags, and travel with confidence.',
    de: 'Mieten Sie Premium-Gepäckaufbewahrung an Ihrem Zielort. Überspringen Sie Fluggesellschaftsgebühren, vermeiden Sie schwere Taschen und reisen Sie mit Vertrauen.',
    it: 'Affitta deposito bagagli premium alla tua destinazione. Salta le tariffe aeree, evita di trascinare borse pesanti e viaggia con fiducia.',
    es: 'Alquila almacenamiento de equipaje premium en tu destino. Omite las tarifas de aerolíneas, evita arrastrar bolsas pesadas y viaja con confianza.',
    ru: 'Арендуйте премиум хранение багажа в месте назначения. Избегайте авиационных сборов, не таскайте тяжелые сумки и путешествуйте с уверенностью.'
  },
  
  // Search
  'search.where': {
    en: 'Where',
    de: 'Wo',
    it: 'Dove',
    es: 'Dónde',
    ru: 'Где'
  },
  'search.pickup': {
    en: 'Pickup',
    de: 'Abholung',
    it: 'Ritiro',
    es: 'Recogida',
    ru: 'Получение'
  },
  'search.return': {
    en: 'Return',
    de: 'Rückgabe',
    it: 'Ritorno',
    es: 'Devolución',
    ru: 'Возврат'
  },
  'search.search': {
    en: 'Search',
    de: 'Suchen',
    it: 'Cerca',
    es: 'Buscar',
    ru: 'Поиск'
  },
  
  // Categories
  'category.garage': {
    en: 'Garage',
    de: 'Garage',
    it: 'Garage',
    es: 'Garaje',
    ru: 'Гараж'
  },
  'category.shed': {
    en: 'Shed',
    de: 'Schuppen',
    it: 'Capannone',
    es: 'Cobertizo',
    ru: 'Сарай'
  },
  'category.pantry': {
    en: 'Pantry',
    de: 'Speisekammer',
    it: 'Dispensa',
    es: 'Despensa',
    ru: 'Кладовая'
  },
  'category.cell': {
    en: 'Storage Cell',
    de: 'Lagerzelle',
    it: 'Cella di Deposito',
    es: 'Celda de Almacenamiento',
    ru: 'Камера хранения'
  },
  'category.container': {
    en: 'Container',
    de: 'Container',
    it: 'Container',
    es: 'Contenedor',
    ru: 'Контейнер'
  },
  'category.largeSpace': {
    en: 'Large Space',
    de: 'Großer Raum',
    it: 'Spazio Grande',
    es: 'Espacio Grande',
    ru: 'Большое пространство'
  },
  
  // Time periods
  'period.1month': {
    en: '1 Month',
    de: '1 Monat',
    it: '1 Mese',
    es: '1 Mes',
    ru: '1 месяц'
  },
  'period.3months': {
    en: '3 Months',
    de: '3 Monate',
    it: '3 Mesi',
    es: '3 Meses',
    ru: '3 месяца'
  },
  'period.6months': {
    en: '6 Months',
    de: '6 Monate',
    it: '6 Mesi',
    es: '6 Meses',
    ru: '6 месяцев'
  },
  'period.1year': {
    en: '1 Year',
    de: '1 Jahr',
    it: '1 Anno',
    es: '1 Año',
    ru: '1 год'
  },
  'period.more': {
    en: 'More',
    de: 'Mehr',
    it: 'Più',
    es: 'Más',
    ru: 'Больше'
  },
  
  // Common
  'common.book': {
    en: 'Book',
    de: 'Buchen',
    it: 'Prenota',
    es: 'Reservar',
    ru: 'Забронировать'
  },
  'common.contact': {
    en: 'Contact',
    de: 'Kontakt',
    it: 'Contatto',
    es: 'Contacto',
    ru: 'Контакт'
  },
  'common.cancel': {
    en: 'Cancel',
    de: 'Abbrechen',
    it: 'Annulla',
    es: 'Cancelar',
    ru: 'Отмена'
  },
  'common.pay': {
    en: 'Pay',
    de: 'Bezahlen',
    it: 'Paga',
    es: 'Pagar',
    ru: 'Платить'
  },

  // Browse Page
  'browse.searchPlaceholder': {
    en: 'Search by storage type, location, or features...',
    de: 'Suche nach Lagerart, Standort oder Merkmalen...',
    it: 'Cerca per tipo di deposito, posizione o caratteristiche...',
    es: 'Buscar por tipo de almacenamiento, ubicación o características...',
    ru: 'Поиск по типу хранения, местоположению или характеристикам...'
  },
  'browse.startDate': {
    en: 'Start Date',
    de: 'Startdatum',
    it: 'Data di inizio',
    es: 'Fecha de inicio',
    ru: 'Дата начала'
  },
  'browse.endDate': {
    en: 'End Date',
    de: 'Enddatum',
    it: 'Data di fine',
    es: 'Fecha de fin',
    ru: 'Дата окончания'
  },
  'browse.search': {
    en: 'Search',
    de: 'Suchen',
    it: 'Cerca',
    es: 'Buscar',
    ru: 'Поиск'
  },
  'browse.category': {
    en: 'Category',
    de: 'Kategorie',
    it: 'Categoria',
    es: 'Categoría',
    ru: 'Категория'
  },
  'browse.allCategories': {
    en: 'All Categories',
    de: 'Alle Kategorien',
    it: 'Tutte le categorie',
    es: 'Todas las categorías',
    ru: 'Все категории'
  },
  'browse.priceRange': {
    en: 'Price Range',
    de: 'Preisspanne',
    it: 'Fascia di prezzo',
    es: 'Rango de precios',
    ru: 'Диапазон цен'
  },
  'browse.allPrices': {
    en: 'All Prices',
    de: 'Alle Preise',
    it: 'Tutti i prezzi',
    es: 'Todos los precios',
    ru: 'Все цены'
  },
  'browse.under10': {
    en: 'Under $10/day',
    de: 'Unter 10 $/Tag',
    it: 'Sotto 10 $/giorno',
    es: 'Menos de $10/día',
    ru: 'Меньше 10 $/день'
  },
  'browse.tenToTwenty': {
    en: '$10-20/day',
    de: '10–20 $/Tag',
    it: '10-20 $/giorno',
    es: '$10-20/día',
    ru: '10–20 $/день'
  },
  'browse.twentyToFifty': {
    en: '$20-50/day',
    de: '20–50 $/Tag',
    it: '20-50 $/giorno',
    es: '$20-50/día',
    ru: '20–50 $/день'
  },
  'browse.over50': {
    en: 'Over $50/day',
    de: 'Über 50 $/Tag',
    it: 'Oltre 50 $/giorno',
    es: 'Más de $50/día',
    ru: 'Больше 50 $/день'
  },
  'browse.sortBy': {
    en: 'Sort by',
    de: 'Sortieren nach',
    it: 'Ordina per',
    es: 'Ordenar por',
    ru: 'Сортировать по'
  },
  'browse.featured': {
    en: 'Featured',
    de: 'Empfohlen',
    it: 'In evidenza',
    es: 'Destacado',
    ru: 'Избранное'
  },
  'browse.priceLowHigh': {
    en: 'Price: Low to High',
    de: 'Preis: aufsteigend',
    it: "Prezzo: dal basso all'alto",
    es: 'Precio: de menor a mayor',
    ru: 'Цена: по возрастанию'
  },
  'browse.priceHighLow': {
    en: 'Price: High to Low',
    de: 'Preis: absteigend',
    it: "Prezzo: dall'alto al basso",
    es: 'Precio: de mayor a menor',
    ru: 'Цена: по убыванию'
  },
  'browse.highestRated': {
    en: 'Highest Rated',
    de: 'Beste Bewertung',
    it: 'Miglior valutato',
    es: 'Mejor valorado',
    ru: 'С наивысшей оценкой'
  },
  'browse.newestFirst': {
    en: 'Newest First',
    de: 'Neueste zuerst',
    it: 'Più recenti',
    es: 'Más recientes',
    ru: 'Сначала новые'
  },
  'browse.moreFilters': {
    en: 'More Filters',
    de: 'Weitere Filter',
    it: 'Altri filtri',
    es: 'Más filtros',
    ru: 'Больше фильтров'
  },
  'browse.listingType': {
    en: 'Listing Type',
    de: 'Angebotsart',
    it: 'Tipo di annuncio',
    es: 'Tipo de anuncio',
    ru: 'Тип объявления'
  },
  'browse.forRent': {
    en: 'For Rent',
    de: 'Zur Miete',
    it: 'In affitto',
    es: 'En alquiler',
    ru: 'В аренду'
  },
  'browse.forSale': {
    en: 'For Sale',
    de: 'Zum Verkauf',
    it: 'In vendita',
    es: 'En venta',
    ru: 'Продается'
  },
  'browse.priceRangeLabel': {
    en: 'Price Range',
    de: 'Preisspanne',
    it: 'Fascia di prezzo',
    es: 'Rango de precios',
    ru: 'Диапазон цен'
  },
  'browse.sizeRange': {
    en: 'Size Range',
    de: 'Größenbereich',
    it: 'Intervallo di dimensioni',
    es: 'Rango de tamaño',
    ru: 'Диапазон размеров'
  },
  'browse.type': {
    en: 'Type',
    de: 'Typ',
    it: 'Tipo',
    es: 'Tipo',
    ru: 'Тип'
  },
  'browse.allTypes': {
    en: 'All Types',
    de: 'Alle Typen',
    it: 'Tutti i tipi',
    es: 'Todos los tipos',
    ru: 'Все типы'
  },
  'browse.hardside': {
    en: 'Hardside',
    de: 'Hartschale',
    it: 'Rigido',
    es: 'Rígido',
    ru: 'Жёсткий'
  },
  'browse.softside': {
    en: 'Softside',
    de: 'Weichschale',
    it: 'Morbido',
    es: 'Blando',
    ru: 'Мягкий'
  },
  'browse.hybrid': {
    en: 'Hybrid',
    de: 'Hybrid',
    it: 'Ibrido',
    es: 'Híbrido',
    ru: 'Гибрид'
  },
  'browse.condition': {
    en: 'Condition',
    de: 'Zustand',
    it: 'Condizione',
    es: 'Condición',
    ru: 'Состояние'
  },
  'browse.allConditions': {
    en: 'All Conditions',
    de: 'Alle Zustände',
    it: 'Tutte le condizioni',
    es: 'Todas las condiciones',
    ru: 'Все состояния'
  },
  'browse.new': {
    en: 'New',
    de: 'Neu',
    it: 'Nuovo',
    es: 'Nuevo',
    ru: 'Новый'
  },
  'browse.excellent': {
    en: 'Excellent',
    de: 'Ausgezeichnet',
    it: 'Eccellente',
    es: 'Excelente',
    ru: 'Отличное'
  },
  'browse.good': {
    en: 'Good',
    de: 'Gut',
    it: 'Buono',
    es: 'Bueno',
    ru: 'Хорошее'
  },
  'browse.fair': {
    en: 'Fair',
    de: 'Mittel',
    it: 'Discreto',
    es: 'Regular',
    ru: 'Удовлетворительное'
  },
  'browse.minRentalDays': {
    en: 'Min Rental Days',
    de: 'Mindestmiettage',
    it: 'Giorni minimi di noleggio',
    es: 'Días mínimos de alquiler',
    ru: 'Минимум дней аренды'
  },
  'browse.maxRentalDays': {
    en: 'Max Rental Days',
    de: 'Maximale Miettage',
    it: 'Giorni massimi di noleggio',
    es: 'Días máximos de alquiler',
    ru: 'Максимум дней аренды'
  },
  'browse.securityDeposit': {
    en: 'Security Deposit',
    de: 'Kaution',
    it: 'Deposito cauzionale',
    es: 'Depósito de seguridad',
    ru: 'Залог'
  },
  'browse.optionsAvailable': {
    en: 'luggage options available',
    de: 'Gepäckoptionen verfügbar',
    it: 'opzioni di bagaglio disponibili',
    es: 'opciones de equipaje disponibles',
    ru: 'доступных вариантов багажа'
  },
  'browse.areaNotSpecified': {
    en: 'Area not specified',
    de: 'Fläche nicht angegeben',
    it: 'Area non specificata',
    es: 'Área no especificada',
    ru: 'Площадь не указана'
  },
  'browse.noResults': {
    en: 'No listings found',
    de: 'Keine Einträge gefunden',
    it: 'Nessun annuncio trovato',
    es: 'No se encontraron anuncios',
    ru: 'Объявления не найдены'
  },
  'browse.adjustSearch': {
    en: 'Try adjusting your search criteria or check back later for new listings.',
    de: 'Versuchen Sie, Ihre Suchkriterien anzupassen, oder schauen Sie später erneut nach neuen Angeboten.',
    it: 'Prova a modificare i criteri di ricerca o torna più tardi per nuovi annunci.',
    es: 'Intenta ajustar tus criterios de búsqueda o vuelve más tarde para ver nuevos anuncios.',
    ru: 'Попробуйте изменить критерии поиска или зайдите позже, чтобы увидеть новые объявления.'
  },
  'browse.clearFilters': {
    en: 'Clear Filters',
    de: 'Filter löschen',
    it: 'Pulisci filtri',
    es: 'Borrar filtros',
    ru: 'Сбросить фильтры'
  },

  'browse.perDay': {
    en: 'per day',
    de: 'pro Tag',
    it: 'al giorno',
    es: 'por día',
    ru: 'в день'
  },

  // Listing categories
  'luggageCategory.carry-on': {
    en: 'Carry-on',
    de: 'Handgepäck',
    it: 'Bagaglio a mano',
    es: 'Equipaje de mano',
    ru: 'Ручная кладь'
  },
  'luggageCategory.medium': {
    en: 'Medium',
    de: 'Mittel',
    it: 'Medio',
    es: 'Mediano',
    ru: 'Средний'
  },
  'luggageCategory.large': {
    en: 'Large',
    de: 'Groß',
    it: 'Grande',
    es: 'Grande',
    ru: 'Большой'
  },
  'luggageCategory.extra-large': {
    en: 'Extra Large',
    de: 'Extra groß',
    it: 'Extra grande',
    es: 'Extra grande',
    ru: 'Очень большой'
  },
  'luggageCategory.backpack': {
    en: 'Backpack',
    de: 'Rucksack',
    it: 'Zaino',
    es: 'Mochila',
    ru: 'Рюкзак'
  },
  'luggageCategory.duffel': {
    en: 'Duffel',
    de: 'Reisetasche',
    it: 'Borsone',
    es: 'Bolsa de viaje',
    ru: 'Дорожная сумка'
  },
  'luggageCategory.other': {
    en: 'Other',
    de: 'Andere',
    it: 'Altro',
    es: 'Otro',
    ru: 'Другое'
  },

  // Header additions
  'header.account': {
    en: 'Account',
    de: 'Konto',
    it: 'Account',
    es: 'Cuenta',
    ru: 'Аккаунт'
  },
  'header.myBookings': {
    en: 'My Bookings',
    de: 'Meine Buchungen',
    it: 'Le mie prenotazioni',
    es: 'Mis reservas',
    ru: 'Мои бронирования'
  },
  'header.settings': {
    en: 'Settings',
    de: 'Einstellungen',
    it: 'Impostazioni',
    es: 'Configuración',
    ru: 'Настройки'
  },
  'header.logout': {
    en: 'Log out',
    de: 'Abmelden',
    it: 'Esci',
    es: 'Cerrar sesión',
    ru: 'Выйти'
  },
  'header.myAccount': {
    en: 'My Account',
    de: 'Mein Konto',
    it: 'Il mio account',
    es: 'Mi cuenta',
    ru: 'Мой аккаунт'
  },

  // Account Page
  'account.memberSince': {
    en: 'Member since',
    de: 'Mitglied seit',
    it: 'Membro dal',
    es: 'Miembro desde',
    ru: 'Участник с'
  },
  'account.host': {
    en: 'Host',
    de: 'Gastgeber',
    it: 'Host',
    es: 'Anfitrión',
    ru: 'Хост'
  },
  'account.traveler': {
    en: 'Traveler',
    de: 'Reisender',
    it: 'Viaggiatore',
    es: 'Viajero',
    ru: 'Путешественник'
  },
  'account.myBookingsTab': {
    en: 'My Bookings',
    de: 'Meine Buchungen',
    it: 'Le mie prenotazioni',
    es: 'Mis reservas',
    ru: 'Мои бронирования'
  },
  'account.myListingsTab': {
    en: 'My Listings',
    de: 'Meine Angebote',
    it: 'I miei annunci',
    es: 'Mis anuncios',
    ru: 'Мои объявления'
  },
  'account.profileTab': {
    en: 'Profile',
    de: 'Profil',
    it: 'Profilo',
    es: 'Perfil',
    ru: 'Профиль'
  },
  'account.settingsTab': {
    en: 'Settings',
    de: 'Einstellungen',
    it: 'Impostazioni',
    es: 'Configuración',
    ru: 'Настройки'
  },
  'account.totalBookings': {
    en: 'Total Bookings',
    de: 'Gesamtbuchungen',
    it: 'Prenotazioni totali',
    es: 'Reservas totales',
    ru: 'Всего бронирований'
  },
  'account.nextTrip': {
    en: 'Next Trip',
    de: 'Nächste Reise',
    it: 'Prossimo viaggio',
    es: 'Próximo viaje',
    ru: 'Следующая поездка'
  },
  'account.recentBookings': {
    en: 'Recent Bookings',
    de: 'Letzte Buchungen',
    it: 'Prenotazioni recenti',
    es: 'Reservas recientes',
    ru: 'Недавние бронирования'
  },
  'account.activeListings': {
    en: 'Active Listings',
    de: 'Aktive Angebote',
    it: 'Annunci attivi',
    es: 'Anuncios activos',
    ru: 'Активные объявления'
  },
  'account.allListingsActive': {
    en: 'All listings active',
    de: 'Alle Angebote aktiv',
    it: 'Tutti gli annunci attivi',
    es: 'Todos los anuncios activos',
    ru: 'Все объявления активны'
  },
  'account.monthlyEarnings': {
    en: 'Monthly Earnings',
    de: 'Monatliche Einnahmen',
    it: 'Guadagni mensili',
    es: 'Ganancias mensuales',
    ru: 'Ежемесячный доход'
  },
  'account.totalEarned': {
    en: 'Total Earned',
    de: 'Gesamtverdienst',
    it: 'Guadagno totale',
    es: 'Total ganado',
    ru: 'Всего заработано'
  },
  'account.withdraw': {
    en: 'Withdraw',
    de: 'Auszahlen',
    it: 'Preleva',
    es: 'Retirar',
    ru: 'Вывести'
  },
  'account.earningsOverview': {
    en: 'Earnings Overview',
    de: 'Übersicht der Einnahmen',
    it: 'Panoramica guadagni',
    es: 'Resumen de ganancias',
    ru: 'Обзор доходов'
  },
  'account.yourListings': {
    en: 'Your Listings',
    de: 'Deine Angebote',
    it: 'I tuoi annunci',
    es: 'Tus anuncios',
    ru: 'Ваши объявления'
  },
  'account.noListingsYet': {
    en: 'No Listings Yet',
    de: 'Noch keine Angebote',
    it: 'Ancora nessun annuncio',
    es: 'Aún no hay anuncios',
    ru: 'Пока нет объявлений'
  },
  'account.startEarning': {
    en: 'Start earning money by listing your storage space for rent.',
    de: 'Beginne Geld zu verdienen, indem du deinen Stauraum zur Miete anbietest.',
    it: 'Inizia a guadagnare mettendo in affitto il tuo spazio di deposito.',
    es: 'Comienza a ganar dinero ofreciendo tu espacio de almacenamiento en alquiler.',
    ru: 'Начните зарабатывать, сдавая свое место для хранения.'
  },
  'account.createFirstListing': {
    en: 'Create Your First Listing',
    de: 'Erstelle dein erstes Angebot',
    it: 'Crea il tuo primo annuncio',
    es: 'Crea tu primer anuncio',
    ru: 'Создать первое объявление'
  },
  'account.personalInformation': {
    en: 'Personal Information',
    de: 'Persönliche Informationen',
    it: 'Informazioni personali',
    es: 'Información personal',
    ru: 'Личная информация'
  },
  'account.firstName': {
    en: 'First Name',
    de: 'Vorname',
    it: 'Nome',
    es: 'Nombre',
    ru: 'Имя'
  },
  'account.lastName': {
    en: 'Last Name',
    de: 'Nachname',
    it: 'Cognome',
    es: 'Apellido',
    ru: 'Фамилия'
  },
  'account.email': {
    en: 'Email',
    de: 'E-Mail',
    it: 'Email',
    es: 'Correo electrónico',
    ru: 'Электронная почта'
  },
  'account.mobileNumber': {
    en: 'Mobile Number',
    de: 'Handynummer',
    it: 'Numero di cellulare',
    es: 'Número de móvil',
    ru: 'Номер телефона'
  },
  'account.editProfile': {
    en: 'Edit Profile',
    de: 'Profil bearbeiten',
    it: 'Modifica profilo',
    es: 'Editar perfil',
    ru: 'Редактировать профиль'
  },
  'account.accountSettings': {
    en: 'Account Settings',
    de: 'Kontoeinstellungen',
    it: 'Impostazioni account',
    es: 'Configuración de la cuenta',
    ru: 'Настройки аккаунта'
  },
  'account.emailNotifications': {
    en: 'Email Notifications',
    de: 'E-Mail-Benachrichtigungen',
    it: 'Notifiche email',
    es: 'Notificaciones por correo',
    ru: 'Уведомления по email'
  },
  'account.receiveUpdates': {
    en: 'Receive booking confirmations and updates',
    de: 'Erhalte Buchungsbestätigungen und Updates',
    it: 'Ricevi conferme e aggiornamenti delle prenotazioni',
    es: 'Recibe confirmaciones y actualizaciones de reservas',
    ru: 'Получайте подтверждения и обновления бронирований'
  },
  'account.manage': {
    en: 'Manage',
    de: 'Verwalten',
    it: 'Gestisci',
    es: 'Administrar',
    ru: 'Управлять'
  },
  'account.privacySettings': {
    en: 'Privacy Settings',
    de: 'Datenschutzeinstellungen',
    it: 'Impostazioni privacy',
    es: 'Configuración de privacidad',
    ru: 'Настройки конфиденциальности'
  },
  'account.controlProfile': {
    en: 'Control who can see your profile',
    de: 'Bestimme, wer dein Profil sehen kann',
    it: 'Controlla chi può vedere il tuo profilo',
    es: 'Controla quién puede ver tu perfil',
    ru: 'Контролируйте, кто может видеть ваш профиль'
  },
  'account.configure': {
    en: 'Configure',
    de: 'Konfigurieren',
    it: 'Configura',
    es: 'Configurar',
    ru: 'Настроить'
  },
  'account.paymentMethods': {
    en: 'Payment Methods',
    de: 'Zahlungsmethoden',
    it: 'Metodi di pagamento',
    es: 'Métodos de pago',
    ru: 'Способы оплаты'
  },
  'account.managePayments': {
    en: 'Manage your payment options',
    de: 'Verwalte deine Zahlungsoptionen',
    it: 'Gestisci le tue opzioni di pagamento',
    es: 'Administra tus opciones de pago',
    ru: 'Управляйте вариантами оплаты'
  },
  'account.signOut': {
    en: 'Sign Out',
    de: 'Abmelden',
    it: 'Esci',
    es: 'Cerrar sesión',
    ru: 'Выйти'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
