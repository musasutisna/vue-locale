import { createI18n } from 'vue-i18n';

/**
 * Creates a new Vue I18n instance.
 *
 * @param {Object} options - Configuration options for Vue I18n.
 * @param {string} [options.initial] - The initial locale, defaults to
 * the browser's locale if not set.
 * @param {string[]} options.supported - A list of supported locales.
 * @param {string} options.scope - The localization scope.
 * @returns {void}
 */

export default function (options = {}) {
  const self = {
    app: null,
    i18n: null
  }

  // Merge default options with user-provided options
  const {
    initial = 'en',
    supported = ['en'],
    scope = 'global'
  } = options

  /**
   * Retrieves the current user's browser locale.
   *
   * @return {string} The browser's locale.
   */
  function getBrowserLocale() {
    // e.g., "en-US" or "fr"
    const browserLocaleLang = navigator.language || navigator.languages[0]

    // Simplify to "en" or "fr"
    return browserLocaleLang.split('-')[0]
  }

/**
 * Fetches JSON language files from the `public/locales` directory using the Vite base path.
 *
 * @param {string} locale - The locale code (e.g., "en", "fr") to load.
 * @returns {Promise<Object|null>} A promise that resolves to the JSON content of the locale
 * file, or `null` if the fetch fails.
 */
  async function loadMessages(locale) {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
    const url = `${normalizedBase}locales/${locale}.json`

    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Failed to fetch ${locale}.json`)

      return await response.json()
    } catch (error) {
      return null
    }
  }

  /**
   * Switches the application language.
   *
   * @param {string} locale - The locale code to switch to.
   * If the specified locale is not supported, it falls back to the initial locale.
   * 
   * If the locale messages are not already loaded, it fetches and sets them dynamically.
   * The locale is then updated reactively.
   * @returns {void}
   */
  async function switchLanguage(locale) {
    if (!supported.includes(locale)) locale = initial

    if (!self.i18n.global.availableLocales.includes(locale)) {
      const messages = await loadMessages(locale)

      if (messages !== null) {
        self.i18n.global.setLocaleMessage(locale, messages)
      }
    }

    // Update locale reactively
    self.i18n.global.locale.value = locale
  }

  return {
    async install(app) {
      self.app = app

      // Create i18n instance
      self.i18n = createI18n({
        legacy: false,
        locale: getBrowserLocale(),
        fallbackLocale: initial,
        scope: scope,
        messages: {}
      })

      // Install i18n to the app with global scope
      app.use(self.i18n)

      // Allow to self switch language
      app.config.globalProperties.$i18nSwitchLanguage = switchLanguage

      app.provide('i18nSwitchLanguage', switchLanguage)
    }
  }
}
