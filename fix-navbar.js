const fs = require('fs');
let content = fs.readFileSync('jewelry-store/src/components/Navbar.tsx', 'utf8');

const replacements = [
  ["alt: '\u0645\u062c\u0648\u0647\u0631\u0627\u062a \u0630\u0647\u0628'", "alt: t('nav.promoAlt.gold')"],
  ["sublabel: '\u0623\u0646\u0627\u0642\u0629 \u062e\u0627\u0644\u062f\u0629'", "sublabel: t('nav.promo.gold')"],
  ["alt: '\u0645\u062c\u0648\u0647\u0631\u0627\u062a \u0641\u0636\u0629'", "alt: t('nav.promoAlt.silver')"],
  ["sublabel: '\u062c\u0645\u0627\u0644 \u0646\u0642\u064a'", "sublabel: t('nav.promo.silver')"],
  ["alt: '\u0645\u062c\u0648\u0647\u0631\u0627\u062a \u0628\u0644\u0627\u062a\u064a\u0646'", "alt: t('nav.promoAlt.platinum')"],
  ["sublabel: '\u0641\u062e\u0627\u0645\u0629 \u0645\u0637\u0644\u0642\u0629'", "sublabel: t('nav.promo.platinum')"],
  ["alt: '\u0645\u062c\u0648\u0647\u0631\u0627\u062a \u0639\u0635\u0631\u064a\u0629'", "alt: t('nav.promoAlt.modern')"],
  ["sublabel: '\u0623\u0633\u0644\u0648\u0628 \u062d\u064a\u0627\u062a\u0643'", "sublabel: t('nav.promo.modern')"],
  ["alt: '\u0632\u0641\u0627\u0641 \u0648\u062e\u0637\u0648\u0628\u0629'", "alt: t('nav.promoAlt.wedding')"],
  ["sublabel: '\u0644\u062d\u0638\u0629 \u0644\u0627 \u062a\u064f\u0646\u0633\u0649'", "sublabel: t('nav.promo.wedding')"],
  ["alt: '\u0647\u062f\u0627\u064a\u0627 \u0648\u0645\u0646\u0627\u0633\u0628\u0627\u062a'", "alt: t('nav.promoAlt.gifts')"],
  ["sublabel: '\u0627\u0641\u0631\u062d\u064a \u0645\u0646 \u062a\u062d\u0628\u064a\u0646'", "sublabel: t('nav.promo.gifts')"],
];

for (const [oldStr, newStr] of replacements) {
  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    console.log('Replaced: ' + oldStr.substring(0, 40) + '...');
  } else {
    console.log('NOT FOUND: ' + oldStr.substring(0, 40) + '...');
  }
}

content = content.replace(
  '<span className="text-[11px] font-bold">\u0635\u0645\u0651\u0645</span>',
  "<span className=\"text-[11px] font-bold\">{t('nav.design')}</span>"
);

content = content.replace(
  '<span className="text-[11px]">\u0633\u0648\u0631\u064a\u0627</span>',
  "<span className=\"text-[11px]\">{t('nav.country')}</span>"
);

content = content.replace(
  '>\u062c\u062f\u064a\u062f<',
  ">{t('nav.new')}<"
);

content = content.replace(
  'className="absolute bottom-4 right-4 text-right"',
  "className={`absolute bottom-4 ${lang === 'en' ? 'left-4 text-left' : 'right-4 text-right'}`}"
);

fs.writeFileSync('jewelry-store/src/components/Navbar.tsx', content, 'utf8');
console.log('Done!');