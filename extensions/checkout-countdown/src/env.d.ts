// Ambient types: de Polaris `s-*` JSX-augmentatie voor Preact en de API's die dit blok
// gebruikt op de globale `shopify`.
import '@shopify/ui-extensions/purchase.checkout.block.render';
import type { Api } from '@shopify/ui-extensions/purchase.checkout.block.render';

declare module '@shopify/ui-extensions/checkout' {
  interface ShopifyGlobal extends Pick<Api, 'i18n' | 'settings' | 'extension'> {}
}

export {};
