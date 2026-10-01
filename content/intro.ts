/**
 * Copy for the opening blessing intro overlay. Kept in `content/` (rather
 * than inlined in the component) so it follows the same "content lives in
 * content/*" convention as the rest of the site, even though it's
 * presentational/one-off copy specific to the intro sequence.
 */
export const introContent = {
  /** The complete traditional Ganesha Vandana shloka, in Devanagari (two
   * lines). Rendered with the line break preserved. */
  shlokaDevanagari:
    "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव शुभकार्येषु सर्वदा ॥",
  /** Roman transliteration of the same verse. */
  shlokaTransliteration:
    "Vakratunda Mahakaya Suryakoti Samaprabha, Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada.",
  /** A personal blessing line typed out beneath the shloka. */
  blessingLine:
    "हे विघ्नहर्ता, हमारी इस नई यात्रा को अपने आशीर्वाद से शुभ करें।",
} as const;
