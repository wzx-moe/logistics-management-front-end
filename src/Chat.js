import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Input, Row, Col } from 'reactstrap';
import './Chat.css';  // import your CSS file

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const endOfMessagesRef = useRef(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();

        setMessages([...messages, { text: input, user: "human" }]);
        setInput("");

        // Call OpenAI's ChatGPT API
        try {
            const response = await axios.post("https://api.openai.com/v1/chat/completions", {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "user", "content": `${input}`},
                ]
            }, {
                headers: {
                    "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            });

            setMessages((messages) => [
                ...messages,
                { text: response.data['choices'][0]['message']['content'], user: "ChatGPT" },
            ]);
        } catch (error) {
            console.error("Error calling ChatGPT:", error);
        }
    };

    return (
        <div className="chat-container">
            <Row>
                <Col>
                    <div className="chat-content">
                        {messages.map((message, index) => (
                            <div key={index} className={message.user === "human" ? "human-message" : "chatbot-message"}>
                                <p className="chat-bubble">{message.text}</p>
                            </div>
                        ))}
                        <div ref={endOfMessagesRef} />
                    </div>
                    <form onSubmit={sendMessage} className="chat-input-form">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="chat-input"
                        />
                        <Button color="primary" type="submit" className="chat-submit-button">Send</Button>
                    </form>
                </Col>
            </Row>
        </div>
    );
}

export default Chat;
