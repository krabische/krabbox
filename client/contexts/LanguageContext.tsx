import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "de" | "it" | "es" | "ru";

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Header
  "header.browseLuggage": {
    en: "Browse Storage",
    de: "Lagerräume durchsuchen",
    it: "Sfoglia Depositi",
    es: "Explorar Almacenamiento",
    ru: "Просмотр хранилищ",
  },
  "header.becomeHost": {
    en: "Become a Host",
    de: "Gastgeber werden",
    it: "Diventa Host",
    es: "Conviértete en Anfitrión",
    ru: "Стать хостом",
  },
  "header.howItWorks": {
    en: "How it Works",
    de: "Wie es funktioniert",
    it: "Come Funziona",
    es: "Cómo Funciona",
    ru: "Как это работает",
  },
  "header.support": {
    en: "Support",
    de: "Support",
    it: "Supporto",
    es: "Soporte",
    ru: "Поддержка",
  },
  "header.login": {
    en: "Log in",
    de: "Anmelden",
    it: "Accedi",
    es: "Iniciar Sesión",
    ru: "Войти",
  },
  "header.signup": {
    en: "Sign up",
    de: "Registrieren",
    it: "Iscriviti",
    es: "Registrarse",
    ru: "Регистрация",
  },
  "header.host": {
    en: "Host",
    de: "Gastgeber",
    it: "Host",
    es: "Anfitrión",
    ru: "Хост",
  },

  // Homepage
  "home.hero.title": {
    en: "Travel Light.\nPack Smart.",
    de: "Reise leicht.\nPacke klug.",
    it: "Viaggia Leggero.\nImballa Smart.",
    es: "Viaja Ligero.\nEmpaca Inteligente.",
    ru: "Путешествуй налегке.\nУпако��ывайся умно.",
  },
  "home.hero.subtitle": {
    en: "Rent premium storage space at your destination. Skip the airline fees, avoid dragging heavy bags, and travel with confidence.",
    de: "Mieten Sie Premium-Lagerräume an Ihrem Zielort. Überspringen Sie Fluggesellschaftsgebühren, vermeiden Sie schwere Taschen und reisen Sie mit Vertrauen.",
    it: "Affitta spazio di deposito premium alla tua destinazione. Salta le tariffe aeree, evita di trascinare borse pesanti e viaggia con fiducia.",
    es: "Alquila espacio de almacenamiento premium en tu destino. Omite las tarifas de aerolíneas, evita arrastrar bolsas pesadas y viaja con confianza.",
    ru: "Арендуйте премиум хранение в месте назначения. Избегайте авиационных сборов, не таскайте тяжелые сумки и путешествуйте с уверенностью.",
  },
  "home.hero.startJourney": {
    en: "Start Your Journey",
    de: "Beginnen Sie Ihre Reise",
    it: "Inizia il tuo Viaggio",
    es: "Comienza tu Viaje",
    ru: "Начните путешествие",
  },
  "home.hero.findStorage": {
    en: "Find Storage",
    de: "Lagerraum finden",
    it: "Trova Deposito",
    es: "Encontrar Almacenamiento",
    ru: "Найти хранилище",
  },
  "home.hero.listStorage": {
    en: "List Your Storage",
    de: "Ihren Lagerraum anbieten",
    it: "Elenca il tuo Deposito",
    es: "Lista tu Almacenamiento",
    ru: "Разместить хранилище",
  },

  // Search
  "search.where": {
    en: "Where",
    de: "Wo",
    it: "Dove",
    es: "Dónde",
    ru: "Где",
  },
  "search.startDate": {
    en: "Start Date",
    de: "Startdatum",
    it: "Data Inizio",
    es: "Fecha de Inicio",
    ru: "Дата начала",
  },
  "search.endDate": {
    en: "End Date",
    de: "Enddatum",
    it: "Data Fine",
    es: "Fecha Final",
    ru: "Дата окончания",
  },
  "search.search": {
    en: "Search",
    de: "Suchen",
    it: "Cerca",
    es: "Buscar",
    ru: "Поиск",
  },
  "search.placeholder": {
    en: "Address, city, area...",
    de: "Adresse, Stadt, Gebiet...",
    it: "Indirizzo, città, zona...",
    es: "Dirección, ciudad, área...",
    ru: "Адрес, город, район...",
  },

  // Categories
  "category.garage": {
    en: "Garage",
    de: "Garage",
    it: "Garage",
    es: "Garaje",
    ru: "Гараж",
  },
  "category.shed": {
    en: "Shed",
    de: "Schuppen",
    it: "Capannone",
    es: "Cobertizo",
    ru: "Сарай",
  },
  "category.pantry": {
    en: "Pantry",
    de: "Speisekammer",
    it: "Dispensa",
    es: "Despensa",
    ru: "Кладовая",
  },
  "category.cell": {
    en: "Storage Cell",
    de: "Lagerzelle",
    it: "Cella di Deposito",
    es: "Celda de Almacenamiento",
    ru: "Камера хранения",
  },
  "category.container": {
    en: "Container",
    de: "Container",
    it: "Container",
    es: "Contenedor",
    ru: "Контейнер",
  },
  "category.largeSpace": {
    en: "Large Space",
    de: "Großer Raum",
    it: "Spazio Grande",
    es: "Espacio Grande",
    ru: "Большое пространство",
  },

  // Browse page
  "browse.title": {
    en: "Browse Storage",
    de: "Lagerräume durchsuchen",
    it: "Sfoglia Depositi",
    es: "Explorar Almacenamiento",
    ru: "Просмотр хранилищ",
  },
  "browse.searchPlaceholder": {
    en: "Search by storage type, location, or features...",
    de: "Suchen nach Lagertyp, Standort oder Eigenschaften...",
    it: "Cerca per tipo di deposito, posizione o caratteristiche...",
    es: "Buscar por tipo de almacenamiento, ubicación o características...",
    ru: "Поиск по типу хранилища, местоположению или характеристикам...",
  },
  "browse.allCategories": {
    en: "All Categories",
    de: "Alle Kategorien",
    it: "Tutte le Categorie",
    es: "Todas las Categorías",
    ru: "Все категории",
  },
  "browse.priceRange": {
    en: "Price Range",
    de: "Preisspanne",
    it: "Fascia di Prezzo",
    es: "Rango de Precios",
    ru: "Диапазон цен",
  },
  "browse.sizeRange": {
    en: "Size Range",
    de: "Größenbereich",
    it: "Gamma di Dimensioni",
    es: "Rango de Tamaños",
    ru: "Диапазон размеров",
  },
  "browse.perDay": {
    en: "per day",
    de: "pro Tag",
    it: "al giorno",
    es: "por día",
    ru: "в день",
  },
  "browse.optionsAvailable": {
    en: "storage options available",
    de: "Lageroptionen verfügbar",
    it: "opzioni di deposito disponibili",
    es: "opciones de almacenamiento disponibles",
    ru: "вариантов хранения доступно",
  },

  // Common
  "common.book": {
    en: "Book",
    de: "Buchen",
    it: "Prenota",
    es: "Reservar",
    ru: "Забронировать",
  },
  "common.contact": {
    en: "Contact",
    de: "Kontakt",
    it: "Contatto",
    es: "Contacto",
    ru: "Контакт",
  },
  "common.cancel": {
    en: "Cancel",
    de: "Abbrechen",
    it: "Annulla",
    es: "Cancelar",
    ru: "Отмена",
  },
  "common.pay": {
    en: "Pay",
    de: "Bezahlen",
    it: "Paga",
    es: "Pagar",
    ru: "Платить",
  },
  "common.new": {
    en: "New",
    de: "Neu",
    it: "Nuovo",
    es: "Nuevo",
    ru: "Новый",
  },
  "common.excellent": {
    en: "Excellent",
    de: "Ausgezeichnet",
    it: "Eccellente",
    es: "Excelente",
    ru: "Отличный",
  },
  "common.good": {
    en: "Good",
    de: "Gut",
    it: "Buono",
    es: "Bueno",
    ru: "Хороший",
  },
  "common.fair": {
    en: "Fair",
    de: "Ausreichend",
    it: "Discreto",
    es: "Regular",
    ru: "Удовлетворительный",
  },

  // Quick filters
  "filters.popularTypes": {
    en: "Popular storage types:",
    de: "Beliebte Lagertypen:",
    it: "Tipi di deposito popolari:",
    es: "Tipos de almacenamiento populares:",
    ru: "Популярные типы хранилищ:",
  },

  // Stats
  "stats.happyTravelers": {
    en: "Happy Travelers",
    de: "Zufriedene Reisende",
    it: "Viaggiatori Felici",
    es: "Viajeros Felices",
    ru: "Довольных путешественников",
  },
  "stats.citiesWorldwide": {
    en: "Cities Worldwide",
    de: "Städte weltweit",
    it: "Città nel Mondo",
    es: "Ciudades Mundiales",
    ru: "Городов по всему миру",
  },
  "stats.storageOptions": {
    en: "Storage Options",
    de: "Lageroptionen",
    it: "Opzioni di Deposito",
    es: "Opciones de Almacenamiento",
    ru: "Вариантов хранения",
  },
  "stats.averageRating": {
    en: "Average Rating",
    de: "Durchschnittsbewertung",
    it: "Valutazione Media",
    es: "Calificación Promedio",
    ru: "Средняя оценка",
  },

  // Listing Management
  "listing.edit": {
    en: "Edit Listing",
    de: "Anzeige bearbeiten",
    it: "Modifica Annuncio",
    es: "Editar Anuncio",
    ru: "Редактировать объявление",
  },
  "listing.delete": {
    en: "Delete Listing",
    de: "Anzeige löschen",
    it: "Elimina Annuncio",
    es: "Eliminar Anuncio",
    ru: "Удалить объявление",
  },
  "listing.archive": {
    en: "Archive",
    de: "Archivieren",
    it: "Archivia",
    es: "Archivar",
    ru: "Архивировать",
  },
  "listing.unarchive": {
    en: "Unarchive",
    de: "Aus Archiv entfernen",
    it: "Rimuovi dall'Archivio",
    es: "Desarchivar",
    ru: "Разархивировать",
  },
  "listing.archived": {
    en: "Archived",
    de: "Archiviert",
    it: "Archiviato",
    es: "Archivado",
    ru: "Архивировано",
  },
  "listing.updated": {
    en: "Listing Updated!",
    de: "Anzeige aktualisiert!",
    it: "Annuncio aggiornato!",
    es: "¡Anuncio actualizado!",
    ru: "Объявление обновлено!",
  },
  "listing.updatedDescription": {
    en: "Your listing has been updated successfully.",
    de: "Ihre Anzeige wurde erfolgreich aktualisiert.",
    it: "Il tuo annuncio è stato aggiornato con successo.",
    es: "Tu anuncio ha sido actualizado exitosamente.",
    ru: "Ваше объявление было успешно обновлено.",
  },
  "listing.basicInfo": {
    en: "Basic Information",
    de: "Grundinformationen",
    it: "Informazioni di Base",
    es: "Información Básica",
    ru: "Основная информация",
  },
  "listing.specifications": {
    en: "Specifications & Features",
    de: "Spezifikationen & Eigenschaften",
    it: "Specifiche e Caratteristiche",
    es: "Especificaciones y Características",
    ru: "Характеристики и особенности",
  },
  "listing.imagesLocation": {
    en: "Images & Location",
    de: "Bilder & Standort",
    it: "Immagini e Posizione",
    es: "Imágenes y Ubicación",
    ru: "Изображения и местоположение",
  },
  "listing.pricingAvailability": {
    en: "Pricing & Availability",
    de: "Preise & Verfügbarkeit",
    it: "Prezzi e Disponibilità",
    es: "Precios y Disponibilidad",
    ru: "Цены и доступность",
  },
  "listing.title": {
    en: "Listing Title",
    de: "Anzeigentitel",
    it: "Titolo Annuncio",
    es: "Título del Anuncio",
    ru: "Название объявления",
  },
  "listing.description": {
    en: "Description",
    de: "Beschreibung",
    it: "Descrizione",
    es: "Descripción",
    ru: "Описание",
  },
  "listing.category": {
    en: "Category",
    de: "Kategorie",
    it: "Categoria",
    es: "Categoría",
    ru: "Категория",
  },
  "listing.type": {
    en: "Type",
    de: "Typ",
    it: "Tipo",
    es: "Tipo",
    ru: "Тип",
  },
  "listing.condition": {
    en: "Condition",
    de: "Zustand",
    it: "Condizione",
    es: "Condición",
    ru: "Состояние",
  },
  "listing.area": {
    en: "Area (Square Meters)",
    de: "Fläche (Quadratmeter)",
    it: "Area (Metri Quadrati)",
    es: "Área (Metros Cuadrados)",
    ru: "Площадь (квадратные метры)",
  },
  "listing.features": {
    en: "Features",
    de: "Eigenschaften",
    it: "Caratteristiche",
    es: "Características",
    ru: "Особенности",
  },
  "listing.photos": {
    en: "Photos (Max 5)",
    de: "Fotos (Max. 5)",
    it: "Foto (Max 5)",
    es: "Fotos (Máx 5)",
    ru: "Фотографии (макс. 5)",
  },
  "listing.addPhotos": {
    en: "Add Photos",
    de: "Fotos hinzufügen",
    it: "Aggiungi Foto",
    es: "Agregar Fotos",
    ru: "Добавить фотографии",
  },
  "listing.location": {
    en: "Location",
    de: "Standort",
    it: "Posizione",
    es: "Ubicación",
    ru: "Местоположение",
  },
  "listing.streetAddress": {
    en: "Street Address",
    de: "Straßenadresse",
    it: "Indirizzo",
    es: "Dirección",
    ru: "Адрес",
  },
  "listing.city": {
    en: "City",
    de: "Stadt",
    it: "Città",
    es: "Ciudad",
    ru: "Город",
  },
  "listing.state": {
    en: "State",
    de: "Bundesland",
    it: "Stato",
    es: "Estado",
    ru: "Регион",
  },
  "listing.zipCode": {
    en: "ZIP Code",
    de: "Postleitzahl",
    it: "Codice Postale",
    es: "Código Postal",
    ru: "Почтовый индекс",
  },
  "listing.contactPhone": {
    en: "Contact Phone Number",
    de: "Kontakt-Telefonnummer",
    it: "Numero di Telefono",
    es: "Número de Contacto",
    ru: "Контактный телефон",
  },
  "listing.listingType": {
    en: "Listing Type",
    de: "Anzeigentyp",
    it: "Tipo di Annuncio",
    es: "Tipo de Anuncio",
    ru: "Тип объявления",
  },
  "listing.availableForRent": {
    en: "Available for Rent",
    de: "Zur Miete verfügbar",
    it: "Disponibile per Affitto",
    es: "Disponible para Alquiler",
    ru: "Доступно для аренды",
  },
  "listing.availableForSale": {
    en: "Available for Sale",
    de: "Zum Verkauf verfügbar",
    it: "Disponibile per Vendita",
    es: "Disponible para Venta",
    ru: "Доступно для продажи",
  },
  "listing.rentalPricing": {
    en: "Rental Pricing",
    de: "Mietpreise",
    it: "Prezzi di Affitto",
    es: "Precios de Alquiler",
    ru: "Цены на аренду",
  },
  "listing.dailyRate": {
    en: "Daily Rate ($)",
    de: "Tagespreis ($)",
    it: "Tariffa Giornaliera ($)",
    es: "Tarifa Diaria ($)",
    ru: "Дневная ставка ($)",
  },
  "listing.weeklyRate": {
    en: "Weekly Rate ($)",
    de: "Wochenpreis ($)",
    it: "Tariffa Settimanale ($)",
    es: "Tarifa Semanal ($)",
    ru: "Недельная ставка ($)",
  },
  "listing.monthlyRate": {
    en: "Monthly Rate ($)",
    de: "Monatspreis ($)",
    it: "Tariffa Mensile ($)",
    es: "Tarifa Mensual ($)",
    ru: "Месячная ставка ($)",
  },
  "listing.securityDeposit": {
    en: "Security Deposit ($)",
    de: "Kaution ($)",
    it: "Cauzione ($)",
    es: "Depósito de Seguridad ($)",
    ru: "Залог ($)",
  },
  "listing.minRentalDays": {
    en: "Min Rental Days",
    de: "Min. Miettage",
    it: "Giorni Min. Affitto",
    es: "Días Mín. Alquiler",
    ru: "Мин. дни аренды",
  },
  "listing.maxRentalDays": {
    en: "Max Rental Days",
    de: "Max. Miettage",
    it: "Giorni Max. Affitto",
    es: "Días Máx. Alquiler",
    ru: "Макс. дни аренды",
  },
  "listing.salePrice": {
    en: "Sale Price ($)",
    de: "Verkaufspreis ($)",
    it: "Prezzo di Vendita ($)",
    es: "Precio de Venta ($)",
    ru: "Цена продажи ($)",
  },
  "listing.updating": {
    en: "Updating Listing...",
    de: "Anzeige wird aktualisiert...",
    it: "Aggiornamento Annuncio...",
    es: "Actualizando Anuncio...",
    ru: "Обновление объявления...",
  },
  "listing.updateListing": {
    en: "UPDATE LISTING",
    de: "ANZEIGE AKTUALISIEREN",
    it: "AGGIORNA ANNUNCIO",
    es: "ACTUALIZAR ANUNCIO",
    ru: "ОБНОВИТЬ ОБЪЯВЛЕНИЕ",
  },
  "listing.myListings": {
    en: "My Listings",
    de: "Meine Anzeigen",
    it: "I Miei Annunci",
    es: "Mis Anuncios",
    ru: "Мои объявления",
  },
  "listing.archivedListings": {
    en: "Archived Listings",
    de: "Archivierte Anzeigen",
    it: "Annunci Archiviati",
    es: "Anuncios Archivados",
    ru: "Архивированные объявления",
  },
  "listing.noListings": {
    en: "No listings found",
    de: "Keine Anzeigen gefunden",
    it: "Nessun annuncio trovato",
    es: "No se encontraron anuncios",
    ru: "Объявления не найдены",
  },
  "listing.confirmDelete": {
    en: "Are you sure you want to delete this listing?",
    de: "Sind Sie sicher, dass Sie diese Anzeige löschen möchten?",
    it: "Sei sicuro di voler eliminare questo annuncio?",
    es: "¿Estás seguro de que quieres eliminar este anuncio?",
    ru: "Вы уверены, что хотите удалить это объявление?",
  },
  "listing.confirmArchive": {
    en: "Are you sure you want to archive this listing?",
    de: "Sind Sie sicher, dass Sie diese Anzeige archivieren möchten?",
    it: "Sei sicuro di voler archiviare questo annuncio?",
    es: "¿Estás seguro de que quieres archivar este anuncio?",
    ru: "Вы уверены, что хотите архивировать это объявление?",
  },

  // Search and filters
  "search.forSale": {
    en: "For Sale",
    de: "Zu verkaufen",
    it: "In Vendita",
    es: "En Venta",
    ru: "На продажу",
  },
  "search.forRent": {
    en: "For Rent",
    de: "Zu vermieten",
    it: "In Affitto",
    es: "En Alquiler",
    ru: "В аренду",
  },
  "search.both": {
    en: "Both",
    de: "Beide",
    it: "Entrambi",
    es: "Ambos",
    ru: "Оба",
  },
  "search.saleRentType": {
    en: "Sale/Rent Type",
    de: "Verkauf/Miete Typ",
    it: "Tipo Vendita/Affitto",
    es: "Tipo Venta/Alquiler",
    ru: "Тип продажа/аренда",
  },

  // Navigation
  "common.previous": {
    en: "Previous",
    de: "Zurück",
    it: "Precedente",
    es: "Anterior",
    ru: "Назад",
  },
  "common.next": {
    en: "Next",
    de: "Weiter",
    it: "Avanti",
    es: "Siguiente",
    ru: "Далее",
  },
  "common.edit": {
    en: "Edit",
    de: "Bearbeiten",
    it: "Modifica",
    es: "Editar",
    ru: "Редактировать",
  },
  "common.delete": {
    en: "Delete",
    de: "Löschen",
    it: "Elimina",
    es: "Eliminar",
    ru: "Удалить",
  },
  "common.save": {
    en: "Save",
    de: "Speichern",
    it: "Salva",
    es: "Guardar",
    ru: "Сохранить",
  },
  "common.confirm": {
    en: "Confirm",
    de: "Bestätigen",
    it: "Conferma",
    es: "Confirmar",
    ru: "Подтвердить",
  },
  "common.yes": {
    en: "Yes",
    de: "Ja",
    it: "Sì",
    es: "Sí",
    ru: "Да",
  },
  "common.no": {
    en: "No",
    de: "Nein",
    it: "No",
    es: "No",
    ru: "Нет",
  },
  "common.buy": {
    en: "Buy",
    de: "Kaufen",
    it: "Compra",
    es: "Comprar",
    ru: "Купить",
  },
  "common.rent": {
    en: "Rent",
    de: "Mieten",
    it: "Affitta",
    es: "Alquilar",
    ru: "Арендовать",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
