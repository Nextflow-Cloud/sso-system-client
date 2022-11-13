import styled from "styled-components";
import footer from "../base";

const FooterBase = styled.footer`
    color: #ffffff;
    margin: 1rem;
    text-align: ${(props: { desktop: boolean; }) => props.desktop ? "right" : "center"};
    z-index: 2;
`;

const Footer = ({ desktop, lang }: { desktop: boolean; lang: string; }) => {
    return (
        <FooterBase desktop={desktop}>
            <div class="image-credit" style={{
                textAlign: desktop ? "right" : "center",
                margin: "1rem"
            }}>
                <div>Nextflow SSO System</div>
                <div>version 0.9 build 6 (dev)</div>
                {/* Photo by <a href="https://unsplash.com/@orwhat">Richard Horvath</a> on <a href="https://unsplash.com/">Unsplash</a> */}
                <div>Copyright &copy; {new Date().getUTCFullYear()} Nextflow Cloud Technologies. All rights reserved.</div>
            </div>
        </FooterBase>
    );
};

export default Footer;
