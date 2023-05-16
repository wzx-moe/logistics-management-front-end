import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Input, Container, Row, Col } from 'reactstrap';

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
            const response = await axios.post(
                "https://api.openai.com/v1/engines/text-davinci-003/completions",
                {
                    prompt: `${input}\nChatGPT:`,
                    max_tokens: 60,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    },
                }
            );

            setMessages((messages) => [
                ...messages,
                { text: response.data.choices[0].text.trim(), user: "ChatGPT" },
            ]);
        } catch (error) {
            console.error("Error calling ChatGPT:", error);
        }
    };

    return (
        <Container>
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <div>
                        {messages.map((message, index) => (
                            <div key={index} className={message.user}>
                                <p>{message.text}</p>
                            </div>
                        ))}
                        <div ref={endOfMessagesRef} />
                    </div>
                    <form onSubmit={sendMessage}>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <Button color="primary" type="submit">Send</Button>
                    </form>
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;
