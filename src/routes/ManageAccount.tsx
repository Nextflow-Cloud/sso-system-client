import { styled } from "solid-styled-components";
import SearchBar from "../components/primitive/Search";
import Logo from "../components/Logo";
import { RiBusinessProfileFill, RiBusinessProfileLine, RiSystemShieldKeyholeFill, RiSystemShieldKeyholeLine, RiUserFacesAccountBoxFill, RiUserFacesAccountBoxLine } from "solid-icons/ri";
import MenuItem from "../components/MenuItem";
import { Navigate, useNavigate, useParams } from "@solidjs/router";
import { Accessor, Match, Setter, Switch } from "solid-js";
import Account from "./manage/Account";
import Profile from "./manage/Profile";
import Dialog from "@corvu/dialog";
import Popover from "@corvu/popover";
import AccountContainer from "../components/AccountContainer";
import Sessions from "./manage/Sessions";
import { Show } from "solid-js";
import ContextMenuButton from "../components/ContextMenuButton";

const MainDesktop = styled.main`
    background: var(--background);
    
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;  
    width: 100%;
    height: 100%;
    justify-content: center;
`;

// import wallpaper from '../assets/test.jpg';

const ManageBase = styled.div`
    display:flex;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    border-radius: 5px;
    padding-left: 10px;
    padding-right:10px;
    height: 100%;
    min-height: 100% !important;
`;

const LeftPanel = styled.div`
    display: flex;
    flex-direction: column;
    width: 250px;
    padding-right: 10px;
    border-right: 1px solid black;
`;

const RightPanel = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;

`;

const Navigation = styled.nav`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    height: 64px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    & > * + * {
        margin-top: 20px;
    }
    overflow-y: auto;
    overflow-x: auto;
`;

const LogoContainer = styled.div`
    display: flex;
    padding: 10px;
    height: 64px;
    align-items: center;
`;

export const Section = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 400px;
`;

const Overlay = styled(Popover.Overlay)`
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const PopoverContent = styled(Popover.Content)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    z-index: 1001;
    box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.4);
`;

const ManageAccount = ({ loading, setLoading }: { loading: Accessor<boolean>; setLoading: Setter<boolean>; }) => {
    const params = useParams();
    const navigate = useNavigate();
    const logout = () => {
        navigate("/logout");
    };
    return (
        <Show when={params.category} fallback={
            <Navigate href="/manage/account" />
        }>
            <Popover placement="bottom-start">
                <MainDesktop>
                    <ManageBase>
                        <LeftPanel>
                            <LogoContainer>
                                <Logo />
                            </LogoContainer>
                            <Navigation>
                                <MenuItem Icon={RiUserFacesAccountBoxLine} BoldIcon={RiUserFacesAccountBoxFill} name="Account" id="account" active={params.category} />
                                <MenuItem Icon={RiBusinessProfileLine} BoldIcon={RiBusinessProfileFill} name="Profile" id="profile" active={params.category} />
                                <MenuItem Icon={RiSystemShieldKeyholeLine} BoldIcon={RiSystemShieldKeyholeFill} name="Sessions" id="sessions" active={params.category} />
                            </Navigation>
                        </LeftPanel>
                        <RightPanel>
                            <TopBar>
                                
                                <SearchBar />
                                <AccountContainer />
                            </TopBar>
                            <Content>
                                <Switch>
                                    <Match when={params.category === "account"}>
                                        <Dialog closeOnOutsidePointer={false}>
                                            <Account loading={loading} setLoading={setLoading} />
                                        </Dialog>
                                    </Match>
                                    <Match when={params.category === "profile"}>
                                        <Dialog closeOnOutsidePointer={false}>
                                            <Profile loading={loading} setLoading={setLoading} />
                                        </Dialog>
                                    </Match>
                                    <Match when={params.category === "sessions"}>
                                        <Sessions />
                                    </Match>
                                </Switch>
                            </Content>
                        </RightPanel>
                    </ManageBase>
                </MainDesktop>
                <Popover.Portal>
                    <Overlay />
                    <PopoverContent>
                        <ContextMenuButton onClick={logout}>Logout</ContextMenuButton>
                    </PopoverContent>
                </Popover.Portal>
            </Popover>
        </Show>
    );
}

export default ManageAccount;
