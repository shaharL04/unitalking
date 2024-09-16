
import "./footer.css";
const Footer = ({onClickFunc}) => {
  return (
    <div className="footerDiv">
        <img src="/Home.svg" alt="Home icon" className="icon" />
        <button className="newChatButton" onClick={onClickFunc}>
          <img src="/Plus.svg" alt="Plus icon" className="icon" />
          New Chat
        </button>
        <img src="/Settings.svg" alt="Plus icon" className="" />
    </div>
  );
};
export default Footer
