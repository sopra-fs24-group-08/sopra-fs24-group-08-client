// ToastContext.js
import React, { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const notify = (content) => {
        toast(content);
    };

    return (
        <ToastContext.Provider value={notify}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node 
};
