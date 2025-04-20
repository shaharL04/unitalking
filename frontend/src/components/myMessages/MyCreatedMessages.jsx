import './myCreatedMessages.css'
export default function MyCreatedMessages({ message }) {
  return (
    <div className="sent-message-container">
      <div className="sent-message-bubble">{message}</div>
    </div>
  );
}
