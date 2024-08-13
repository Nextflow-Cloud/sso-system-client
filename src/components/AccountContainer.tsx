import Popover from "@corvu/popover";
import { styled } from "solid-styled-components";



const AccountContainerBase = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AvatarContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    width: 35px;
    height: 35px;
    border-radius: 10px;
    background-color: var(--secondary-a);
`;
const AccountContainer = () => {
    const popoverContext = Popover.useDialogContext();
    const openPopover = () => {
        popoverContext.setOpen(true);
    };
    return (
        
            <Popover.Anchor>
        <AccountContainerBase>
                <AvatarContainer onClick={openPopover} />
        </AccountContainerBase>
            </Popover.Anchor>
    );
};

export default AccountContainer;
