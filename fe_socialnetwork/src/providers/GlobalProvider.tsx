import { PostProvider } from "@/context/baiVietContext"
import { CommonProvider } from "@/context/commonContext"
import { MessageProvider } from "@/context/messageStompContext"
import { PresenseProvider } from "@/context/presenseUserContext"
import { StompProvider } from "@/context/StompContext"


const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <CommonProvider>
            <PresenseProvider>
                <MessageProvider>
                    <PostProvider>
                        <StompProvider>
                            {children}
                        </StompProvider>
                    </PostProvider>
                </MessageProvider>
            </PresenseProvider>
        </CommonProvider>
    )
}

export default GlobalProvider