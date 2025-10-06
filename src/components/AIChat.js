// src/components/AIChat.js

import React, { useState, useEffect, useRef } from 'react';

// A strong recommendation: Move your API key to a backend server. 
// Exposing it in the frontend code is a major security risk.
const API_KEY = "AIzaSyBctVeg5ZY8b0kScVVsu6wTWSOjNwMvxIs"; // Replace with your actual key

const styles = {
    aiButton: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1001,
        cursor: 'pointer',
        width: '60px', // Increased size for better visibility
        height: '60px',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Added a subtle background overlay
    },
    chatWindow: {
        width: '400px',
        height: '100vh',
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxSizing: 'border-box',
    },
    messagesContainer: {
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        paddingRight: '10px', // Prevents scrollbar from overlapping content
    },
    // This is the container for each message bubble and its copy icon
    messageWrapper: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    // Aligns the entire messageWrapper to the right for the user
    userMessageWrapper: {
        justifyContent: 'flex-end',
    },
    // Aligns the entire messageWrapper to the left for the AI
    aiMessageWrapper: {
        justifyContent: 'flex-start',
    },
    message: {
        padding: '12px',
        borderRadius: '18px', // Softer corners
        maxWidth: '85%', // Slightly less width
        color: 'white',
        lineHeight: '1.5',
    },
    userMessage: {
        backgroundColor: '#007bff',
    },
    aiMessage: {
        backgroundColor: '#282c34', // Changed color for better contrast
    },
    inputContainer: {
        display: 'flex',
        marginTop: '20px',
    },
    input: {
        flex: 1,
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #444',
        backgroundColor: '#333',
        color: 'white',
    },
    button: {
        padding: '12px 15px',
        marginLeft: '10px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        fontWeight: 'bold',
    },
    preloadedQuestions: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap',
    },
    preloadedButton: {
        padding: '8px 12px',
        borderRadius: '15px',
        border: '1px solid #555',
        cursor: 'pointer',
        backgroundColor: '#333',
        color: 'white',
        fontSize: '14px',
    },
    copyButton: {
        cursor: 'pointer',
        opacity: 0.6,
        width: '20px',
        height: '20px',
        margin: '0 8px', // Added margin for spacing
    },
    generating: {
        display: 'flex', // This is now a flex container
        justifyContent: 'flex-start', // It will align itself left
        color: '#aaa',
        fontStyle: 'italic',
    }
}

const AiIcon = () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" fill="#007bff"/>
    </svg>
);

const CopyIcon = () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="white"/>
    </svg>
);

export default function AIChat({ pageContext, isPart1Loading }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages, isGenerating]);

    const preloadedQuestions = [
        `What is Blue Orbit?`,
        `Tell me about the music.`,
        `What is the goal of this project?`,
    ];
    
  // Replace the entire handleSend function with this one

const handleSend = async (question) => {
    if (!question.trim() || isGenerating) return;

    const userMessage = { sender: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);
    
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;

    const body = {
        contents: [{
            parts: [{
                text: `Context: You are an AI assistant for the Blue Orbit project. The user is currently on the page: ${pageContext}. Answer concisely.

Question: ${question}`
            }]
        }],
        generationConfig: {
            maxOutputTokens: 250,
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        // If the response is not OK, the 'data' object itself is the error details
        if (!response.ok) {
            console.error("API Error Response:", data);
            const errorMessage = data?.error?.message || "An unknown API error occurred.";
            throw new Error(errorMessage);
        }
        
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        let aiMessage;
        if (aiResponse) {
            aiMessage = { sender: 'ai', text: aiResponse };
        } else {
            // **IMPROVED ERROR HANDLING**
            // Log the entire unexpected response object to the console for debugging
            console.error("Invalid response structure from API. Full response:", data);
            
            // Check if the prompt was blocked by Google's safety settings
            const blockReason = data.promptFeedback?.blockReason;
            if (blockReason) {
                aiMessage = { sender: 'ai', text: `My response was blocked. Reason: ${blockReason}. Please try a different question.` };
            } else {
                aiMessage = { sender: 'ai', text: `Sorry, I received an unexpected response from the API. The response is: ${JSON.stringify(data)}` };
            }
        }
        setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
        console.error("AI request failed:", error);
        const aiMessage = { sender: 'ai', text: `Sorry, an error occurred: ${error.message}` };
        setMessages(prev => [...prev, aiMessage]);
    } finally {
        setIsGenerating(false);
    }
}

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    }
    
    // Logic to decide if the floating button should be shown
    const showAiButton = !(pageContext === '/' && isPart1Loading);

    if (!isOpen) {
        return showAiButton ? <div style={styles.aiButton} onClick={() => setIsOpen(true)}><AiIcon /></div> : null;
    }

    return (
        <div style={styles.overlay} onClick={() => setIsOpen(false)}>
            <div style={styles.chatWindow} onClick={(e) => e.stopPropagation()}>
                {messages.length === 0 && (
                    <div style={styles.preloadedQuestions}>
                        {preloadedQuestions.map((q, i) => (
                            <button key={i} style={styles.preloadedButton} onClick={() => handleSend(q)}>{q}</button>
                        ))}
                    </div>
                )}
                <div style={styles.messagesContainer}>
                    {messages.map((msg, i) => {
                        // **ALIGNMENT FIX**: Apply alignment styles to the wrapper div
                        const wrapperStyle = msg.sender === 'user' 
                            ? { ...styles.messageWrapper, ...styles.userMessageWrapper }
                            : { ...styles.messageWrapper, ...styles.aiMessageWrapper };
                        
                        const messageStyle = {
                            ...styles.message, 
                            ...(msg.sender === 'user' ? styles.userMessage : styles.aiMessage)
                        };

                        return (
                            <div key={i} style={wrapperStyle}>
                                {msg.sender === 'ai' && (
                                    <span style={styles.copyButton} onClick={() => copyToClipboard(msg.text)}><CopyIcon /></span>
                                )}
                                <div style={messageStyle}>
                                    {msg.text}
                                </div>
                                {msg.sender === 'user' && (
                                    <span style={styles.copyButton} onClick={() => copyToClipboard(msg.text)}><CopyIcon /></span>
                                )}
                            </div>
                        );
                    })}
                    {isGenerating && <div style={styles.generating}>Generating...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <div style={styles.inputContainer}>
                    <input 
                        style={styles.input} 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                        placeholder="Ask something..."
                    />
                    <button style={styles.button} onClick={() => handleSend(inputValue)}>Send</button>
                </div>
            </div>
        </div>
    )
}