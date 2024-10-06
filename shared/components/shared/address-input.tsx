'use client';

import React from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

interface Props {
    onChange?: (value?: string) => void;
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
    return (
        <AddressSuggestions
            token="a5cace7785853b74a3aad410d77b7a251d26bfce"
            onChange={(data) => onChange?.(data?.value)}
        />
    );
};
