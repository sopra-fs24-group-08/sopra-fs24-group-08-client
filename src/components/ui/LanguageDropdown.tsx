import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const LanguageDropdown = ({ languageType, setTargetLanguage, setSourceLanguage }) => {
    const [languages, setLanguages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            const response = await fetch("https://translation.googleapis.com/language/translate/v2/languages?key=AIzaSyBa6V3OcgeYaX-r1w8ilrrN3HqZ6JKXZZY");
            const data = await response.json();
            const languageList = data.data.languages.map(language => ({
                language: language.language,
                name: language.language
            }));
            setLanguages(languageList);
        } catch (error) {
            console.error("Fehler beim Abrufen der Sprachen:", error);
        }
    };

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
            <h3>{languageType === 'source' ? 'Ausgangssprache:' : 'Zielsprache:'}</h3>
            <input
                type="text"
                placeholder="Sprachen suchen..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <select onChange={handleLanguageChange}>
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
