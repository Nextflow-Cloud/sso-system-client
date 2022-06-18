const Footer = () => {
    return (
        <div class="footer">
            <div class="mobile">
                <p>This app is not natively supported on mobile yet. Please check back later, we're working on it! ;)</p>
            </div>
            <div class="image-credit" style={{
                textAlign: "right",
                margin: "1rem"
            }}>
                <div>Nextflow SSO System</div>
                <div>version 0.8 build 2 (dev)</div>
                {/* Photo by <a href="https://unsplash.com/@orwhat">Richard Horvath</a> on <a href="https://unsplash.com/">Unsplash</a> */}
                <div>Copyright &copy; {new Date().getUTCFullYear()} Nextflow Cloud Technologies. All rights reserved.</div>
            </div>
        </div>
    );
};

export default Footer;
