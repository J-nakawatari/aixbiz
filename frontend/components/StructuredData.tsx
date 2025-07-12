export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AI導入ナビゲーター",
    "alternateName": "aixbiz",
    "url": "https://aixbiz.jp",
    "logo": "https://aixbiz.jp/logo.png",
    "description": "中小企業のためのAI業務改善診断サービス。高額なシステムや複雑なAI導入は不要。無料診断で御社に最適なAI活用法をご提案します。",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@aixbiz.jp",
      "contactType": "customer service",
      "availableLanguage": "Japanese"
    },
    "sameAs": [
      "https://twitter.com/aixbiz",
      "https://www.facebook.com/aixbiz"
    ]
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI業務改善診断サービス",
    "provider": {
      "@type": "Organization",
      "name": "AI導入ナビゲーター"
    },
    "description": "中小企業向けのAI導入・活用診断サービス。無料で業務改善のためのAI活用法をご提案します。",
    "areaServed": {
      "@type": "Country",
      "name": "Japan"
    },
    "serviceType": "AI Consulting",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY",
      "name": "無料AI業務改善診断"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
    </>
  );
}