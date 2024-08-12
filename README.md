<h1 align="center">Nextflow SSO authentication system client</h1>
<p align="center">[![License](https://img.shields.io/github/license/Nextflow-Cloud/sso-system-client)](https://github.com/Nextflow-Cloud/sso-system-client/blob/main/LICENSE)</p>

> [!WARNING]
> Initial translations are provided by AI and may not be accurate. If you see anything that doesn't look right, please submit a pull request.

## About
This is the new SolidJS based client for the [SSO system](https://github.com/Nextflow-Cloud/sso-system). The SSO system allows users to use a single account to access Nextflow services. It aims to support modern authentication practices such as asymmetrical password authenticated key exchange, WebAuthn (passkeys), and TOTP multi-factor authentication. 

## Configuration
The `NEXTFLOW_TRUSTED_SERVICES` environment variable should be set to a list of authentication routes that the token is allowed to be sent to.
