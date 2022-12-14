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
            {/* <p>Nextflow SSO system</p>
            <p>version 0.10.0 (alpha)</p>
            <p>Copyright &copy; {new Date().getUTCFullYear()} Nextflow Cloud Technologies. All rights reserved.</p> */}
            {/* <div>Système SSO de Nextflow</p>
            <p>version 0.10.0 (alpha)</p>
            <p>Droits d'auteur &copy; {new Date().getUTCFullYear()} Nextflow Cloud Technologies. Tous droits réservés.</p> */}
            <p>{footer[lang as keyof typeof footer]?.ssoSystem || footer.en.ssoSystem}</p>
            <p>{(footer[lang as keyof typeof footer]?.ssoSystemVersion || footer.en.ssoSystemVersion).replace("{}", "0.10.0")}</p>
            <p>{(footer[lang as keyof typeof footer]?.ssoSystemCopyright || footer.en.ssoSystemCopyright).replace("{}", new Date().getUTCFullYear().toString())}</p>
        </FooterBase>
    );
};

export default Footer;
