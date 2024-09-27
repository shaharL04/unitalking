import "./footer.css";
import { useRouter } from 'next/navigation';

const Footer = ({onClickFunc}) => {

  const router = useRouter();

  const openUserSettingsPage = () => {
    router.push(`/pages/userSettings`);
  }

  const openHomePage = () => {
    router.push(`/`);
  }

  return (
    <div className="footerDiv">
        <button onClick={openHomePage}>
            <img src="/Home.svg" alt="Home icon" className="icon" />
        </button>
        <button className="newChatButton" onClick={onClickFunc}>
          <img src="/Plus.svg" alt="Plus icon" className="icon" />
          New Chat
        </button>
        <button onClick={openUserSettingsPage}>
            <img src="/Settings.svg" alt="Setting icon" className="" />
        </button>
    </div>
  );
};
export default Footer
