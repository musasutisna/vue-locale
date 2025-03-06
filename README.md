<h1 align="center">Vue Locale</h1>

A lightweight and efficient Vue localization package that simplifies multilingual support in Vue applications, built on top of [vue-i18n](https://vue-i18n.intlify.dev). It loads language sets from files and automatically sets the language based on the user's browser.

## Getting started

Lets install vue-locale with npm

```console
npm install --save @musasutisna/vue-locale
```

After the installation is complete, add the locale package and integrate it into your Vue app in `main.js`.

```js
import locale from '@musasutisna/vue-locale'
```

```js
app.use(locale({
  supported: ['en'],
  initial: 'en',
  scope: 'global'
}))
```

## Configuration

The locale can be configured using the options: `supported`, `initial`, and `scope` to interact with vue-i18n

* `supported`: A list of available languages for the application.
* `initial`: The default language used when the user's browser language is not in the supported list.
* `scope`: The vue-i18n mechanism for defining the localization scope, whether using mode options or the Composition API (reference: [vue-i18n locale](https://vue-i18n.intlify.dev/guide/essentials/scope)).

## Language sets

Language sets are located in the Vue public directory under the locales folder.

```sh
mkdir -p {YOUR_VUE_APP_PATH}/public/locales
```

Language files are formatted using IANA language codes and saved as JSON files.

```sh
touch {YOUR_VUE_APP_PATH}/public/locales/en.json
```

Vue I18n can use message format syntax to localize the messages to be displayed in the UI. Vue I18n messages are interpolations and messages with various feature syntax. For more details, refer to [Message Format Syntax](https://vue-i18n.intlify.dev/guide/essentials/syntax.html).

```json
{
  "message": {
    "the_world": "the world",
    "dio": "DIO:",
    "linked": "@:message.dio @:message.the_world !!!!"
  }
}
```

# How to use in your component

Before using localization, you need to load your language sets. The best practice is to load them inside onMounted using i18nSwitchLanguage

```js
import { onMounted, inject } from 'vue'

const switchLanguage = inject('i18nSwitchLanguage')

onMounted(async () => {
  await switchLanguage()
})
```

i18nSwitchLanguage is provided by vue-locale, allowing access via inject or through global properties using $i18nSwitchLanguage.

You can also handle the loading process manually if needed, as loading it instantly (as shown in the previous example) may cause warning messages to appear in the developer console.

In the template, we use the $t translation API injected with Vue I18n, to localize. This allows Vue I18n to change the locale without rewriting the template, also to be able to support the globally application.

```js
<template>
  <p>{{ $t('message.linked') }}</p>
</template>
```

The first argument is `message.linked` as the locale messages key as a parameter to `$t`.

As result the below:

```html
<p>DIO: the world !!!!</p>
```
