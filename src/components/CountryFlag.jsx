import React from 'react';

// Mapeamento de código ISO alfa-2 para renderizar a imagem SVG real da bandeira com flagcdn
const ISO2_MAP = {
  BRA: 'br',
  USA: 'us',
  JPN: 'jp',
  DEU: 'de',
  CHN: 'cn',
  IND: 'in',
  GBR: 'gb',
  FRA: 'fr',
  ITA: 'it',
  CAN: 'ca',
  AUS: 'au',
  KOR: 'kr',
  MEX: 'mx',
  ESP: 'es',
  IDN: 'id',
  SAU: 'sa',
  CHE: 'ch',
  SGP: 'sg',
  NZL: 'nz',
  ARG: 'ar',
  EGY: 'eg',
  ZAF: 'za',
  NGA: 'ng',
  NLD: 'nl',
  TUR: 'tr'
};

export default function CountryFlag({ countryId, fallbackEmoji = '🏳️', size = 'md', className = '' }) {
  const code = countryId ? ISO2_MAP[countryId.toUpperCase()] : null;

  // Dimensões estilizadas com proporção padrão de bandeira 4:3 com cantos arredondados e sombra sutil
  const sizeClasses = {
    sm: 'w-6 h-4 min-w-[24px]',
    md: 'w-9 h-6 min-w-[36px]',
    lg: 'w-12 h-8 min-w-[48px]',
    xl: 'w-16 h-11 min-w-[64px]'
  };

  if (!code) {
    return <span className={`inline-block ${className}`}>{fallbackEmoji}</span>;
  }

  const flagUrl = `https://flagcdn.com/w80/${code}.png`;

  return (
    <div className={`inline-flex items-center justify-center overflow-hidden rounded-md shadow-sm border border-black/10 dark:border-white/10 shrink-0 bg-gray-100 dark:bg-gray-800 ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <img
        src={flagUrl}
        alt={`Bandeira ${countryId}`}
        loading="lazy"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback gracioso para emoji se falhar a imagem
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.parentElement) {
            e.currentTarget.parentElement.innerText = fallbackEmoji;
          }
        }}
      />
    </div>
  );
}
