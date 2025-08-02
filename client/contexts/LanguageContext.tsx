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
    en: 'Browse Storage',
    de: 'Lagerräume durchsuchen',
    it: 'Sfoglia Depositi',
    es: 'Explorar Almacenamiento',
    ru: 'Просмотр хранилищ'
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
    it: 'Viaggia Leggero.\nImballa Smart.',
    es: 'Viaja Ligero.\nEmpaca Inteligente.',
    ru: 'Путешествуй налегке.\nУпаковывайся умно.'
  },
  'home.hero.subtitle': {
    en: 'Rent premium storage space at your destination. Skip the airline fees, avoid dragging heavy bags, and travel with confidence.',
    de: 'Mieten Sie Premium-Lagerräume an Ihrem Zielort. Überspringen Sie Fluggesellschaftsgebühren, vermeiden Sie schwere Taschen und reisen Sie mit Vertrauen.',
    it: 'Affitta spazio di deposito premium alla tua destinazione. Salta le tariffe aeree, evita di trascinare borse pesanti e viaggia con fiducia.',
    es: 'Alquila espacio de almacenamiento premium en tu destino. Omite las tarifas de aerolíneas, evita arrastrar bolsas pesadas y viaja con confianza.',
    ru: 'Арендуйте премиум хранение в месте назначения. Избегайте авиационных сборов, не таскайте тяжелые сумки и путешествуйте с уверенностью.'
  },
  'home.hero.startJourney': {
    en: 'Start Your Journey',
    de: 'Beginnen Sie Ihre Reise',
    it: 'Inizia il tuo Viaggio',
    es: 'Comienza tu Viaje',
    ru: 'Начните путешествие'
  },
  'home.hero.findStorage': {
    en: 'Find Storage',
    de: 'Lagerraum finden',
    it: 'Trova Deposito',
    es: 'Encontrar Almacenamiento',
    ru: 'Найти хранилище'
  },
  'home.hero.listStorage': {
    en: 'List Your Storage',
    de: 'Ihren Lagerraum anbieten',
    it: 'Elenca il tuo Deposito',
    es: 'Lista tu Almacenamiento',
    ru: 'Разместить хранилище'
  },
  
  // Search
  'search.where': {
    en: 'Where',
    de: 'Wo',
    it: 'Dove',
    es: 'Dónde',
    ru: 'Где'
  },
  'search.startDate': {
    en: 'Start Date',
    de: 'Startdatum',
    it: 'Data Inizio',
    es: 'Fecha de Inicio',
    ru: 'Дата начала'
  },
  'search.endDate': {
    en: 'End Date',
    de: 'Enddatum',
    it: 'Data Fine',
    es: 'Fecha Final',
    ru: 'Дата окончания'
  },
  'search.search': {
    en: 'Search',
    de: 'Suchen',
    it: 'Cerca',
    es: 'Buscar',
    ru: 'Поиск'
  },
  'search.placeholder': {
    en: 'Address, city, area...',
    de: 'Adresse, Stadt, Gebiet...',
    it: 'Indirizzo, città, zona...',
    es: 'Dirección, ciudad, área...',
    ru: 'Адрес, город, район...'
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
  
  // Browse page
  'browse.title': {
    en: 'Browse Storage',
    de: 'Lagerräume durchsuchen',
    it: 'Sfoglia Depositi',
    es: 'Explorar Almacenamiento',
    ru: 'Просмотр хранилищ'
  },
  'browse.searchPlaceholder': {
    en: 'Search by storage type, location, or features...',
    de: 'Suchen nach Lagertyp, Standort oder Eigenschaften...',
    it: 'Cerca per tipo di deposito, posizione o caratteristiche...',
    es: 'Buscar por tipo de almacenamiento, ubicación o características...',
    ru: 'Поиск по типу хранилища, местоположению или характеристикам...'
  },
  'browse.allCategories': {
    en: 'All Categories',
    de: 'Alle Kategorien',
    it: 'Tutte le Categorie',
    es: 'Todas las Categorías',
    ru: 'Все категории'
  },
  'browse.priceRange': {
    en: 'Price Range',
    de: 'Preisspanne',
    it: 'Fascia di Prezzo',
    es: 'Rango de Precios',
    ru: 'Диапазон цен'
  },
  'browse.sizeRange': {
    en: 'Size Range',
    de: 'Größenbereich',
    it: 'Gamma di Dimensioni',
    es: 'Rango de Tamaños',
    ru: 'Диапазон размеров'
  },
  'browse.perDay': {
    en: 'per day',
    de: 'pro Tag',
    it: 'al giorno',
    es: 'por día',
    ru: 'в день'
  },
  'browse.optionsAvailable': {
    en: 'storage options available',
    de: 'Lageroptionen verfügbar',
    it: 'opzioni di deposito disponibili',
    es: 'opciones de almacenamiento disponibles',
    ru: 'вариантов хранения доступно'
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
  'common.new': {
    en: 'New',
    de: 'Neu',
    it: 'Nuovo',
    es: 'Nuevo',
    ru: 'Новый'
  },
  'common.excellent': {
    en: 'Excellent',
    de: 'Ausgezeichnet',
    it: 'Eccellente',
    es: 'Excelente',
    ru: 'Отличный'
  },
  'common.good': {
    en: 'Good',
    de: 'Gut',
    it: 'Buono',
    es: 'Bueno',
    ru: 'Хороший'
  },
  'common.fair': {
    en: 'Fair',
    de: 'Ausreichend',
    it: 'Discreto',
    es: 'Regular',
    ru: 'Удовлетворительный'
  },

  // Quick filters
  'filters.popularTypes': {
    en: 'Popular storage types:',
    de: 'Beliebte Lagertypen:',
    it: 'Tipi di deposito popolari:',
    es: 'Tipos de almacenamiento populares:',
    ru: 'Популярные типы хранилищ:'
  },

  // Stats
  'stats.happyTravelers': {
    en: 'Happy Travelers',
    de: 'Zufriedene Reisende',
    it: 'Viaggiatori Felici',
    es: 'Viajeros Felices',
    ru: 'Довольных путешественников'
  },
  'stats.citiesWorldwide': {
    en: 'Cities Worldwide',
    de: 'Städte weltweit',
    it: 'Città nel Mondo',
    es: 'Ciudades Mundiales',
    ru: 'Городов по всему миру'
  },
  'stats.storageOptions': {
    en: 'Storage Options',
    de: 'Lageroptionen',
    it: 'Opzioni di Deposito',
    es: 'Opciones de Almacenamiento',
    ru: 'Вариантов хранения'
  },
  'stats.averageRating': {
    en: 'Average Rating',
    de: 'Durchschnittsbewertung',
    it: 'Valutazione Media',
    es: 'Calificación Promedio',
    ru: 'Средняя оценка'
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
