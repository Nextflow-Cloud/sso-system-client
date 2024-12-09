import { Accessor } from "solid-js";
import { styled } from "solid-styled-components";
import { Language, translate } from "../utilities/i18n";
import Link from "./primitive/Link";
import { VERSION } from "../constants";


const FooterBase = styled.footer`
    color: var(--foreground);
    margin: 1rem;
    text-align: ${(props: { desktop: boolean; }) => props.desktop ? "center" : "center"};
    z-index: 2;
    font-size: 0.875rem;
`;

const Footer = ({ desktop, lang }: { desktop: boolean; lang: Accessor<Language>; }) => {
    return (
        <FooterBase desktop={desktop}>
            <p>{translate(lang(), "ACCOUNT_SERVICES")}</p>
            <p>{translate(lang(), "ACCOUNT_SERVICES_VERSION").replace("{}", VERSION)}</p>
            <p>{translate(lang(), "ACCOUNT_SERVICES_COPYRIGHT").replace("{}", new Date().getUTCFullYear().toString()).replace("{}", "Nextflow Cloud Technologies")}</p>
            <p><Link href="https://nextflow.cloud/terms">{translate(lang(), "TERMS")}</Link> | <Link href="https://nextflow.cloud/privacy">{translate(lang(), "PRIVACY")}</Link></p>
        </FooterBase>
    );
};

export default Footer;
