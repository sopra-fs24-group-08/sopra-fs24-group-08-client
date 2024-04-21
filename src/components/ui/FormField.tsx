import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({ label, value, onChange }) => (
    <div className="login field">
        <label className="login label">{label}</label>
        <input
            className="login input"
            type={label === "Password" ? "password" : "text"}
            placeholder="Enter here..."
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

export default FormField;
