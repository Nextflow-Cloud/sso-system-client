import { AccountSettings, Profile } from "./lib/authentication";

class Internals {
    accountSettings?: AccountSettings;
    profile?: Profile;

    setAccountSettings(settings: AccountSettings) {
        this.accountSettings = settings;
    }

    setProfile(profile: Profile) {
        this.profile = profile;
    }

    getAccountSettings() {
        return this.accountSettings;
    }

    getProfile() {
        return this.profile;
    }
}


export default Internals;
