import { styled } from "solid-styled-components";

const SearchBarContainer = styled.div`
    background-color: rgba(255,255,255, 0.3);
    border-radius: 5px;
    height: 100%;
`;

const SearchBarBase = styled.textarea`
    width: 100%;
    height: 100%;
    background-color: transparent;
    color: black;
    border: none;
    outline: none;
    resize: none;
    padding: 10px;
    font-size: 1.2em;
    &::placeholder {
        color: black;
    }
    white-space: nowrap;
    scrollbar-width: none;
`


const SearchBar = () => {
    return (
        <SearchBarContainer>
            <SearchBarBase placeholder="Search here..."></SearchBarBase>
        </SearchBarContainer>
    )
}

export default SearchBar;
