// components/BackButton.tsx
import { useRouter } from 'next/navigation';
import React from 'react';

const BackButton: React.FC = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <button onClick={handleBack} className="btn-back">
            <img src="/back-prev-page.png" alt="Voltar" width="32" height="32" />
        </button>
    );
};

export default BackButton;