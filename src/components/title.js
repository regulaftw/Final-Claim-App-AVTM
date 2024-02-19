import React, { useEffect, useState } from 'react';
import './title.css'; 

const Title = () => {
    const textData = "Aventis Metaverse";

    // Function to create spans with random delay
    const createSpansWithRandomDelays = (text) => {
        return text.split(' ').join(' \u00A0 ').split('').map((char, index) => {
            const delay = Math.random() * 2; 
            return { char, key: `char-${index}`, delay };
        });
    };

    const [spans, setSpans] = useState([]);

    useEffect(() => {
        setSpans(createSpansWithRandomDelays(textData));
    }, [textData]);

    return (
        <div className="animated-title" aria-label={textData}>
            {spans.map(({ char, key, delay }) => (
                <span 
                    key={key} 
                    className="animated-element" 
                    aria-hidden="true"
                    style={{ animationDelay: `${delay}s` }}
                >
                    {char}
                </span>
            ))}
        </div>
    );
};

export default Title;
