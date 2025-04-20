import './othersCreatedMessages.css'
export default function OthersCreatedMessages({ message }) {
  return (
    <div className="received-message-container">
      <div className="received-message-bubble">{message}</div>
    </div>
  );
}
