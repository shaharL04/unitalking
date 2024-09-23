import "./footer.css";
import { useRouter } from 'next/navigation';

const Footer = ({onClickFunc}) => {

  const router = useRouter();

  const openUserSettingsPage = () => {
    router.push(`/pages/userSettings`);
  }

  return (
    <div className="footerDiv">
        <img src="/Home.svg" alt="Home icon" className="icon" />
        <button className="newChatButton" onClick={onClickFunc}>
          <img src="/Plus.svg" alt="Plus icon" className="icon" />
          New Chat
        </button>
        <button onClick={openUserSettingsPage}>
            <img src="/Settings.svg" alt="Plus icon" className="" />
        </button>
    </div>
  );
};
export default Footer
