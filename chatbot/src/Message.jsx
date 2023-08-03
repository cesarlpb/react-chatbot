import React, { useState, useEffect } from "react";

const Message = ({ content }) => {
  const [typedContent, setTypedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0); // Reiniciar el índice cada vez que cambia el mensaje
  }, [content]);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeoutId = setTimeout(() => {
        setTypedContent((prevContent) => prevContent + content[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 50); // Ajusta el valor para controlar la velocidad de la animación

      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, content]);

  return <div>{typedContent}</div>;
};

export default Message;
