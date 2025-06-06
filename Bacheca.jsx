
import { useState, useEffect } from "react";

const users = ["Sinner", "Ihtsham", "Samuele", "Francesco", "Paola", "Petra", "Elena", "Daniele"];

const initialMessages = [
  { id: 1, user: "Samuele", text: "Verifica spedizione cliente", status: "pending", lastReminder: Date.now() },
  { id: 2, user: "Francesco", text: "Controlla magazzino 2", status: "pending", lastReminder: Date.now() },
  { id: 3, user: "Petra", text: "Invia report mensile", status: "done" }
];

export default function Bacheca() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(users[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.status === "pending" && Date.now() - (msg.lastReminder || 0) > 300000) {
            alert(`🔔 Promemoria per ${msg.user}: ${msg.text}`);
            return { ...msg, lastReminder: Date.now() };
          }
          return msg;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const markAsDone = (id) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, status: "done" } : msg))
    );
  };

  const addMessage = () => {
    if (!newMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: selectedUser,
      text: newMessage,
      status: "pending",
      lastReminder: Date.now(),
    };
    setMessages((prev) => [newMsg, ...prev]);
    setNewMessage("");
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          {users.map((user) => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Scrivi un nuovo messaggio"
        />
        <button onClick={addMessage}>Invia</button>
      </div>

      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            background: msg.status === "done" ? "#d4edda" : "#fff3cd",
            padding: "1rem",
            marginBottom: "0.5rem",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <strong>{msg.user}</strong>: {msg.text}
            {msg.status === "pending" && <span style={{ marginLeft: "0.5rem", color: "#856404" }}>(in attesa)</span>}
            {msg.status === "done" && <span style={{ marginLeft: "0.5rem", color: "#155724" }}>(fatto)</span>}
          </div>
          {msg.status === "pending" && (
            <button onClick={() => markAsDone(msg.id)}>Segna come fatto</button>
          )}
        </div>
      ))}
    </div>
  );
}
