import { styled } from "solid-styled-components";
import SearchBar from "../components/primitive/Search";
import Logo from "../components/Logo";
import Input from "../components/primitive/Input";
import Button from "../components/primitive/Button";
import { RiBusinessProfileLine, RiUserFacesAccountBoxLine } from "solid-icons/ri";
import MenuItem from "../components/MenuItem";
import { Route, Router } from "@solidjs/router";
import { createSignal, Match, Switch } from "solid-js";
import Account from "./manage/Account";
import Profile from "./manage/Profile";

const MainDesktop = styled.main`
    background: var(--background);
    
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;  
    width: 100%;
    height: 100%;
    justify-content: center;

    /* backdrop-filter: brightness(1.5) */
`;

// import wallpaper from '../assets/test.jpg';

const ManageBase = styled.div`
    display:flex;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px   );
    border-radius: 5px;
    padding: 10px;
    height: 100%;
    min-height: 100% !important;
`;

const LeftPanel = styled.div`
    display: flex;
    flex-direction: column;
    width: 250px;
    border-right: 1px solid black;
`;

const RightPanel = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
`;

const Navigation = styled.nav`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Category = styled.a`
    color: black;
    text-decoration: none;
    font-size: 1em;
    padding: 10px;
    & > * + * {
        margin-left: 5px;
    }
    display: flex;
    align-items: center;
    background-color: var(--secondary-a);
    border-radius: 5px;
`;

const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    height: 64px;
`;

const AccountContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    & > * + * {
        margin-top: 20px;
    }
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

type Active = "account" | "profile";

const ManageAccount = (props: { active: Active }) => {
    return (
        <MainDesktop>
            <ManageBase>
                <LeftPanel>
                    <LogoContainer>
                        <Logo />
                    </LogoContainer>
                    <Navigation>
                        <MenuItem Icon={RiUserFacesAccountBoxLine} name="Account" id={"account"} active={props.active} />
                        <MenuItem Icon={RiBusinessProfileLine} name="Profile" id="profile" active={props.active} />
                    </Navigation>
                </LeftPanel>
                <RightPanel>
                    <TopBar>
                        
                        <SearchBar />
                        <AccountContainer> avatar goes here</AccountContainer>
                    </TopBar>
                    <Content>
                        <Switch>
                            <Match when={props.active === "account"}>
                                <Account />
                            </Match>
                            <Match when={props.active === "profile"}>
                                <Profile />
                            </Match>
                        </Switch>
                    </Content>
                </RightPanel>
            </ManageBase>
        </MainDesktop>
    );
}

export default ManageAccount;
