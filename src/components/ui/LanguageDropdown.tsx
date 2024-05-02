import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const LanguageDropdown = ({ languageType, setTargetLanguage, setSourceLanguage }) => {
    const [languages, setLanguages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const languageNames = {
        "af": "Afrikaans",
        "ak": "Akan",
        "am": "Amharisch - አማርኛ",
        "ar": "Arabisch - العربية",
        "as": "Assamesisch - অসমীয়া",
        "ay": "Aymara - Aymar aru",
        "az": "Aserbaidschanisch - azərbaycan dili",
        "be": "Weißrussisch - беларуская мова",
        "bg": "Bulgarisch - български език",
        "bho": "Bhojpuri - भोजपुरी",
        "bm": "Bambara - bamanankan",
        "bn": "Bengalisch - বাংলা",
        "bs": "Bosnisch - bosanski jezik",
        "ca": "Katalanisch - català",
        "ceb": "Cebuano",
        "ckb": "Sorani-Kurdisch - کوردیی ناوەندی",
        "co": "Korsisch - corsu",
        "cs": "Tschechisch - čeština",
        "cy": "Walisisch - Cymraeg",
        "da": "Dänisch - dansk",
        "de": "Deutsch",
        "doi": "Dogri - डोगरी",
        "dv": "Dhivehi - ދިވެހި",
        "ee": "Ewe - Eʋegbe",
        "el": "Griechisch - Ελληνικά",
        "en": "Englisch",
        "eo": "Esperanto",
        "es": "Spanisch - español",
        "et": "Estnisch - eesti",
        "eu": "Baskisch - euskara",
        "fa": "Persisch - فارسی",
        "fi": "Finnisch - suomi",
        "fr": "Französisch - français",
        "fy": "Westfriesisch - Frysk",
        "ga": "Irisch - Gaeilge",
        "gd": "Schottisch-Gälisch - Gàidhlig",
        "gl": "Galizisch - galego",
        "gn": "Guaraní - Avañe'ẽ",
        "gom": "Goanisch - गोंयची कोंकणी / Gõychi Konknni",
        "gu": "Gujarati - ગુજરાતી",
        "ha": "Hausa - هَوُسَ",
        "haw": "Hawaiisch - ʻŌlelo Hawaiʻi",
        "he": "Hebräisch - עברית",
        "hi": "Hindi - हिन्दी",
        "hmn": "Hmong - Hmoob",
        "hr": "Kroatisch - hrvatski jezik",
        "ht": "Haitianisch - Kreyòl ayisyen",
        "hu": "Ungarisch - magyar",
        "hy": "Armenisch - Հայերեն",
        "id": "Indonesisch - Bahasa Indonesia",
        "ig": "Igbo - Asụsụ Igbo",
        "ilo": "Ilokano",
        "is": "Isländisch - Íslenska",
        "it": "Italienisch - italiano",
        "iw": "Hebräisch - עברית",
        "ja": "Japanisch - 日本語",
        "jv": "Javanisch - basa Jawa",
        "jw": "Javanisch - ꦧꦱꦗꦮ",
        "ka": "Georgisch - ქართული",
        "kk": "Kasachisch - қазақ тілі",
        "km": "Khmer - ខ្មែរ",
        "kn": "Kannada - ಕನ್ನಡ",
        "ko": "Koreanisch - 한국어",
        "kri": "Krio - kriolu",
        "ku": "Kurdisch - Kurdî",
        "ky": "Kirgisisch - Кыргызча",
        "la": "Lateinisch - latine",
        "lb": "Luxemburgisch - Lëtzebuergesch",
        "lg": "Luganda",
        "ln": "Lingála",
        "lo": "Laotisch - ພາສາລາວ",
        "lt": "Litauisch - lietuvių kalba",
        "lus": "Mizo - Mizo ṭawng",
        "lv": "Lettisch - latviešu valoda",
        "mai": "Maithili - मैथिली, মৈথিলী",
        "mg": "Malagasy - fiteny malagasy",
        "mi": "Maori - te reo Māori",
        "mk": "Mazedonisch - македонски јазик",
        "ml": "Malayalam - മലയാളം",
        "mn": "Mongolisch - Монгол хэл",
        "mni-Mtei": "Meiteilon - মৈতৈলোন্",
        "mr": "Marathi - मराठी",
        "ms": "Malaiisch - Bahasa Melayu",
        "mt": "Maltesisch - Malti",
        "my": "Birmanisch - ဗမာစာ",
        "ne": "Nepali - नेपाली",
        "nl": "Niederländisch - Nederlands",
        "no": "Norwegisch - Norsk",
        "nso": "Nord-Sotho - Sesotho sa Leboa",
        "ny": "Nyanja - chiCheŵa, chinyanja",
        "om": "Oromo - Afaan Oromoo",
        "or": "Oriya - ଓଡ଼ିଆ",
        "pa": "Punjabi - ਪੰਜਾਬੀ",
        "pl": "Polnisch - polski",
        "ps": "Paschtu - پښتو",
        "pt": "Portugiesisch - Português",
        "qu": "Quechua - Runa Simi",
        "ro": "Rumänisch - română",
        "ru": "Russisch - русский язык",
        "rw": "Kinyarwanda - Kinyarwanda",
        "sa": "Sanskrit - संस्कृतम्",
        "sd": "Sindhi - सिन्धी",
        "si": "Singhalesisch - සිංහල",
        "sk": "Slowakisch - slovenčina",
        "sl": "Slowenisch - slovenščina",
        "sm": "Samoanisch - gagana fa'a Samoa",
        "sn": "Shona - chiShona",
        "so": "Somali - Soomaaliga",
        "sq": "Albanisch - Shqip",
        "sr": "Serbisch - српски језик",
        "st": "Sesotho - Sesotho",
        "su": "Sundanesisch - Basa Sunda",
        "sv": "Schwedisch - svenska",
        "sw": "Suaheli - Kiswahili",
        "ta": "Tamilisch - தமிழ்",
        "te": "Telugu - తెలుగు",
        "tg": "Tadschikisch - тоҷикӣ",
        "th": "Thailändisch - ไทย",
        "ti": "Tigrinya - ትግርኛ",
        "tk": "Turkmenisch - Türkmen",
        "tl": "Tagalog - Wikang Tagalog",
        "tr": "Türkisch - Türkçe",
        "ts": "Tsonga - Xitsonga",
        "tt": "Tatarisch - татар теле",
        "ug": "Uigurisch - ئۇيغۇرچە‎",
        "uk": "Ukrainisch - українська мова",
        "ur": "Urdu - اردو",
        "uz": "Usbekisch - Oʻzbek",
        "vi": "Vietnamesisch - Tiếng Việt",
        "xh": "Xhosa - isiXhosa",
        "yi": "Jiddisch - ייִדיש",
        "yo": "Yoruba - Yorùbá",
        "zh": "Chinesisch (vereinfacht) - 中文 (Zhōngwén)",
        "zh-CN": "Chinesisch (vereinfacht) - 中文 (Zhōngwén), 汉语, 漢語",
        "zh-TW": "Chinesisch (traditionell) - 中文 (Zhōngwén), 漢語, 汉语",
        "zu": "Zulu - isiZulu"
    };

  useEffect(() => {
      // Setze die Liste von Sprachen beim Initialisieren
      setLanguages(Object.entries(languageNames).map(([code, name]) => ({ language: code, name })));
  }, []);

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);
    };

    const filteredLanguages = languages.filter((language) => {
        const languageName = language.name.toLowerCase();
        return languageName.includes(searchTerm);
    });

    const handleLanguageChange = (e) => {
        const selectedLanguage = e.target.value;
        if (languageType === 'source') {
            setSourceLanguage(selectedLanguage);
        } else if (languageType === 'target') {
            setTargetLanguage(selectedLanguage);
        }
    };

     return (
            <div>
                <h3>{languageType === 'source' ? 'Language to translate:' : 'Target Language:'}</h3>
                <input
                    type="text"
                    placeholder="Search language"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select onChange={handleLanguageChange}>
                    <option value="">To choose...</option> {/* Leere Option */}
                    {filteredLanguages.map((language) => (
                        <option key={language.language} value={language.language}>
                            {language.name}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

LanguageDropdown.propTypes = {
    languageType: PropTypes.oneOf(['source', 'target']).isRequired,
    setTargetLanguage: PropTypes.func.isRequired,
    setSourceLanguage: PropTypes.func.isRequired
};

export default LanguageDropdown;
