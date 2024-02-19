import React, { useEffect, useState } from 'react';
import './background1.css';
import Title from './title';

const Background2 = () => {
    const numberOfLetters = 200;
    const characters = ".".split('');

    const createLetters = () => {
        return Array.from({ length: numberOfLetters }, () => {
            return {
                char: characters[Math.floor(Math.random() * characters.length)],
                size: Math.random() * 2 + 1, // Random size between 1 and 3
                duration: Math.random() * 5 + 2, // Random duration between 2 and 7 seconds
                delay: Math.random() * 5, // Random delay up to 5 seconds
                depth: Math.random(), // Represents depth for parallax effect
                initialTop: Math.random() * 100, // Initial top position (percentage)
                initialLeft: Math.random() * 100 // Initial left position (percentage)
            };
        });
    };

    const [letters, setLetters] = useState(createLetters());
    const [offsetY, setOffsetY] = useState(0);
    const handleScroll = () => setOffsetY(window.pageYOffset);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div id="star-animation-container">
            
            <p></p> <p></p> <p></p> <p></p> <p></p> <p></p> <p></p> <p></p> <p></p> <p></p> <p></p> <p></p> <p></p> <p></p>
            {letters.map((letter, index) => (
                <div 
                    key={index}
                    className="letter"
                    style={{
                        animation: `zoomLetter ${letter.duration}s linear ${letter.delay}s infinite`,
                        transform: `scale(${letter.size})`,
                        top: `calc(${letter.initialTop}% + ${offsetY * letter.depth}px)`,
                        left: `${letter.initialLeft}%`
                    }}
                >
                    {letter.char}
                </div>
            ))}
        </div>
    );
};

export default Background2;
