const translations = {
  en: {
    // Banner
    banner_q: 'Would you like this site in Spanish?',
    banner_yes: 'Yes, switch to Spanish',
    banner_no: 'No thanks',
    lang_toggle: 'Español',

    // Common
    loading: 'Loading…',

    // Nav
    nav_dashboard: 'Dashboard',
    nav_signin: 'Sign in',
    nav_signout: 'Sign out',

    // Landing
    landing_eyebrow: 'Scheduling, minus the back-and-forth',
    landing_heading: 'Share a link. Get booked.',
    landing_desc: 'Give people one link. They pick a time. You get a booking.',
    landing_cta_primary: 'Create your page →',

    // Login
    login_eyebrow: 'Sign in or create an account',
    login_heading: 'Welcome',
    login_check_heading: 'Check your email',
    login_check_desc: (email) =>
      `We sent a sign-in link to ${email}. Click it to continue — no password needed.`,
    login_email_label: 'Email',
    login_email_placeholder: 'you@example.com',
    login_send_btn: 'Send me a sign-in link',
    login_sending: 'Sending…',
    login_note:
      'We use passwordless sign-in. First time? An account is created automatically.',
    login_invalid_email: 'Enter a valid email address.',

    // Dashboard
    dash_eyebrow: 'Your booking page',
    dash_heading: 'Dashboard',
    dash_settings: 'Settings',
    dash_calendar: 'Calendar',
    dash_display_name: 'Display name',
    dash_slug: 'Booking URL slug',
    dash_bio: 'Short bio (optional)',
    dash_bio_placeholder: "Let's talk about your project.",
    dash_day_starts: 'Day starts',
    dash_day_ends: 'Day ends',
    dash_slot_length: 'Slot length',
    dash_slot_15: '15 minutes',
    dash_slot_30: '30 minutes',
    dash_slot_60: '60 minutes',
    dash_available_days: 'Available days',
    dash_create: 'Create my page',
    dash_save: 'Save changes',
    dash_saving: 'Saving…',
    dash_view_public: 'View my public page ↗',
    dash_upcoming: 'Upcoming bookings',
    dash_save_first: 'Save your page first, then share your link to start getting bookings.',
    dash_no_bookings: 'No upcoming bookings yet. Share your link!',
    dash_cancel: 'Cancel',
    dash_err_required: 'Name and URL slug are required.',
    dash_err_taken: 'That URL is taken — try another.',
    dash_saved: 'Saved.',
    dash_google_ok: 'Google Calendar connected ✅',
    dash_google_fail: 'Google connection failed — please try again.',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    // Booking page
    book_eyebrow: (n) => `Book a ${n}-minute call`,
    book_pick_day: 'Pick a day',
    book_no_times: 'No times left on this day.',
    book_back: '← Back',
    book_your_name: 'Your name',
    book_your_email: 'Your email',
    book_about: "What's this about? (optional)",
    book_confirm: 'Confirm booking',
    book_confirming: 'Booking…',
    book_err_invalid: 'Please enter a valid name and email.',
    book_err_taken: 'Sorry, that slot was just booked. Pick another.',
    book_done_heading: "You're booked",
    book_done_hold: (name) => `A calendar hold for ${name} has been recorded.`,
    book_another: 'Book another time',
    book_not_found: 'Page not found',
    book_not_found_desc: 'No booking page exists at this link.',
    book_go_home: 'Go home',

    // Connect Google button
    google_redirecting: 'Redirecting…',
    google_connect: '📅 Connect Google Calendar',
    google_login_first: 'Please log in first.',
  },

  es: {
    // Banner
    banner_q: '¿Te gustaría ver este sitio en inglés?',
    banner_yes: 'Sí, cambiar a inglés',
    banner_no: 'No, gracias',
    lang_toggle: 'English',

    // Common
    loading: 'Cargando…',

    // Nav
    nav_dashboard: 'Panel',
    nav_signin: 'Iniciar sesión',
    nav_signout: 'Cerrar sesión',

    // Landing
    landing_eyebrow: 'Agenda sin idas y venidas',
    landing_heading: 'Comparte un enlace. Recibe reservas.',
    landing_desc: 'Comparte un enlace. Eligen un horario. Recibes la reserva.',
    landing_cta_primary: 'Crea tu página →',

    // Login
    login_eyebrow: 'Inicia sesión o crea una cuenta',
    login_heading: 'Bienvenido',
    login_check_heading: 'Revisa tu correo',
    login_check_desc: (email) =>
      `Enviamos un enlace de acceso a ${email}. Haz clic para continuar — no se necesita contraseña.`,
    login_email_label: 'Correo electrónico',
    login_email_placeholder: 'tú@ejemplo.com',
    login_send_btn: 'Enviarme un enlace de acceso',
    login_sending: 'Enviando…',
    login_note:
      'Usamos acceso sin contraseña. ¿Primera vez? Se crea una cuenta automáticamente.',
    login_invalid_email: 'Ingresa una dirección de correo válida.',

    // Dashboard
    dash_eyebrow: 'Tu página de reservas',
    dash_heading: 'Panel',
    dash_settings: 'Configuración',
    dash_calendar: 'Calendario',
    dash_display_name: 'Nombre a mostrar',
    dash_slug: 'URL de reservas',
    dash_bio: 'Bio corta (opcional)',
    dash_bio_placeholder: 'Hablemos sobre tu proyecto.',
    dash_day_starts: 'Inicio del día',
    dash_day_ends: 'Fin del día',
    dash_slot_length: 'Duración de espacios',
    dash_slot_15: '15 minutos',
    dash_slot_30: '30 minutos',
    dash_slot_60: '60 minutos',
    dash_available_days: 'Días disponibles',
    dash_create: 'Crear mi página',
    dash_save: 'Guardar cambios',
    dash_saving: 'Guardando…',
    dash_view_public: 'Ver mi página pública ↗',
    dash_upcoming: 'Próximas reservas',
    dash_save_first:
      'Guarda tu página primero y luego comparte tu enlace para empezar a recibir reservas.',
    dash_no_bookings: 'Sin reservas próximas aún. ¡Comparte tu enlace!',
    dash_cancel: 'Cancelar',
    dash_err_required: 'El nombre y la URL son obligatorios.',
    dash_err_taken: 'Esa URL ya está en uso — intenta con otra.',
    dash_saved: 'Guardado.',
    dash_google_ok: 'Google Calendar conectado ✅',
    dash_google_fail: 'Conexión con Google fallida — por favor intenta de nuevo.',
    days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],

    // Booking page
    book_eyebrow: (n) => `Reservar una llamada de ${n} minutos`,
    book_pick_day: 'Elige un día',
    book_no_times: 'No hay horarios disponibles este día.',
    book_back: '← Atrás',
    book_your_name: 'Tu nombre',
    book_your_email: 'Tu correo electrónico',
    book_about: '¿De qué se trata? (opcional)',
    book_confirm: 'Confirmar reserva',
    book_confirming: 'Reservando…',
    book_err_invalid: 'Por favor ingresa un nombre y correo válidos.',
    book_err_taken: 'Lo sentimos, ese espacio acaba de ser reservado. Elige otro.',
    book_done_heading: '¡Reserva confirmada!',
    book_done_hold: (name) => `Se registró un espacio en el calendario de ${name}.`,
    book_another: 'Reservar otro horario',
    book_not_found: 'Página no encontrada',
    book_not_found_desc: 'No existe una página de reservas en este enlace.',
    book_go_home: 'Ir al inicio',

    // Connect Google button
    google_redirecting: 'Redirigiendo…',
    google_connect: '📅 Conectar Google Calendar',
    google_login_first: 'Por favor inicia sesión primero.',
  },
}

export default translations
