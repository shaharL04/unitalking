import './header.css'
import { useRouter } from 'next/navigation';
const Header = ({type, chatObject}) =>{
    let headerContent;
    const router = useRouter();

    const handleClick = () => {
        router.push('/pages/chatsList')
    }
    if (type === 'cList') {
        headerContent = <div className='specificChatHeaderDiv'>
                           <div className="circular-image-container">
                                 <img src={`http://localhost:8080/chatPhotos/${chatObject.chatImage}`} alt="Profile Image" className="circular-image" />
                            </div>
                            <div className="chatName">{chatObject.chatName}</div>
                            <div className="returnButton circular-image-container-rtn-btn"> 
                                <button onClick={handleClick}>
                                    <img src="/returnBtn.svg" alt="Plus icon" className="" /> 
                                </button>
                            </div>
                        </div>;
    } else {
        headerContent = <div className='chatListHeaderDiv'>
                            Chats
                        </div>;
    }
    return(
        <div className='headerWrapperDiv'>
            {headerContent}
        </div>
    )
}
export default Header