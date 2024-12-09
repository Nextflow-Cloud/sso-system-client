import { Accessor } from "solid-js";
import { styled } from "solid-styled-components";
import { Language, useTranslate } from "../utilities/i18n";
import Link from "./primitive/Link";
import { VERSION } from "../constants";


const FooterBase = styled.footer`
    color: var(--foreground);
    margin: 1rem;
    text-align: ${(props: { desktop: boolean; }) => props.desktop ? "center" : "center"};
    z-index: 2;
    font-size: 0.875rem;
`;

const Footer = ({ desktop }: { desktop: boolean; }) => {
    const t = useTranslate();
    return (
        <FooterBase desktop={desktop}>
            <p>Nextania Account Services</p>
            <p>{t("ACCOUNT_SERVICES_VERSION")?.replace("{}", VERSION)}</p>
            <p>{t("ACCOUNT_SERVICES_COPYRIGHT")?.replace("{}", new Date().getUTCFullYear().toString())}</p>
            <p><Link href="https://nextflow.cloud/terms">{t("TERMS")}</Link> | <Link href="https://nextflow.cloud/privacy">{t("PRIVACY")}</Link></p>
        </FooterBase>
    );
};

export default Footer;
