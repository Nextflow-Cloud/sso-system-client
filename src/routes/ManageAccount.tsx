import { styled } from "solid-styled-components";
import SearchBar from "../components/primitive/Search";
import Logo from "../components/Logo";
import Input from "../components/primitive/Input";
import Button from "../components/primitive/Button";

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
    justify-content: space-between;
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
    font-size: 1.5em;
    padding: 10px;
`;

const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    max-height: 64px;
`;

const Account = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
`;

const LogoContainer = styled.div`
    display: flex;
    padding: 10px;
    max-height: 64px;;
    align-items: center;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    max-width: 450px;
`;

const ManageAccount = () => {
    return (
        <MainDesktop>
            <ManageBase>
                <LeftPanel>
                    <LogoContainer>
                        <Logo />
                    </LogoContainer>
                    <Navigation>
                        <Category>Account</Category>
                    </Navigation>
                </LeftPanel>
                <RightPanel>
                    <TopBar>
                        
                        <SearchBar />
                        <Account> avatar goes here</Account>
                    </TopBar>
                    <Content>
                        <h1>Manage Account</h1>
                        <Section>
                            <Input placeholder="Username" loading={false} />
                            <Input placeholder="New password" loading={false} />
                            <Button>Commit</Button>
                        </Section>
                    </Content>
                </RightPanel>
            </ManageBase>
        </MainDesktop>
    );
}

export default ManageAccount;
