const siteName = 'Nuxt - Laravel Sanctum'

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'red',
      neutral: 'zinc'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    }
  },
  seo: {
    siteName: siteName
  },
  header: {
    title: siteName,
    to: '/',
    logo: {
      alt: 'Laravel Sanctum',
      light: 'logo.svg',
      dark: 'logo.svg'
    },
    search: true,
    colorMode: true,
    links: [
      {
        'icon': 'i-simple-icons-github',
        'to': 'https://github.com/manchenkoff/nuxt-auth-sanctum',
        'target': '_blank',
        'aria-label': 'GitHub'
      },
      {
        'icon': 'i-simple-icons-nuxt',
        'to': 'https://nuxt.com/modules/nuxt-auth-sanctum',
        'target': '_blank',
        'aria-label': 'Nuxt Module'
      }
    ]
  },
  footer: {
    credits: `Artem Manchenkov © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [
      {
        'icon': 'i-simple-icons-github',
        'to': 'https://github.com/manchenkoff',
        'target': '_blank',
        'aria-label': 'manchenkoff on GitHub'
      },
      {
        'icon': 'i-simple-icons-twitter',
        'to': 'https://twitter.com/amanchenkov',
        'target': '_blank',
        'aria-label': 'manchenkoff on X'
      },
      {
        'icon': 'i-simple-icons-facebook',
        'to': 'https://fb.com/manchenkoff',
        'target': '_blank',
        'aria-label': 'manchenkoff on Facebook'
      },
      {
        'icon': 'i-simple-icons-linkedin',
        'to': 'https://linkedin.com/in/manchenkoff',
        'target': '_blank',
        'aria-label': 'manchenkoff on LinkedIn'
      },
      {
        'icon': 'i-simple-icons-instagram',
        'to': 'https://instagram.com/manchenkof',
        'target': '_blank',
        'aria-label': 'manchenkoff on Instagram'
      },
      {
        'icon': 'i-simple-icons-threads',
        'to': 'https://threads.net/@manchenkof',
        'target': '_blank',
        'aria-label': 'manchenkoff on Threads'
      },
      {
        'icon': 'i-simple-icons-youtube',
        'to': 'https://youtube.com/@manchenkoff',
        'target': '_blank',
        'aria-label': 'manchenkoff on YouTube'
      },
      {
        'icon': 'i-simple-icons-medium',
        'to': 'https://manchenkoff.medium.com/',
        'target': '_blank',
        'aria-label': 'manchenkoff on Medium'
      },
      {
        'icon': 'i-simple-icons-telegram',
        'to': 'https://t.me/manchenkoff',
        'target': '_blank',
        'aria-label': 'manchenkoff on Telegram'
      },
      {
        'icon': 'i-simple-icons-bluesky',
        'to': 'https://bsky.app/profile/manchenkoff.bsky.social',
        'target': '_blank',
        'aria-label': 'manchenkoff on Bluesky'
      }
    ]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Ready to contribute?',
      edit: 'https://github.com/manchenkoff/nuxt-auth-sanctum/edit/main/docs/content',
      links: [
        {
          icon: 'i-lucide-star',
          label: 'Star on GitHub',
          to: 'https://github.com/manchenkoff/nuxt-auth-sanctum',
          target: '_blank'
        },
        {
          icon: 'i-lucide-git-pull-request-create',
          label: 'Suggest a feature',
          to: 'https://github.com/manchenkoff/nuxt-auth-sanctum/issues/new?template=feature_request.md',
          target: '_blank'
        },
        {
          icon: 'i-simple-icons-github',
          label: 'Support project',
          to: 'https://github.com/sponsors/manchenkoff?o=esb',
          target: '_blank'
        },
        {
          icon: 'i-simple-icons-buymeacoffee',
          label: 'Buy me a coffee',
          to: 'https://buymeacoffee.com/manchenkoff',
          target: '_blank'
        }
      ]
    }
  }
})
